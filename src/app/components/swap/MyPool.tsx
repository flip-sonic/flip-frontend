"use client";

import { FC, useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock, Search } from "lucide-react";
// import { myPools } from "@/constants";
import { TradingPair } from "@/types";
import { Input } from "../ui/input";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getAllpools } from "@/anchor/utils";
import toast from "react-hot-toast";
import { formatVolume } from "@/lib/utils";
import AddLiquidityPool from "./AddLiquidity";
import WithdrawLiquidityPool from "./WithdrawLiquidity";

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

interface ChildPool {
  poolAddress: string;
  owner: string;
  tokenA: { address: string; symbol: string };
  tokenB: { address: string; symbol: string };
  reserveA: number;
  reserveB: number;
  totalLiquidity: number;
  liquidityTokenMint: string,
  fee: number,
}

const ITEMS_PER_PAGE = 5;

const tokenSymbol: { [key: string]: string } = {
  "So11111111111111111111111111111111111111112": "SOL",
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN": "JUP",
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "USDC",
};



const MyPool: FC<MyPoolsProps> = ({ tokens }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [myPools, setMyPools] = useState<{ poolAddress: string; owner: string, tokenA: { address: any, symbol: any }, tokenB: { address: any, symbol: any }, reserveA: any, reserveB: any, totalLiquidity: any, liquidityTokenMint: any, fee: any }[]>([]);
  const { publicKey } = useWallet();
  const [showDepositPool, setShowDepositPool] = useState(false);
  const [showWithdrawPool, setShowWithrawPool] = useState(false);
  const [selectedPair, setSelectedPair] = useState<{ poolAddress: string; owner: string, tokenA: { address: any, symbol: any }, tokenB: { address: any, symbol: any }, reserveA: any, reserveB: any, totalLiquidity: any, liquidityTokenMint: any, fee: any }[]>([]);


  const filteredPairs = myPools.filter((pair) => {
    const searchTerm = searchQuery.toLowerCase();
    const pairName = `${pair.tokenA.symbol}/${pair.tokenB.symbol}`.toLowerCase();
    return pairName.includes(searchTerm);
  });

  const totalPages = Math.ceil(filteredPairs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pairsToShow = filteredPairs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleClaim = (pair: ChildPool) => {
    setSelectedPair(prevSelectedPair => [...prevSelectedPair, pair]);
    setShowWithrawPool(true);
  };

  const handleAdd = (pair: ChildPool) => {
    setSelectedPair(prevSelectedPair => [...prevSelectedPair, pair]);
    setShowDepositPool(true);
  };

  // const handleClose = (pair: TradingPair) => {
  //   console.log("Closing pair:", pair);
  // };

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
                fee: pool.account.fee.toString(),
                liquidityTokenMint: pool.account.liquidityTokenMint.toBase58(),
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
    <div className="w-full rounded-[10px] bg-black/90 p-4 space-y-4">
      {showDepositPool ? <AddLiquidityPool pools={selectedPair} tokens={tokens} /> : showWithdrawPool ? <WithdrawLiquidityPool pools={selectedPair} tokens={tokens} /> : <>
      {/* Search Bar */}
      <div className="relative h-[30px] bg-dark-blue rounded-[10px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary w-4 h-4" />
        <Input
          type="text"
          placeholder="Paste contract address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-none border-0 text-white placeholder:text-tertiary focus-visible:ring-1 focus-visible:ring-blue-500"
        />
      </div>

      {/* Trading Pairs List */}
      <div className="space-y-1">
        {pairsToShow.map((pair) => (
          <div key={pair.owner} className="grid grid-cols-12 gap-4 p-3 bg-dark-blue rounded-lg transition-colors">
            <div className="col-span-3">
              <span className="text-[15px] leading-[100%] tracking-[0%] font-semibold">
                {pair.tokenA.symbol}/{pair.tokenB.symbol}
              </span>
            </div>
            <div className="flex items-center gap-1 col-span-4">
              <span className="text-[10px] leading-[100%] tracking-[0%] font-semibold text-tertiary">V:</span>
              <span className="text-[13px] leading-[100%] tracking-[0%] font-semibold text-white">
                {formatVolume(pair.totalLiquidity)}
              </span>
            </div>
            <div className="col-span-5 w-full">
              <div className="grid grid-cols-3 gap-1">
                <Button className="bg-primary cursor-pointer h-[26px] w-full rounded-[10px]" onClick={() => handleClaim(pair)} >claim</Button>
                <Button className="bg-primary h-[26px] cursor-pointer w-full rounded-[10px]" onClick={() => handleAdd(pair)}>add</Button>
                <Button disabled className="bg-primary h-[26px] w-full rounded-[10px]">close</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-4 mt-4">
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`rounded-[10px] w-[80px] h-6 ${currentPage === 1 ? "bg-dark-blue" : "bg-secondary"}`}
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`rounded-[10px] w-[80px] h-6 ${currentPage === totalPages ? "bg-dark-blue" : "bg-secondary"}`}
        >
          Next
        </Button>
      </div>
      </>}
    </div>
  );
};

export default MyPool;
