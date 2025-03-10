"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { WalletModal } from "./WalletModal";

export function WalletButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const { publicKey, disconnect } = useWallet();

  const handleDisconnect = () => {
    setShowCloseModal(true);
  };

  const handleConfirmDisconnect = () => {
    disconnect();
    setShowCloseModal(false);
  };

  const handleCancelDisconnect = () => {
    setShowCloseModal(false);
  };

  if (publicKey) {
    return (
      <>
        <button
          onClick={handleDisconnect}
          className="py-3 px-6 inline-flex items-center gap-x-2 font-medium text-white bg-white/10 rounded-[40px] rounded-tr-lg rounded-br-[55px] backdrop-blur-md hover:bg-white/30 focus:outline-none focus:bg-white/30 disabled:opacity-30 disabled:pointer-events-none"
        >
          <span className="text-lg opacity-80">
            {publicKey.toBase58().slice(0, 5)}...{publicKey.toBase58().slice(-4)}
          </span>
        </button>
        {showCloseModal && (
          <div className="fixed z-10 inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Confirm Disconnect
              </h2>
              <p className="text-gray-600 mb-4">
                Are you sure you want to disconnect?
              </p>
              <div className="flex justify-between gap-3">
                <button
                  onClick={handleCancelDisconnect}
                  className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDisconnect}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        )}
      </>
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
