"use client";

import { FC, useEffect } from "react";
import { useState } from "react";
// import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { Lock, Search } from "lucide-react";
// import { myPools } from "@/constants";
import { TradingPair } from "@/types";
import { Input } from "../ui/input";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getAllpools } from "@/anchor/utils";
import toast from "react-hot-toast";
// import { myPools } from "@/lib/mock-data"
// import type { TradingPair } from "@/lib/types"
// import TradingPairItem from "./trading-pair-item"

interface MyPoolsProps {
  tokens: {
    mint: string;
    amount: number;
    decimals: number;
    name: string;
    picture: string;
    symbol: string;
  }[];
}

const ITEMS_PER_PAGE = 5;

const tokenSymbol: { [key: string]: string } = {
  "So11111111111111111111111111111111111111112": "SOL",
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN": "JUP",
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "USDC",
};



const MyPool: FC<MyPoolProps> = ({ tokens }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [myPools, setMyPools] = useState<{ poolAddress: string; owner: PublicKey, tokenA: { address: any, symbol: any }, tokenB: { address: any, symbol: any }, reserveA: any, reserveB: any, totalLiquidity: any }[]>([]);
    const { publicKey } = useWallet();

  const filteredPairs = myPools.filter((pair) => {
    const searchTerm = searchQuery.toLowerCase();
    const pairName = `${pair.tokenA.symbol}/${pair.tokenB.symbol}`.toLowerCase();
    return pairName.includes(searchTerm);
  });

  const totalPages = Math.ceil(filteredPairs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pairsToShow = filteredPairs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleClaim = (pair: TradingPair) => {
    console.log("Claiming pair:", pair);
  };

  const handleAdd = (pair: TradingPair) => {
    console.log("Adding pair:", pair);
  };

  const handleClose = (pair: TradingPair) => {
    console.log("Closing pair:", pair);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

    useEffect(() => {
        if (!publicKey) return;
    
        const fetchPools = async () => {
          try {
            const response = await getAllpools(publicKey);
    
            const formattedPools = response.slice(0, 10).map((pool) => {
              const mintA = pool.account.mintA.toBase58();
              const mintB = pool.account.mintB.toBase58();
    
              const tokenASymbol = tokenSymbol[mintA] || mintA.slice(0, 3);
              const tokenBSymbol = tokenSymbol[mintB] || mintB.slice(0, 3);
    
              return {
                poolAddress: pool.publicKey.toBase58(),
                tokenA: { address: mintA, symbol: tokenASymbol },
                tokenB: { address: mintB, symbol: tokenBSymbol },
                owner: pool.account.owner.toBase58(),
                reserveA: pool.account.reserveA.toString(),
                reserveB: pool.account.reserveB.toString(),
                totalLiquidity: pool.account.totalLiquidity.toString(),
              };
            });
            setMyPools(formattedPools);
          } catch {
            toast.error("Pool was not fetched");
          }
        }
    
        fetchPools();
      }, [publicKey]);

  return (
    <div className="w-full max-w-md mx-auto bg-[#0A0B1E] rounded-xl p-4 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Paste contract address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-[#141529] border-0 text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500"
        />
      </div>

      {/* Trading Pairs List */}
      <div className="space-y-1">
        {pairsToShow.map((pair) => (
          //   <TradingPairItem key={pair.id} pair={pair} onClaim={handleClaim} onAdd={handleAdd} onClose={handleClose} />

          <div key={""} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors">
            <div className="flex items-center space-x-4">
              <span className="text-white font-medium">
                {pair.tokenA.symbol}/{pair.tokenB.symbol}
              </span>
              <span className="text-gray-400">{pair.totalLiquidity}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                className="bg-[#001AEF] hover:bg-blue-700 text-white text-sm h-8 px-4"
                // onClick={() => onClaim(pair)}
              >
                claim
              </Button>
              <Button
                variant="secondary"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-8 px-4"
                onClick={() => onAdd(pair)}
              >
                add
              </Button>
              {pair.isLocked ? (
                <Button variant="secondary" className="bg-[#1A1B30] text-gray-400 text-sm h-8 w-8 p-0" disabled>
                  <Lock className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-8 px-4"
                  //   onClick={() => onClose(pair)}
                >
                  close
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-4 mt-4">
        <Button
          variant="secondary"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="bg-[#1A1B30] hover:bg-[#252642] text-white"
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="bg-[#1A1B30] hover:bg-[#252642] text-white"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default MyPool;
