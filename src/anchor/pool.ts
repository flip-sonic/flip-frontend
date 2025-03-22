import { PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import { web3, BN } from "@coral-xyz/anchor";
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount, createSyncNativeInstruction, NATIVE_MINT, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { connection, program, signer } from "./setup";
import { checkATAAndCreateTxInstructionIfNeed, getNumberDecimals } from "./utils";
import { closewSolAccount, warp } from "@/lib/warpAndUnwarp";



export const initializeAPool = async (user: PublicKey, tokenA: PublicKey, tokenB: PublicKey, fee: number) => {

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

    const convertedFee = fee * 100;
    const ix = await program.methods.initializePool(poolBump, convertedFee)
        .accounts(accountData)
        .instruction();

    return ix;
}

export const AddLiqudityToThePool = async (user: PublicKey, poolAccount: PublicKey, tokenA_amount: number, tokenB_amount: number) => {
    try {
        if (tokenA_amount <= 0 || tokenB_amount <= 0) {
            throw new Error("Token amounts must be positive numbers.");
        }

        // Fetch the pool account
        const fetchedAccount = await program.account.pool.fetch(poolAccount);

        const ix: TransactionInstruction[] = [];

        const tokenA_decimals = await getNumberDecimals(fetchedAccount.mintA);
        const tokenB_decimals = await getNumberDecimals(fetchedAccount.mintB);

        const BNtokenA_amount = new BN(tokenA_amount * Math.pow(10, tokenA_decimals));
        const BNtokenB_amount = new BN(tokenB_amount * Math.pow(10, tokenB_decimals));

        // get  user's associated token account for user Liquidity Token
        const userLiquidityTokenAccount = await getAssociatedTokenAddress(fetchedAccount.liquidityTokenMint, user);

        const ixUserLiquidityTokenAccount = await checkATAAndCreateTxInstructionIfNeed(user, userLiquidityTokenAccount, user, fetchedAccount.liquidityTokenMint);

        if (ixUserLiquidityTokenAccount) {
            ix.push(ixUserLiquidityTokenAccount)
        }

        // get user's associated token account for token A
        const userTokenA = await getAssociatedTokenAddress(fetchedAccount.mintA, user);

        const ixUserTokenA = await checkATAAndCreateTxInstructionIfNeed(user, userTokenA, user, fetchedAccount.mintA);

        if (ixUserTokenA) {
            ix.push(ixUserTokenA)
        }

        // get user's associated token account for token B
        const userTokenB = await getAssociatedTokenAddress(fetchedAccount.mintB, user);

        const ixUserTokenB = await checkATAAndCreateTxInstructionIfNeed(user, userTokenB, user, fetchedAccount.mintB);

        if (ixUserTokenB) {
            ix.push(ixUserTokenB)
        }

        // get pool's associated token account for token A
        const poolTokenA = await getAssociatedTokenAddress(fetchedAccount.mintA, poolAccount, true);

        const ixPoolTokenA = await checkATAAndCreateTxInstructionIfNeed(user, poolTokenA, poolAccount, fetchedAccount.mintA);

        if (ixPoolTokenA) {
            ix.push(ixPoolTokenA)
        }

        // get pool's associated token account for token A
        const poolTokenB = await getAssociatedTokenAddress(fetchedAccount.mintB, poolAccount, true);

        const ixPoolTokenB = await checkATAAndCreateTxInstructionIfNeed(user, poolTokenB, poolAccount, fetchedAccount.mintB);

        if (ixPoolTokenB) {
            ix.push(ixPoolTokenB)
        }

        // const associatedTokenAccount = await getAssociatedTokenAddress(
        //     NATIVE_MINT,
        //     user
        // );

        if (fetchedAccount && fetchedAccount.mintB.equals(NATIVE_MINT)) {
            console.log(tokenB_amount)
            // const warpIx = await warp(user, tokenB_amount);

            const warpIx = (SystemProgram.transfer({
                    fromPubkey: user,
                    toPubkey: userTokenB,
                    lamports: tokenB_amount * 1000000000,
                  }),
                  createSyncNativeInstruction(userTokenB)
                )

            ix.push(warpIx)
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

        // if (fetchedAccount && fetchedAccount.mintB.equals(NATIVE_MINT)) {
        //     const warpIx = await closewSolAccount(user);

        //     ix.push(warpIx)
        // }
        console.log("ix", ix.length)
        return ix
    } catch (error) {
        console.error("Error adding liquidity:", error);
        throw new Error("Failed to add liquidity");
    }
}

export const WithdrawLiquidityFromThePool = async (user: PublicKey, poolAccount: PublicKey, liquidityToken_amount: number) => {
    try {
        if (liquidityToken_amount <= 0) {
            throw new Error("Token amounts must be positive numbers.");
        }
        // Fetch the pool account
        const fetchedAccount = await program.account.pool.fetch(poolAccount);

        const ix: TransactionInstruction[] = [];

        const liquidityToken_decimals = 9;

        const liquidityTokens = new BN(liquidityToken_amount * Math.pow(10, liquidityToken_decimals));

        // get user's associated token account for user Liquidity Token
        const userLiquidityTokenAccount = await getAssociatedTokenAddress(fetchedAccount.liquidityTokenMint, user);

        const ixUserLiquidityTokenAccount = await checkATAAndCreateTxInstructionIfNeed(user, userLiquidityTokenAccount, user, fetchedAccount.liquidityTokenMint);

        if (ixUserLiquidityTokenAccount) {
            ix.push(ixUserLiquidityTokenAccount)
        }

        // get or Create user's associated token account for token A
        const userTokenA = await getAssociatedTokenAddress(fetchedAccount.mintA, user);

        const ixUserTokenA = await checkATAAndCreateTxInstructionIfNeed(user, userTokenA, user, fetchedAccount.mintA);

        if (ixUserTokenA) {
            ix.push(ixUserTokenA)
        }

        // get user's associated token account for token B
        const userTokenB = await getAssociatedTokenAddress(fetchedAccount.mintB, user);

        const ixUserTokenB = await checkATAAndCreateTxInstructionIfNeed(user, userTokenB, user, fetchedAccount.mintB);

        if (ixUserTokenB) {
            if (fetchedAccount.mintB === NATIVE_MINT) {
                await getOrCreateAssociatedTokenAccount(
                    connection,
                    signer,
                    NATIVE_MINT,
                    user
                );
            } else {
                ix.push(ixUserTokenB)
            }

        }

        // get pool's associated token account for token A
        const poolTokenA = await getAssociatedTokenAddress(fetchedAccount.mintA, poolAccount, true);

        const ixPoolTokenA = await checkATAAndCreateTxInstructionIfNeed(user, poolTokenA, poolAccount, fetchedAccount.mintA);

        if (ixPoolTokenA) {
            ix.push(ixPoolTokenA)
        }

        // get pool's associated token account for token A
        const poolTokenB = await getAssociatedTokenAddress(fetchedAccount.mintB, poolAccount, true);

        const ixPoolTokenB = await checkATAAndCreateTxInstructionIfNeed(user, poolTokenB, poolAccount, fetchedAccount.mintB);

        if (ixPoolTokenB) {
            ix.push(ixPoolTokenB)
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

        const sol = new PublicKey("So11111111111111111111111111111111111111112");

        if (fetchedAccount.mintB.equals(sol) || fetchedAccount.mintA.equals(sol)) {
            const warpIx = await closewSolAccount(user);

            ix.push(warpIx)
        }

        return ix
    } catch (error) {
        console.error("Error withdrawing liquidity:", error);
        throw new Error("Failed to withdraw liquidity");
    }
}