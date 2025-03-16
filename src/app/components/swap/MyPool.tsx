"use client";

import { FC } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock, Search } from "lucide-react";
import { myPools } from "@/constants";
import { TradingPair } from "@/types";
import { Input } from "../ui/input";
import { formatVolume } from "@/lib/utils";

const ITEMS_PER_PAGE = 5;

interface MyPoolProps {}

const MyPool: FC<MyPoolProps> = ({}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPairs = myPools.filter((pair) => {
    const searchTerm = searchQuery.toLowerCase();
    const pairName = `${pair.baseToken}/${pair.quoteToken}`.toLowerCase();
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

  return (
    <div className="w-full rounded-[10px] bg-black/90 p-4 space-y-4">
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
          <div key={pair.id} className="grid grid-cols-12 gap-4 p-3 bg-dark-blue rounded-lg transition-colors">
            <div className="col-span-3">
              <span className="text-[15px] leading-[100%] tracking-[0%] font-semibold">
                {pair.baseToken}/{pair.quoteToken}
              </span>
            </div>
            <div className="flex items-center gap-1 col-span-4">
              <span className="text-[10px] leading-[100%] tracking-[0%] font-semibold text-tertiary">V:</span>
              <span className="text-[13px] leading-[100%] tracking-[0%] font-semibold text-white">
                {formatVolume(pair.volume)}
              </span>
            </div>
            <div className="col-span-5 w-full">
              <div className="grid grid-cols-3 gap-1">
                <Button className="bg-primary h-[26px] w-full rounded-[10px]">claim</Button>
                <Button className="bg-primary h-[26px] w-full rounded-[10px]">add</Button>
                <Button className="bg-primary h-[26px] w-full rounded-[10px]">close</Button>
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
    </div>
  );
};

export default MyPool;
