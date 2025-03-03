"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

export default function Home() {
  const { publicKey } = useWallet();
  const [walletSaved, setWalletSaved] = useState(false);

  useEffect(() => {
    if (publicKey && !walletSaved) {
      const wallet_address = publicKey.toBase58();

      fetch("/api/save-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wallet_address }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          setWalletSaved(true);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [publicKey, walletSaved]);

  return (
    <div className="max-w-[80%] h-screen mx-auto flex flex-col">
      <h1>Hello {publicKey?.toBase58()} </h1>
    </div>
  );
}
