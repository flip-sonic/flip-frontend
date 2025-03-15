import { Connection, ParsedAccountData, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
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