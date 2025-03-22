import { connection } from "@/anchor/setup";
import { NATIVE_MINT, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createSyncNativeInstruction, getAccount, createCloseAccountInstruction, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { LAMPORTS_PER_SOL, SystemProgram, PublicKey, TransactionInstruction } from "@solana/web3.js";

export const warp = async (user: PublicKey, amount: number) => {
    
    const associatedTokenAccount = await getAssociatedTokenAddress(
        NATIVE_MINT,
        user
    );

    const amountLamport = amount * LAMPORTS_PER_SOL;
    console.log(amountLamport)

    const wrapTransaction = (
        SystemProgram.transfer({
            fromPubkey: user,
            toPubkey: associatedTokenAccount,
            lamports: amountLamport,
        }),
        createSyncNativeInstruction(associatedTokenAccount)
    );

    return wrapTransaction
};

export const closewSolAccount = async (user: PublicKey) => {
    
    const associatedTokenAccount = await getAssociatedTokenAddress(
        NATIVE_MINT,
        user
    );
    const ix = createCloseAccountInstruction(associatedTokenAccount, user, user);

    return ix
}
