"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { WalletModal } from "./WalletModal";

export function WalletButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { publicKey, disconnect } = useWallet();


  if (publicKey) {
    return (
      <button
        onClick={() => disconnect()}
        className="py-3 px-6 inline-flex items-center gap-x-2 font-medium text-white bg-white/10 rounded-[40px] rounded-tr-lg rounded-br-[55px] backdrop-blur-md hover:bg-white/30 focus:outline-none focus:bg-white/30 disabled:opacity-30 disabled:pointer-events-none"
      >
        <span className="text-lg opacity-80">
          {publicKey.toBase58().slice(0, 5)}...{publicKey.toBase58().slice(-4)}
        </span>
        {/* <span className="border-l border-white/20 pl-2">Disconnect</span> */}
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="py-3 px-6 inline-flex items-center gap-x-2 text-lg font-medium text-white bg-white/10 rounded-[40px] rounded-tr-lg rounded-br-[55px] backdrop-blur-md hover:bg-white/30 focus:outline-none focus:bg-white/30 disabled:opacity-30 disabled:pointer-events-none"
      >
        Connect Wallet
      </button>
      <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
