import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { program } from "./setup";
import { checkATAAndCreateTxInstructionIfNeed, getNumberDecimals, getPoolByTokenAandTokenB } from "./utils";

export const quoteSwap = async (tokenMintA: PublicKey, tokenMintB: PublicKey, tokenA_amount: number, slippageToleranceInPercentage: number, swapPoolAccount?: any) => {
    try {
        if (slippageToleranceInPercentage < 0 || slippageToleranceInPercentage > 100) {
            throw new Error("Slippage tolerance must be between 0 and 100.");
        }

        let fetchedAccount = swapPoolAccount || await getPoolByTokenAandTokenB(tokenMintA, tokenMintB);

        if (!fetchedAccount) {
            throw new Error("Token mint not found in the pool")
        }

        // Check if reserves are valid
        if (fetchedAccount.account.reserveA.isZero() || fetchedAccount.account.reserveB.isZero()) {
            throw new Error("Pool reserves are zero");
        }

        // Determine if swapping from Token A to Token B or vice versa
        const isTokenA = tokenMintA.equals(fetchedAccount.account.mintA);

        // Get token decimals
        const tokenA_decimals = await getNumberDecimals(fetchedAccount.account.mintA);
        const tokenB_decimals = await getNumberDecimals(fetchedAccount.account.mintB);

        // Convert input amount to lamports (smallest unit)
        const amount = tokenA_amount * Math.pow(10, isTokenA ? tokenA_decimals : tokenB_decimals);

        // Calculate expected output amount
        const reserveA = fetchedAccount.account.reserveA.toNumber();
        const reserveB = fetchedAccount.account.reserveB.toNumber();
        const expectedAmountOut = isTokenA
            ? (reserveB * amount) / (reserveA + amount) // Swap Token A to Token B
            : (reserveA * amount) / (reserveB + amount); // Swap Token B to Token A

        // Apply slippage tolerance
        const slippageTolerance = slippageToleranceInPercentage / 100;
        const minAmountOutLamports = Math.floor(expectedAmountOut * (1 - slippageTolerance));

        // Convert minAmountOut to token decimals
        const minAmountOut = minAmountOutLamports / Math.pow(10, isTokenA ? tokenB_decimals : tokenA_decimals);


        const forSwapFunction = {
            amountInLamports: amount,
            minAmountOutLamports
        }

        return { minAmountOut, forSwapFunction };

    } catch (error) {
        console.error("Error quoting swap:", error);
        throw new Error("Failed to quote swap");
    }
}

export const SwapOnPool = async (user: PublicKey, tokenMintA: PublicKey, tokenMintB: PublicKey, amountIn: number, slippageToleranceInPercentage: number) => {
    // console.log(user, amountIn, slippageToleranceInPercentage, tokenMintA, tokenMintB);

    // Fetch the pool account 
    const fetchedAccount = await getPoolByTokenAandTokenB(tokenMintA, tokenMintB);

    if (!fetchedAccount) {
        throw new Error("Token mint not found in the pool")
    }

    const ix: TransactionInstruction[] = [];

    // Apply slippage tolerance
    const { forSwapFunction } = await quoteSwap(tokenMintA, tokenMintB, amountIn, slippageToleranceInPercentage, fetchedAccount);

    const { mintA, bump, mintB } = fetchedAccount.account
    const poolAccount = fetchedAccount.publicKey
    // get user's associated token account for token A
    const userTokenA = await getAssociatedTokenAddress(mintA, user);

    const ixUserTokenA = await checkATAAndCreateTxInstructionIfNeed(user, userTokenA, user, mintA);

    if (ixUserTokenA) {
        ix.push(ixUserTokenA)
    }


    // get user's associated token account for token B
    const userTokenB = await getAssociatedTokenAddress(mintB, user);

    const ixUserTokenB = await checkATAAndCreateTxInstructionIfNeed(user, userTokenB, user, mintB);

    if (ixUserTokenB) {
        ix.push(ixUserTokenB)
    }

    // get or Create pool's associated token account for token A
    const poolTokenA = await getAssociatedTokenAddress(mintA, poolAccount, true);

    const ixPoolTokenA = await checkATAAndCreateTxInstructionIfNeed(user, poolTokenA, poolAccount, mintA);

    if (ixPoolTokenA) {
        ix.push(ixPoolTokenA)
    }

    // get pool's associated token account for token A
    const poolTokenB = await getAssociatedTokenAddress(mintB, poolAccount, true);

    const ixPoolTokenB = await checkATAAndCreateTxInstructionIfNeed(user, poolTokenB, poolAccount, mintB);

    if (ixPoolTokenB) {
        ix.push(ixPoolTokenB)
    }

    const accountData = {
        pool: fetchedAccount.publicKey,
        user,
        userTokenIn: userTokenA,
        userTokenOut: userTokenB,
        poolTokenIn: poolTokenA,
        poolTokenOut: poolTokenB,
        tokenProgram: TOKEN_PROGRAM_ID,
    }

    const programIx = await program.methods.swap(BN(forSwapFunction.amountInLamports), BN(forSwapFunction.minAmountOutLamports), bump)
        .accounts(accountData)
        .instruction();

    ix.push(programIx)

    return ix
}