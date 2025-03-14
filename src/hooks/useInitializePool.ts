"use client"
import { connection } from "@/anchor/setup";
import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction, TransactionInstruction } from "@solana/web3.js";
import { useState } from "react";

export function useInitializePool() {
    const [isLoading, setIsLoading] = useState(false)
    const { publicKey, sendTransaction } = useWallet();

    const InitializePool = async (ix: TransactionInstruction[]) => {
        setIsLoading(true)

        if (!publicKey) {
            throw new Error("Wallet not connected")
        }

        try {
            // Step 3: Get the latest blockhash
            const latestBlockHash = await connection.getLatestBlockhash({ commitment: "finalized" });

            // Step 4: Create a new transaction
            const transaction = new Transaction();
            transaction.add(...ix); // Add the instruction to the transaction
            transaction.recentBlockhash = latestBlockHash.blockhash;
            transaction.feePayer = publicKey;

            // Step 5: Sign the transaction
            // Send and sign the transaction
            const signature = await sendTransaction(transaction, connection);

            // Confirm the transaction
            const confirmation = await connection.confirmTransaction(
                {
                    blockhash: latestBlockHash.blockhash,
                    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                    signature
                },
                'confirmed');
            if (confirmation && confirmation.value.err === null) {
                console.log('Transaction confirmed');
                // toast.success("Transaction successful",
                //     {
                //         action: {
                //             label: "View Transaction",
                //             onClick: () => window.open(`https://solscan.io/tx/${signature}?cluster=devnet`, "_blank")
                //         }
                //     }
                // );
            } else {
                console.error('Transaction not confirmed');
                // toast.success("Transaction not confirmed",
                //     {
                //         action: {
                //             label: "View Transaction",
                //             onClick: () => window.open(`https://solscan.io/tx/${signature}?cluster=devnet`, "_blank")
                //         }
                //     }
                // );
            }

        } catch (error) {
            console.error('Transaction error:', error);
            if (error instanceof Error) {
                // toast.error(error.message);
            } else {
                // toast.error('An unknown error occurred.');
            }

        } finally {
            // toast.dismiss(loadingId);
            setIsLoading(false)
        }

        return {InitializePool, isLoading}
    }
}