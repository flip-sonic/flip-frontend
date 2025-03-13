import { clusterApiUrl, Connection, } from "@solana/web3.js";
import { Flipsonicprogram } from "./flipsonicprogram";
import idl from "./idl.json";
import { Program } from "@coral-xyz/anchor";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const program = new Program<Flipsonicprogram>(idl as Flipsonicprogram, {
    connection
});