"use client";

import { FC } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { tradingPairs } from "@/constants";
import { TradingPair } from "@/types";
import { Input } from "../ui/input";
import { formatVolume } from "@/lib/utils";

const ITEMS_PER_PAGE = 5;

const Pools: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPairs = tradingPairs.filter((pair) => {
    const searchTerm = searchQuery.toLowerCase();
    const pairName = `${pair.baseToken}/${pair.quoteToken}`.toLowerCase();
    return pairName.includes(searchTerm);
  });

  const totalPages = Math.ceil(filteredPairs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pairsToShow = filteredPairs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleAdd = (pair: TradingPair) => {
    console.log("Adding pair:", pair);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="w-full rounded-[10px] bg-black/90 p-4 space-y-4">
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
      <div className="space-y-2 w-full">
        {pairsToShow.map((pair) => (
          <div key={pair.id} className="grid grid-cols-10 gap-4 p-3 bg-dark-blue rounded-lg transition-colors">
            <div className="col-span-3">
              <span className="text-[15px] leading-[100%] tracking-[0%] font-semibold">
                {pair.baseToken}/{pair.quoteToken}
              </span>
            </div>
            <div className="flex items-center gap-[6px] col-span-5">
              <span className="text-[10px] leading-[100%] tracking-[0%] font-semibold text-tertiary">Volume</span>
              <span className="text-[13px] leading-[100%] tracking-[0%] font-semibold text-white">{formatVolume(pair.volume)}</span>
            </div>
            <div className="col-span-2">
              <Button
                variant="secondary"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4"
                //   onClick={() => onAdd(pair)}
              >
                add
              </Button>
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
    </div>
  );
};

export default Pools;
