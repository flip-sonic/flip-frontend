import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { Flipsonicprogram } from "./flipsonicprogram";
import idl from "./idl.json";
import { Program, web3, BN } from "@coral-xyz/anchor";
import { ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";

const commitment = 'processed';

export const connection = new Connection('https://api.testnet.v1.sonic.game', {
    commitment,
    wsEndpoint: 'wss://api.testnet.v1.sonic.game'
});

export const program = new Program<Flipsonicprogram>(idl as Flipsonicprogram, {
    connection
});


export const initializeAPool = async (user: PublicKey, tokenA: PublicKey, tokenB: PublicKey, feeString: string) => {

    const [poolAccount, poolBump] = PublicKey.findProgramAddressSync(
        [Buffer.from("pool"), tokenA.toBuffer(), tokenB.toBuffer(), user.toBuffer()], program.programId
    );

    // Master Contract
    const [liquidityTokenMint] = PublicKey.findProgramAddressSync(
        [Buffer.from("pool"), poolAccount.toBuffer()],
        program.programId
    );

    const accountData = {
        pool: poolAccount,
        mintA: tokenA,
        mintB: tokenB,
        liquidityTokenMint: liquidityTokenMint,
        user: user,
        systemProgram: web3.SystemProgram.programId,
        token_program: TOKEN_PROGRAM_ID,
    }

    const fee = Number(feeString);
    const ix = await program.methods.initializePool(poolBump, fee)
        .accounts(accountData)
        .instruction();

    return ix;
}

export const AddLiqudityToThePool = async (user: PublicKey, poolAccount: PublicKey, poolBump: number) => {
    // transaction initialization
    const tx = new Transaction()

    // Fetch the pool account
    const fetchedAccount = await program.account.pool.fetch(poolAccount);

    const tokenA_amount = new BN(10000 * 1e6);
    const tokenB_amount = new BN(1000000 * 1e6);

    // get  user's associated token account for user Liquidity Token
    const userLiquidityTokenAccount = await getAssociatedTokenAddress(fetchedAccount.liquidityTokenMint, user);

    // check if account exist
    const ulta = await connection.getAccountInfo(userLiquidityTokenAccount);


    // Create destination ATA if it does not exist
    if (!ulta) {
        tx.add(createAssociatedTokenAccountInstruction(
            user,
            userLiquidityTokenAccount,
            user,
            fetchedAccount.liquidityTokenMint
        ));
    }

    // get user's associated token account for token A
    const userTokenA = await getAssociatedTokenAddress(fetchedAccount.mintA, user);

    // check if account exist
    const uta = await connection.getAccountInfo(userTokenA);


    // Create destination ATA if it does not exist
    if (!uta) {
        tx.add(createAssociatedTokenAccountInstruction(
            user,
            userTokenA,
            user,
            fetchedAccount.mintA
        ));
    }

    // get user's associated token account for token B
    const userTokenB = await getAssociatedTokenAddress(fetchedAccount.mintB, user);

    // check if account exist
    const utb = await connection.getAccountInfo(userTokenB);


    // Create destination ATA if it does not exist
    if (!utb) {
        tx.add(createAssociatedTokenAccountInstruction(
            user,
            userTokenB,
            user,
            fetchedAccount.mintB
        ));
    }

    // get pool's associated token account for token A
    const poolTokenA = await getAssociatedTokenAddress(fetchedAccount.mintA, poolAccount, true);

    // check if account exist
    const pta = await connection.getAccountInfo(poolTokenA);


    // Create destination ATA if it does not exist
    if (!pta) {
        tx.add(createAssociatedTokenAccountInstruction(
            poolAccount,
            poolTokenA,
            poolAccount,
            fetchedAccount.mintA
        ));
    }

    // get pool's associated token account for token A
    const poolTokenB = await getAssociatedTokenAddress(fetchedAccount.mintB, poolAccount, true);

    // check if account exist
    const ptb = await connection.getAccountInfo(poolTokenB);


    // Create destination ATA if it does not exist
    if (!ptb) {
        tx.add(createAssociatedTokenAccountInstruction(
            poolAccount,
            poolTokenB,
            poolAccount,
            fetchedAccount.mintB
        ));
    }


    const accountData = {
        liquidityTokenMint: fetchedAccount.liquidityTokenMint,
        pool: poolAccount,
        userLiquidityTokenAccount: userLiquidityTokenAccount,
        user,
        userTokenA: userTokenA,
        userTokenB: userTokenB,
        poolTokenA: poolTokenA,
        poolTokenB: poolTokenB,
        userLiquidityToken: userLiquidityTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
    }

    const signature = await program.methods.addLiquidity(tokenA_amount, tokenB_amount, poolBump)
        .accounts(accountData)
        .instruction();

    console.log("Signature", signature);
}

export const WithdrawLiquidityToThePool = async (user: PublicKey, poolAccount: PublicKey, poolBump: number) => {
    // transaction initialization
    const tx = new Transaction()

    // Fetch the pool account
    const fetchedAccount = await program.account.pool.fetch(poolAccount);

    const liquidityTokens = new BN(10 * 1e9);
    // get or Create user's associated token account for user Liquidity Token
    const userLiquidityTokenAccount = await getAssociatedTokenAddress(fetchedAccount.liquidityTokenMint, user);

    // check if account exist
    const ulta = await connection.getAccountInfo(userLiquidityTokenAccount);

    // Create destination ATA if it does not exist
    if (!ulta) {
        tx.add(createAssociatedTokenAccountInstruction(
            user,
            userLiquidityTokenAccount,
            user,
            fetchedAccount.liquidityTokenMint
        ));
    }

    // get or Create user's associated token account for token A
    const userTokenA = await getAssociatedTokenAddress(fetchedAccount.mintA, user);

    // check if account exist
    const uta = await connection.getAccountInfo(userTokenA);


    // Create destination ATA if it does not exist
    if (!uta) {
        tx.add(createAssociatedTokenAccountInstruction(
            user,
            userTokenA,
            user,
            fetchedAccount.mintA
        ));
    }

    // get or Create user's associated token account for token B
    const userTokenB = await getAssociatedTokenAddress(fetchedAccount.mintB, user);

    // check if account exist
    const utb = await connection.getAccountInfo(userTokenB);


    // Create destination ATA if it does not exist
    if (!utb) {
        tx.add(createAssociatedTokenAccountInstruction(
            user,
            userTokenB,
            user,
            fetchedAccount.mintB
        ));
    }

    // get or Create pool's associated token account for token A
    const poolTokenA = await getAssociatedTokenAddress(fetchedAccount.mintA, poolAccount, true);

    // check if account exist
    const pta = await connection.getAccountInfo(poolTokenA);


    // Create destination ATA if it does not exist
    if (!pta) {
        tx.add(createAssociatedTokenAccountInstruction(
            poolAccount,
            poolTokenA,
            poolAccount,
            fetchedAccount.mintA
        ));
    }

    // get or Create pool's associated token account for token A
    const poolTokenB = await getAssociatedTokenAddress(fetchedAccount.mintB, poolAccount, true);

    // check if account exist
    const ptb = await connection.getAccountInfo(poolTokenB);


    // Create destination ATA if it does not exist
    if (!ptb) {
        tx.add(createAssociatedTokenAccountInstruction(
            poolAccount,
            poolTokenB,
            poolAccount,
            fetchedAccount.mintB
        ));
    }

    const accountData = {
        liquidityTokenMint: fetchedAccount.liquidityTokenMint,
        pool: poolAccount,
        userLiquidityTokenAccount: userLiquidityTokenAccount,
        user,
        userTokenA: userTokenA,
        userTokenB: userTokenB,
        poolTokenA: poolTokenA,
        poolTokenB: poolTokenB,
        tokenProgram: TOKEN_PROGRAM_ID,
    }

    const signature = await program.methods.removeLiquidity(liquidityTokens, poolBump)
        .accounts(accountData)
        .instruction();

    console.log("Signature", signature);
}

export const SwapToThePool = async (user: PublicKey, poolAccount: PublicKey, poolBump: number) => {
    // transaction initialization
    const tx = new Transaction()

    // Fetch the pool account
    const fetchedAccount = await program.account.pool.fetch(poolAccount);

    // Perform a swap
    const slippageTolerance = 0.005; // 0.5%
    const amount = 10 * 1e6
    const amountIn = new BN(amount);
    const reserveA = fetchedAccount.reserveA.toNumber();
    const reserveB = fetchedAccount.reserveB.toNumber();

    // Calculate expected output
    const expectedAmountOut = (reserveB * amount) / (reserveA + amount);

    // Apply slippage tolerance
    const minAmountOut = new BN(Math.floor(expectedAmountOut * (1 - slippageTolerance)));

    console.log(9 * 1e6)

    // get or Create user's associated token account for user Liquidity Token
    const userLiquidityTokenAccount = await getAssociatedTokenAddress(fetchedAccount.liquidityTokenMint, user);

    // check if account exist
    const ulta = await connection.getAccountInfo(userLiquidityTokenAccount);

    // Create destination ATA if it does not exist
    if (!ulta) {
        tx.add(createAssociatedTokenAccountInstruction(
            user,
            userLiquidityTokenAccount,
            user,
            fetchedAccount.liquidityTokenMint
        ));
    }

    // get or Create user's associated token account for token A
    const userTokenA = await getAssociatedTokenAddress(fetchedAccount.mintA, user);

    // check if account exist
    const uta = await connection.getAccountInfo(userTokenA);


    // Create destination ATA if it does not exist
    if (!uta) {
        tx.add(createAssociatedTokenAccountInstruction(
            user,
            userTokenA,
            user,
            fetchedAccount.mintA
        ));
    }

    // get or Create user's associated token account for token B
    const userTokenB = await getAssociatedTokenAddress(fetchedAccount.mintB, user);

    // check if account exist
    const utb = await connection.getAccountInfo(userTokenB);


    // Create destination ATA if it does not exist
    if (!utb) {
        tx.add(createAssociatedTokenAccountInstruction(
            user,
            userTokenB,
            user,
            fetchedAccount.mintB
        ));
    }

    // get or Create pool's associated token account for token A
    const poolTokenA = await getAssociatedTokenAddress(fetchedAccount.mintA, poolAccount, true);

    // check if account exist
    const pta = await connection.getAccountInfo(poolTokenA);


    // Create destination ATA if it does not exist
    if (!pta) {
        tx.add(createAssociatedTokenAccountInstruction(
            poolAccount,
            poolTokenA,
            poolAccount,
            fetchedAccount.mintA
        ));
    }

    // get or Create pool's associated token account for token A
    const poolTokenB = await getAssociatedTokenAddress(fetchedAccount.mintB, poolAccount, true);

    // check if account exist
    const ptb = await connection.getAccountInfo(poolTokenB);


    // Create destination ATA if it does not exist
    if (!ptb) {
        tx.add(createAssociatedTokenAccountInstruction(
            poolAccount,
            poolTokenB,
            poolAccount,
            fetchedAccount.mintB
        ));
    }

    const accountData = {
        liquidityTokenMint: fetchedAccount.liquidityTokenMint,
        pool: poolAccount,
        userLiquidityTokenAccount: userLiquidityTokenAccount,
        user,
        userTokenIn: userTokenA,
        userTokenOut: userTokenB,
        poolTokenIn: poolTokenA,
        poolTokenOut: poolTokenB,
        tokenProgram: TOKEN_PROGRAM_ID,
    }

    const signature = await program.methods.swap(amountIn, minAmountOut, poolBump)
        .accounts(accountData)
        .instruction();

    console.log("Signature", signature);
}

// const signTx = async (ix: TransactionInstruction[], user: PublicKey) => {
    


//     // Step 3: Get the latest blockhash
//     const latestBlockHash = await connection.getLatestBlockhash({ commitment: "finalized" });

//     // Step 4: Create a new transaction
//     const transaction = new Transaction();
//     transaction.add(...ix); // Add the instruction to the transaction
//     transaction.recentBlockhash = latestBlockHash.blockhash;
//     transaction.feePayer = user;

//     // Step 5: Sign the transaction
//     // Send and sign the transaction
//     const signature = await sendTransaction(transaction, connection);

//     // Confirm the transaction
//     const confirmation = await connection.confirmTransaction(
//         {
//             blockhash: latestBlockHash.blockhash,
//             lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
//             signature
//         },
//         'confirmed');
// }