"use client";

import { FC } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, TrendingDown, TrendingUp } from "lucide-react";
import { tradingPairs } from "@/constants";
import { TradingPair } from "@/types";
import { Input } from "../ui/input";
// import { tradingPairs } from "@/lib/mock-data";
// import type { TradingPair } from "@/lib/types";
// import TradingPairItem from "./trading-pair-item";

const ITEMS_PER_PAGE = 5;

interface PoolsProps {}

const Pools: FC<PoolsProps> = ({}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPairs = tradingPairs.filter((pair) => {
    const searchTerm = searchQuery.toLowerCase();
    const pairName = `${pair.baseToken}/${pair.quoteToken}`.toLowerCase();
    return pairName.includes(searchTerm);
  });

  //   const formattedVolume = new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 0,
  //   }).format(pair.volume)

  const totalPages = Math.ceil(filteredPairs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pairsToShow = filteredPairs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleAdd = (pair: TradingPair) => {
    console.log("Adding pair:", pair);
    // Implement add functionality here
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

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
      <div className="space-y-2">
        {pairsToShow.map((pair) => (
          //   <TradingPairItem key={pair.id} pair={pair} onAdd={handleAdd} />

          <div key={""} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors">
            <div className="flex items-center space-x-4 flex-1">
              <span className="text-white font-medium">
                {pair.baseToken}/{pair.quoteToken}
              </span>
              <span className="text-gray-400 text-sm">Volume</span>
              {pair.priceChange > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
            </div>
            <Button
              variant="secondary"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4"
              //   onClick={() => onAdd(pair)}
            >
              add
            </Button>
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

export default Pools;
