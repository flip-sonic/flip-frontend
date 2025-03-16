import { ParsedAccountData, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import { connection, program } from "./setup";



export const checkATAAndCreateTxInstructionIfNeed = async (payer: PublicKey, associatedToken: PublicKey, owner: PublicKey, mint: PublicKey) => {
    // check if account exist
    const check = await connection.getAccountInfo(associatedToken);

    let ix: TransactionInstruction | null = null;

    // Create ATA Instruction if it does not exist
    if (!check) {
        ix = createAssociatedTokenAccountInstruction(
            payer,
            associatedToken,
            owner,
            mint
        );
    }
    return ix;
}

export const getPoolByTokenAandTokenB = async (tokenA: PublicKey, tokenB: PublicKey) => {
    const fetchedAccount = await program.account.pool.all();

    let poolAccount;
    for (const pool of fetchedAccount) {
        if (pool.account.mintA.equals(tokenA) && pool.account.mintB.equals(tokenB)) {
            poolAccount = { account: pool.account, publicKey: pool.publicKey };
            break;
        } else if (pool.account.mintA.equals(tokenB) && pool.account.mintB.equals(tokenA)) {
            poolAccount = { account: pool.account, publicKey: pool.publicKey };
            break;
        }
    }

    return poolAccount || null;
}

export const getNumberDecimals = async (mint: PublicKey) => {
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

export const getUserpools = async (user: PublicKey) => {
    const fetchedAccount = await program.account.pool.all();

    const poolAccount: PublicKey[] = [];
    for (const pool of fetchedAccount) {
        if (pool.account.owner.equals(user)) {
            poolAccount.push(pool.publicKey)
        } 
    }

    return poolAccount;
}

export const getAllpools = async (user: PublicKey) => {
    const fetchedAccount = await program.account.pool.all();

    const poolAccount: {account: any, publicKey: PublicKey}[] = [];
    for (const pool of fetchedAccount) {
        if (pool.account.owner.equals(user)) {
            poolAccount.push({account: pool.account, publicKey: pool.publicKey})
        } 
    }

    return poolAccount;
}

export const getAllUsersPools = async (user: PublicKey) => {
    const fetchedAccount = await program.account.pool.all();

    const poolAccounts: {account: any, publicKey: PublicKey}[] = [];
    for (const pool of fetchedAccount) {
        poolAccounts.push({ account: pool.account, publicKey: pool.publicKey });
    }

    return poolAccounts;
}
