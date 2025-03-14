import { useState } from "react";
import Image from "next/image";

import { ChevronDown, Circle, DollarSign, Wallet, Palette } from "lucide-react";
// import { FaXTwitter } from "react-icons/fa6";

export default function SwapLiquidity() {
  return (
    <div className="flex justify-center bg-cover bg-center">
      <div className="bg-[#00042380] bg-opacity-50 p-4 rounded-2xl w-full max-w-sm text-white shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-x-2">
            <button className="bg-[#001AEF] text-white px-4 py-2 rounded-[10px] font-semibold text-sm">
              Swap
            </button>
            <button className="bg-[#040C6E] text-[#A0A0FF] px-4 py-2 rounded-[10px] font-semibold text-sm">
              Liquidity
            </button>
          </div>

          <div className="bg-[#34359C] text-white px-4 py-2 rounded-[10px] text-sm font-medium flex gap-x-2 ml-auto">
            <Palette size={20} className="text-white" /> Flip
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-center bg-cover bg-center">
            <div className="justify-between bg-[#000423] p-4 rounded-2xl shadow-lg w-[350px]">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-x-2">
                  <button className="bg-[#17175B] text-[#A0A0FF] px-4 py-2 rounded-[10px] font-semibold flex items-center gap-2">
                    <Image
                      src="/sol.svg" // Update the path with the correct logo
                      alt="Solana Logo"
                      width={20}
                      height={20}
                    />
                    <span className="text-white">SOL</span>
                    <span className="text-[#FF646A] text-xs">-7%</span>
                    <ChevronDown size={14} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Token Supply and Holders */}
              <div className="text-[#b6b6cf] text-[8px]">
                <span>Total Supply: 100B</span>{" "}
                <span className="ml-2">Holders: 1.8M</span>
              </div>
              <div className="flex mt-2">
                <label className="text-[#b6b6cf] text-xs flex items-center gap-1">
                  <Wallet size={14} className="text-white" />
                  10052 SOL
                </label>
                <input
                  type="text"
                  value="10052"
                  className="bg-transparent text-white text-right text-2xl font-bold outline-none w-28"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
