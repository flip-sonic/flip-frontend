import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { Flipsonicprogram } from "./flipsonicprogram";
import idl from "./idl.json";
import { Program, web3, BN } from "@coral-xyz/anchor";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const program = new Program<Flipsonicprogram>(idl as Flipsonicprogram, {
    connection
});


export const initializeAPool = async (user: PublicKey, tokenA: PublicKey, tokenB: PublicKey) => {

    const [poolAccount, poolBump] = PublicKey.findProgramAddressSync(
        [Buffer.from("pool"), tokenA.toBuffer(), tokenB.toBuffer(), user.toBuffer()],program.programId
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

    const fee = 30;
    const signature = await program.methods.initializePool(poolBump, fee)
      .accounts(accountData)
      .instruction();

    console.log("Signature", signature);

    // Fetch the pool account to verify its state
    const fetchedAccount = await program.account.pool.fetch(poolAccount);
    console.log("Fetched Pool Account:", fetchedAccount);
}

export const AddLiqudityToThePool = async (user: PublicKey, tokenA: PublicKey, tokenB: PublicKey) => {

     const [poolAccount, poolBump] = PublicKey.findProgramAddressSync(
        [Buffer.from("pool"), tokenA.toBuffer(), tokenB.toBuffer(), user.toBuffer()],program.programId
    );

    const [liquidityTokenMint] = PublicKey.findProgramAddressSync(
        [Buffer.from("pool"), poolAccount.toBuffer()],
        program.programId
    );

    // Fetch the pool account
    const fetchedAccount = await program.account.pool.fetch(poolAccount);

    const tokenA_amount = new BN(10000 * 1e6);
    const tokenB_amount = new BN(1000000 * 1e6);

    // get or Create user's associated token account for user Liquidity Token
    const userLiquidityTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      signer, // Fee payer
      fetchedAccount.liquidityTokenMint,
      user
    );

    // get or Create user's associated token account for token A
    const userTokenA = await getOrCreateAssociatedTokenAccount(
      connection,
      signer, // Fee payer
      tokenA,
      user,
    );

    // get or Create user's associated token account for token B
    const userTokenB = await getOrCreateAssociatedTokenAccount(
      connection,
      signer, // Fee payer
      tokenB,
      user,
    );

    // get or Create pool's associated token account for token A
    const poolTokenA = await getOrCreateAssociatedTokenAccount(
      connection,
      signer, // Fee payer
      tokenA,
      poolAccount,
      true
    );

    // get or Create pool's associated token account for token B
    const poolTokenB = await getOrCreateAssociatedTokenAccount(
      connection,
      signer, // Fee payer
      tokenB,
      poolAccount,
      true
    );


    const accountData = {
      liquidityTokenMint,
      pool: poolAccount,
      userLiquidityTokenAccount: userLiquidityTokenAccount.address,
      user,
      userTokenA: userTokenA.address,
      userTokenB: userTokenB.address,
      poolTokenA: poolTokenA.address,
      poolTokenB: poolTokenB.address,
      userLiquidityToken: userLiquidityTokenAccount.address,
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

export const WithdrawLiquidityToThePool = async (user: PublicKey, tokenA: PublicKey, tokenB: PublicKey) => {

     const [poolAccount, poolBump] = PublicKey.findProgramAddressSync(
        [Buffer.from("pool"), tokenA.toBuffer(), tokenB.toBuffer(), user.toBuffer()],program.programId
    );

    const [liquidityTokenMint] = PublicKey.findProgramAddressSync(
        [Buffer.from("pool"), poolAccount.toBuffer()],
        program.programId
    );

    // Fetch the pool account
    const fetchedAccount = await program.account.pool.fetch(poolAccount);

    const liquidityTokens = new BN(10 * 1e9);

    // get or Create user's associated token account for user Liquidity Token
    const userLiquidityTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      signer, // Fee payer
      fetchedAccount.liquidityTokenMint,
      user,
    );

    // get or Create user's associated token account for token A
    const userTokenA = await getOrCreateAssociatedTokenAccount(
      connection,
      signer, // Fee payer
      tokenA,
      user,
    );

    // get or Create user's associated token account for token B
    const userTokenB = await getOrCreateAssociatedTokenAccount(
      connection,
      signer, // Fee payer
      tokenB,
      user,
    );

    // get or Create pool's associated token account for token A
    const poolTokenA = await getOrCreateAssociatedTokenAccount(
      connection,
      signer, // Fee payer
      tokenA,
      poolAccount,
      true
    );

    // get or Create pool's associated token account for token B
    const poolTokenB = await getOrCreateAssociatedTokenAccount(
      connection,
      signer, // Fee payer
      tokenB,
      poolAccount,
      true
    );


    const accountData = {
      liquidityTokenMint,
      pool: poolAccount,
      userLiquidityTokenAccount: userLiquidityTokenAccount.address,
      user,
      userTokenA: userTokenA.address,
      userTokenB: userTokenB.address,
      poolTokenA: poolTokenA.address,
      poolTokenB: poolTokenB.address,
      tokenProgram: TOKEN_PROGRAM_ID,
    }

    const signature = await program.methods.removeLiquidity(liquidityTokens, poolBump)
      .accounts(accountData)
      .signers([])
      .rpc();

    console.log("Signature", signature);
}

export const SwapToThePool = async (user: PublicKey, tokenA: PublicKey, tokenB: PublicKey) => {
     const [poolAccount, poolBump] = PublicKey.findProgramAddressSync(
        [Buffer.from("pool"), tokenA.toBuffer(), tokenB.toBuffer(), user.toBuffer()],program.programId
    );

    const [liquidityTokenMint] = PublicKey.findProgramAddressSync(
        [Buffer.from("pool"), poolAccount.toBuffer()],
        program.programId
    );

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
    const userLiquidityTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      signer, // Fee payer
      fetchedAccount.liquidityTokenMint,
      user,
    );

    // get or Create user's associated token account for token A
    const userTokenA = await getOrCreateAssociatedTokenAccount(
      connection,
      signer, // Fee payer
      tokenA,
      user,
    );

    // get or Create user's associated token account for token B
    const userTokenB = await getOrCreateAssociatedTokenAccount(
      connection,
      signer, // Fee payer
      tokenB,
      user,
    );

    // get or Create pool's associated token account for token A
    const poolTokenA = await getOrCreateAssociatedTokenAccount(
      connection,
      signer, // Fee payer
      tokenA,
      poolAccount,
      true
    );

    // get or Create pool's associated token account for token B
    const poolTokenB = await getOrCreateAssociatedTokenAccount(
      connection,
      signer, // Fee payer
      tokenB,
      poolAccount,
      true
    );

    const accountData = {
      liquidityTokenMint,
      pool: poolAccount,
      userLiquidityTokenAccount: userLiquidityTokenAccount.address,
      user,
      userTokenIn: userTokenA.address,
      userTokenOut: userTokenB.address,
      poolTokenIn: poolTokenA.address,
      poolTokenOut: poolTokenB.address,
      tokenProgram: TOKEN_PROGRAM_ID,
    }

    const signature = await program.methods.swap(amountIn, minAmountOut, poolBump)
      .accounts(accountData)
      .instruction();

    console.log("Signature", signature);
}