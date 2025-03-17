// import { connection } from "@/anchor/setup";
// import {NATIVE_MINT, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createSyncNativeInstruction, getAccount} from "@solana/spl-token";
// import {clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction, PublicKey} from "@solana/web3.js";

// const warp = async (user: PublicKey) => {

// const associatedTokenAccount = await getAssociatedTokenAddress(
//   NATIVE_MINT,
//   user
// )

// // Create token account to hold your wrapped SOL
// const ataTransaction = new Transaction()
//   .add(
//     createAssociatedTokenAccountInstruction(
//       wallet.publicKey,
//       associatedTokenAccount,
//       wallet.publicKey,
//       NATIVE_MINT
//     )
//   );

// await sendAndConfirmTransaction(connection, ataTransaction, [wallet]);

// // Transfer SOL to associated token account and use SyncNative to update wrapped SOL balance
// const solTransferTransaction = new Transaction()
//   .add(
//     SystemProgram.transfer({
//         fromPubkey: wallet.publicKey,
//         toPubkey: associatedTokenAccount,
//         lamports: LAMPORTS_PER_SOL
//       }),
//       createSyncNativeInstruction(
//         associatedTokenAccount
//     )
//   )

// await sendAndConfirmTransaction(connection, solTransferTransaction, [wallet]);

// const accountInfo = await getAccount(connection, associatedTokenAccount);

// console.log(`Native: ${accountInfo.isNative}, Lamports: ${accountInfo.amount}`);

// })();
