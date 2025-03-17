"use client";

import { FC, useEffect } from "react";
import { Wallet } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { TrendingDown, TrendingUp } from "lucide-react";
import { formatNum } from "@/lib/utils";

interface TokenAmountInputProps {
  tokens: {
    mint: string;
    amount: number;
    decimals: number;
    name: string;
    picture: string;
    symbol: string;
    reserve: string;
  }[];
  selectedToken: string;
  amount: number;
  onTokenChange: (tokenName: string) => void;
  onAmountChange: (amount: number) => void;
}

const TokenAmountInput: FC<TokenAmountInputProps> = ({ tokens, selectedToken, amount, onTokenChange, onAmountChange }) => {
  const token = tokens.find((token) => token.mint === selectedToken);

  return (
    <div className="flex items-center justify-between w-full p-5 rounded-[10px] bg-black">
      <Select value={selectedToken} onValueChange={onTokenChange}>
        <SelectTrigger className="inactive-nav-bg p-[10px] w-fit border-0 focus-visible:ring-0 relative bg-primary/50">
          <SelectValue>
            {token && (
              <div className="flex items-center gap-2">
                <Image src={token.picture} width={22} height={22} alt={`${token.symbol} icon`} priority />
                <span className="text-[13px] font-bold leading-[100%] tracking-[0%] text-white">{token.symbol}</span>
                <div
                  className={`flex items-center justify-center gap-[2px] w-[62px] h-[20px] rounded-[5px] ${
                    parseFloat(token.reserve) > 0 ? "bg-green-500/40" : "bg-black/40"
                  }`}
                >
                  {parseFloat(token.reserve) > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`text-[10px] leading-[100%] tracking-[0%] ${
                      parseFloat(token.reserve) > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >{`${parseFloat(token.reserve) > 0 ? "+" : ""}${formatNum(parseFloat(token.reserve))}%`}</span>
                </div>
              </div>
            )}
          </SelectValue>
          <span className="absolute -bottom-6 -left-1 text-[10px] leading-[100%] tracking-[0%] text-blue-500">
            Token Supply: <span className="text-tertiary">{formatNum(parseFloat(token?.reserve || "0"))}</span>  Holders: <span className="text-tertiary">{formatNum(100)}K</span>
          </span>
        </SelectTrigger>
        <SelectContent className="bg-black">
          {tokens.map((token) => (
            <SelectItem key={token.mint} value={token.mint} className="cursor-pointer bg-black hover:bg-gray-800">
              <div className="flex items-center gap-2">
                <Image src={token.picture} width={22} height={22} alt={`${token.symbol} icon`} />
                <span>{token.symbol}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex flex-col items-end gap-3">
        <div className="flex items-center gap-1">
          <Wallet size={14} className="text-tertiary" />
          <span className="text-[10px] leading-[100%] tracking-[0%] text-tertiary">{`${token?.amount} ${token?.symbol}`}</span>
        </div>
        <Input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0.00)}
          className="text-[20px] font-bold leading-[100%] tracking-[0%] text-right border-0 focus-visible:ring-0 text-tertiary no-spinner required"
        />
        <span className="text-[10px] leading-[100%] tracking-[0%] text-tertiary">{0.1 * amount}</span>
      </div>
    </div>
  );
};

export default TokenAmountInput;