import { Connection, Keypair } from "@solana/web3.js";
import { Flipsonicprogram } from "./flipsonicprogram";
import idl from "./idl.json";
import { Program, web3, BN } from "@coral-xyz/anchor";

const commitment = 'processed';

export const connection = new Connection('https://api.testnet.v1.sonic.game', {
    commitment,
    wsEndpoint: 'wss://api.testnet.v1.sonic.game'
});

export const program = new Program<Flipsonicprogram>(idl as Flipsonicprogram, {
    connection
});

// const key = process.env.NEXT_PUBLIC_SIGNER;
// export const signer = Keypair.fromSecretKey(
//     new Uint8Array(key ? JSON.parse(key) : [])
// );

