"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { BsFillLightningFill } from "react-icons/bs";
import Image from 'next/image';

export default function Navbar() {
    return (
        <nav className="max-w-[90%] mx-auto flex flex-row justify-between items-center p-4 bg-transparent bg-opacity-90" >
            <div className="flex flex-row items-center justify-center gap-2">
    <Image src="/Images/logo_desktop.png" width={60} height={60} alt="FLIP token logo" />
    <p className="text-white text-lg font-semibold">Flip Sonic</p>
</div>
            <div className="flex flex-row">
                <BsFillLightningFill className="text-[#EFAA22] text-3xl" />
                <p className="text-white text-2xl">The Ultimate high-speed swap</p>
            </div>
           <WalletMultiButton
                style={{
                     backgroundColor: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    borderRadius: "25px 5px 40px 25px",
                    color: "white",
                    padding: "14px 30px",
                    fontWeight: "bold",
                    backdropFilter: "blur(8px)",
                }}
                />
        </nav>
    )
}