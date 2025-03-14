import { Connection, ParsedAccountData, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { Flipsonicprogram } from "./flipsonicprogram";
import idl from "./idl.json";
import { Program, web3, BN } from "@coral-xyz/anchor";
import { ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { get } from "http";

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

export const AddLiqudityToThePool = async (user: PublicKey, poolAccount: PublicKey, tokenA_amount: number, tokenB_amount: number ) => {
 
    // Fetch the pool account
    const fetchedAccount = await program.account.pool.fetch(poolAccount);   


    let ix: TransactionInstruction[] = [];

    const tokenA_decimals = await getNumberDecimals(fetchedAccount.mintA);
    const tokenB_decimals = await getNumberDecimals(fetchedAccount.mintB);

    const BNtokenA_amount = new BN(tokenA_amount * Math.pow(10, tokenA_decimals));
    const BNtokenB_amount = new BN(tokenB_amount * Math.pow(10, tokenB_decimals));

    // get  user's associated token account for user Liquidity Token
    const userLiquidityTokenAccount = await getAssociatedTokenAddress(fetchedAccount.liquidityTokenMint, user);

    // check if account exist
    const ulta = await connection.getAccountInfo(userLiquidityTokenAccount);


    // Create destination ATA if it does not exist
    if (!ulta) {
        ix.push(createAssociatedTokenAccountInstruction(
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
        ix.push(createAssociatedTokenAccountInstruction(
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
        ix.push(createAssociatedTokenAccountInstruction(
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
        ix.push(createAssociatedTokenAccountInstruction(
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
        ix.push(createAssociatedTokenAccountInstruction(
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

    const programIx = await program.methods.addLiquidity(BNtokenA_amount, BNtokenB_amount, fetchedAccount.bump)
        .accounts(accountData)
        .instruction();

    ix.push(programIx)

    return ix
}

export const WithdrawLiquidityFromThePool = async (user: PublicKey, poolAccount: PublicKey, tokenA_amount: number, tokenB_amount: number, liquidityToken_amount: number) => {
     // Fetch the pool account
     const fetchedAccount = await program.account.pool.fetch(poolAccount);   

     let ix: TransactionInstruction[] = [];

    const tokenA_decimals = await getNumberDecimals(fetchedAccount.mintA);
    const tokenB_decimals = await getNumberDecimals(fetchedAccount.mintB);
     const liquidityToken_decimmals = 9;
     
    const BNtokenA_amount = new BN(tokenA_amount * Math.pow(10, tokenA_decimals));
    const BNtokenB_amount = new BN(tokenB_amount * Math.pow(10, tokenB_decimals));
    const liquidityTokens = new BN(liquidityToken_amount * Math.pow(10, liquidityToken_decimmals));

    // get or Create user's associated token account for user Liquidity Token
    const userLiquidityTokenAccount = await getAssociatedTokenAddress(fetchedAccount.liquidityTokenMint, user);

    // check if account exist
    const ulta = await connection.getAccountInfo(userLiquidityTokenAccount);

    // Create destination ATA if it does not exist
    if (!ulta) {
        ix.push(createAssociatedTokenAccountInstruction(
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
        ix.push(createAssociatedTokenAccountInstruction(
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
        ix.push(createAssociatedTokenAccountInstruction(
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
        ix.push(createAssociatedTokenAccountInstruction(
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
        ix.push(createAssociatedTokenAccountInstruction(
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

    const programIx = await program.methods.removeLiquidity(liquidityTokens, fetchedAccount.bump)
        .accounts(accountData)
        .instruction();

    ix.push(programIx)
    
        
        return ix
}

export const qouteSwap = async (tokenMintA: PublicKey, tokenMintB: PublicKey, tokenA_amount: number, slippageToleranceInPercentage: number, swapPoolAccount?: any) => {
    let fetchedAccount: {
        account: {
            mintA: PublicKey;
            mintB: PublicKey;
            owner: PublicKey;
            reserveA: BN;
            reserveB: BN;
            fee: number;
            bump: number;
            liquidityTokenMint: PublicKey;
            totalLiquidity: BN;
        };
        publicKey: PublicKey;
    } | null
    if (swapPoolAccount){
        fetchedAccount = swapPoolAccount
    } else {
     // Fetch the pool account 
    fetchedAccount = await getPoolByTokenAandTokenB(tokenMintA, tokenMintB);

    }

    if(!fetchedAccount) {
        throw new Error("Token mint not found in the pool")
    }

    // Check
    const slippageTolerance = slippageToleranceInPercentage / 100; 

    const tokenA_decimals = await getNumberDecimals(fetchedAccount.account.mintA);
    const tokenB_decimals = await getNumberDecimals(fetchedAccount.account.mintB);

    let amount: number;
    let isTokenA: boolean;
    if(tokenMintA.equals(fetchedAccount.account.mintA)){
        amount = tokenA_amount * Math.pow(10, tokenA_decimals);
        isTokenA = true
    } else {
        amount = tokenA_amount * Math.pow(10, tokenA_decimals);
        isTokenA = false
    }

    let expectedAmountOut: number;
if (isTokenA){
    const reserveA = fetchedAccount.account.reserveA.toNumber();
    const reserveB = fetchedAccount.account.reserveB.toNumber();
    expectedAmountOut = (reserveB * amount) / (reserveA + amount);
} else {
    const reserveA = fetchedAccount.account.reserveB.toNumber();
    const reserveB = fetchedAccount.account.reserveA.toNumber();
    expectedAmountOut = (reserveB * amount) / (reserveA + amount);
}

    // Apply slippage tolerance
    const minAmountOut = Math.floor(expectedAmountOut * (1 - slippageTolerance));

    const result = {
        minAmountOut: (minAmountOut * Math.pow(10, tokenB_decimals)),
        tokenA_decimals: tokenA_decimals,
        tokenB_decimals: tokenB_decimals
    }

    return result;
}

export const SwapOnPool = async (user: PublicKey, tokenMintA: PublicKey, tokenMintB: PublicKey, amountIn: number, slippageToleranceInPercentage: number) => {
    
    // Fetch the pool account 
    const fetchedAccount = await getPoolByTokenAandTokenB(tokenMintA, tokenMintB);

    if(!fetchedAccount) {
        throw new Error("Token mint not found in the pool")
    }

    let ix: TransactionInstruction[] = [];

    // Apply slippage tolerance
    const minAmountOut = await qouteSwap(tokenMintA, tokenMintB, amountIn, slippageToleranceInPercentage, fetchedAccount);

    const {mintA, bump, mintB} = fetchedAccount.account
    const poolAccount = fetchedAccount.publicKey
    // get user's associated token account for token A
    const userTokenA = await getAssociatedTokenAddress(mintA, user);

    // check if account exist
    const uta = await connection.getAccountInfo(userTokenA);

    // Create destination ATA if it does not exist
    if (!uta) {
        ix.push(createAssociatedTokenAccountInstruction(
            user,
            userTokenA,
            user,
            mintA
        ));
    }

    // get user's associated token account for token B
    const userTokenB = await getAssociatedTokenAddress(mintB, user);

    // check if account exist
    const utb = await connection.getAccountInfo(userTokenB);


    // Create destination ATA if it does not exist
    if (!utb) {
        ix.push(createAssociatedTokenAccountInstruction(
            user,
            userTokenB,
            user,
            mintB
        ));
    }

    // get or Create pool's associated token account for token A
    const poolTokenA = await getAssociatedTokenAddress(mintA, poolAccount, true);

    // check if account exist
    const pta = await connection.getAccountInfo(poolTokenA);


    // Create destination ATA if it does not exist
    if (!pta) {
        ix.push(createAssociatedTokenAccountInstruction(
            poolAccount,
            poolTokenA,
            poolAccount,
            mintA
        ));
    }

    // get pool's associated token account for token A
    const poolTokenB = await getAssociatedTokenAddress(mintB, poolAccount, true);

    // check if account exist
    const ptb = await connection.getAccountInfo(poolTokenB);


    // Create destination ATA if it does not exist
    if (!ptb) {
        ix.push(createAssociatedTokenAccountInstruction(
            poolAccount,
            poolTokenB,
            poolAccount,
            mintB
        ));
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

    const programIx = await program.methods.swap(amountIn, minAmountOut, bump)
        .accounts(accountData)
        .instruction();

    ix.push(programIx)

    return ix
}

const getPoolByTokenAandTokenB = async (tokenA: PublicKey, tokenB: PublicKey) => {
   const fetchedAccount = await program.account.pool.all();

   let poolAccount;
   for (const pool of fetchedAccount) {
       if(pool.account.mintA.equals(tokenA) && pool.account.mintB.equals(tokenB)){
        poolAccount = {account: pool.account, publicKey: pool.publicKey};
        break;
       } else if(pool.account.mintA.equals(tokenB) && pool.account.mintB.equals(tokenA)){
        poolAccount = {account: pool.account, publicKey: pool.publicKey};
        break;
       }
   }

   return poolAccount || null;
}

 const getNumberDecimals = async(mint: PublicKey) => {
    try {

        const info = await connection.getParsedAccountInfo(mint);
        if (!info.value) {
            throw new Error("Account info not found");
        }
        const result = (info.value.data as ParsedAccountData).parsed.info.decimals as number;

        return result;
    } catch (error) {
        throw new Error("decimal not found")
    }
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