import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { program } from "./setup";
import { quoteSwap, SwapOnPool } from "./swap";

const findBestRoute = async (
    tokenMintA: PublicKey,
    tokenMintB: PublicKey,
    amountIn: number,
    slippageToleranceInPercentage: number
) => {
    // Fetch all pools
    const allPools = await program.account.pool.all();

    // Build the graph
    const graph = buildGraph(allPools);

    // Find the shortest path
    const path = findMultiHopRoute(
        graph,
        tokenMintA.toBase58(),
        tokenMintB.toBase58()
    );

    if (!path) {
        throw new Error("No valid route found for the swap");
    }

    // Calculate the expected output for the entire path
    let remainingAmountIn = amountIn;
    let minAmountOut = 0;

    for (let i = 0; i < path.length; i++) {
        const pool = await program.account.pool.fetch(path[i]);

        const { minAmountOut: poolMinAmountOut } = await quoteSwap(
            tokenMintA,
            tokenMintB,
            remainingAmountIn,
            slippageToleranceInPercentage,
            pool
        );

        minAmountOut = poolMinAmountOut;
        remainingAmountIn = poolMinAmountOut;
    }

    return {
        pools: path,
        minAmountOut,
    };
};

export const aggregateSwap = async (
    user: PublicKey,
    tokenMintA: PublicKey,
    tokenMintB: PublicKey,
    amountIn: number,
    slippageToleranceInPercentage: number
) => {
    // Find the best route for the swap
    const { pools, minAmountOut } = await findBestRoute(
        tokenMintA,
        tokenMintB,
        amountIn,
        slippageToleranceInPercentage
    );

    // Create instructions array
    const ix: TransactionInstruction[] = [];

    // Execute the swap across multiple pools
    let remainingAmountIn = amountIn;
    let remainingMinAmountOut = minAmountOut;

    for (let i = 0; i < pools.length; i++) {
        const pool = pools[i];
        const poolAccount = await program.account.pool.fetch(pool);

        // Determine the input and output tokens for this step
        const inputToken = i === 0 ? tokenMintA : tokenMintB;
        const outputToken = i === pools.length - 1 ? tokenMintB : tokenMintA;

        // Create swap instructions for this pool
        const swapIx = await SwapOnPool(
            user,
            inputToken,
            outputToken,
            remainingAmountIn,
            slippageToleranceInPercentage
        );

        // Add the instructions to the array
        ix.push(...swapIx);

        // Update remaining amounts
        remainingAmountIn = remainingMinAmountOut;
        remainingMinAmountOut = 0;
    }

    return ix;
};

const buildGraph = (pools: any[]) => {
    const graph: { [key: string]: { [key: string]: PublicKey } } = {};

    for (const pool of pools) {
        const mintA = pool.account.mintA.toBase58();
        const mintB = pool.account.mintB.toBase58();

        if (!graph[mintA]) {
            graph[mintA] = {};
        }
        if (!graph[mintB]) {
            graph[mintB] = {};
        }

        graph[mintA][mintB] = pool.publicKey;
        graph[mintB][mintA] = pool.publicKey;
    }

    return graph;
};

const findMultiHopRoute = (
    graph: { [key: string]: { [key: string]: PublicKey } },
    start: string,
    end: string
) => {
    const queue: { token: string; path: PublicKey[] }[] = [{ token: start, path: [] }];
    const visited = new Set<string>();

    while (queue.length > 0) {
        const { token, path } = queue.shift()!;

        if (token === end) {
            return path;
        }

        if (visited.has(token)) {
            continue;
        }
        visited.add(token);

        for (const neighbor in graph[token]) {
            queue.push({
                token: neighbor,
                path: [...path, graph[token][neighbor]],
            });
        }
    }

    return null;
};