import { Token } from "@/types";
import Image from "next/image";
import { FC } from "react";
import { Input } from "../ui/input";

interface TokenSwapFieldProps {
  token: Token;
  amount: string;
  setAmount: (value: string) => void;
  onClick: () => void;
}

const TokenSwapField: FC<TokenSwapFieldProps> = ({ token, amount, setAmount, onClick }) => {
  return (
    <div className="space-y-1">
      <div className="bg-[#0A0B1E] rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <button onClick={onClick} className="flex items-center space-x-2 bg-[#1A1B30] rounded-lg px-3 py-2">
            <Image src={token.icon || "/placeholder.svg"} alt={token.symbol} className="w-6 h-6 rounded-full" />
            <span className="text-white font-semibold">{token.symbol}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${token.priceChange > 0 ? "text-green-400" : "text-red-400"}`}>
              {token.priceChange > 0 ? "+" : ""}
              {token.priceChange}%
            </span>
          </button>
          <div className="text-right flex flex-col items-end">
            <Input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-2xl font-bold text-white text-right bg-transparent border-0 p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 w-[140px]"
              placeholder=""
            />
            <div className="text-gray-400">${0}</div>
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>Total Supply: {token.totalSupply}</span>
          <span>Holders: {token.holders}</span>
        </div>
      </div>

      {/* Token Balance */}
      <div className="flex justify-end text-sm text-gray-400 mr-2">
        <span>{token.userBalance}</span>
      </div>
    </div>
  );
};

export default TokenSwapField;
