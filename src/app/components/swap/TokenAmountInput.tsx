"use client";

import { FC } from "react";
import { Wallet } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Token } from "@/types";
import { formatNum } from "@/lib/utils";

interface TokenAmountInputProps {
  tokens: Token[];
  selectedToken: string;
  amount: number;
  onTokenChange: (tokenName: string) => void;
  onAmountChange: (amount: number) => void;
}

const TokenAmountInput: FC<TokenAmountInputProps> = ({ tokens, selectedToken, amount, onTokenChange, onAmountChange }) => {
  const token = tokens.find((token) => token.name === selectedToken);

  return (
    <div className="flex items-center justify-between w-full p-5 rounded-[10px] bg-black">
      <Select value={selectedToken} onValueChange={onTokenChange}>
        <SelectTrigger className="inactive-nav-bg p-[10px] w-fit border-0 focus-visible:ring-0 relative bg-primary/50">
          <SelectValue>
            {token && (
              <div className="flex items-center gap-2">
                <Image src={token.icon} width={22} height={22} alt={`${token.name} icon`} />
                <span className="text-[13px] font-bold leading-[100%] tracking-[0%] text-white">{token.symbol}</span>
                <div
                  className={`flex items-center justify-center gap-[2px] w-[62px] h-[20px] rounded-[5px] ${
                    token.priceChange > 0 ? "bg-green-500/40" : "bg-black/40"
                  }`}
                >
                  {token.priceChange > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`text-[10px] leading-[100%] tracking-[0%] ${
                      token.priceChange > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >{`${token.priceChange > 0 ? "+" : ""}${formatNum(token.priceChange)}%`}</span>
                </div>
              </div>
            )}
          </SelectValue>
          <span className="absolute -bottom-6 -left-1 text-[10px] leading-[100%] tracking-[0%] text-blue-500">
            Token Supply: <span className="text-tertiary">{formatNum(token!.totalSupply)}</span>  Holders: <span className="text-tertiary">{formatNum(token!.holders)}</span>
          </span>
        </SelectTrigger>
        <SelectContent>
          {tokens.map((token) => (
            <SelectItem key={token.name} value={token.name} className="cursor-pointer">
              <div className="flex items-center gap-2">
                <Image src={token.icon} width={22} height={22} alt={`${token.name} icon`} />
                <span>{token.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex flex-col items-end gap-3">
        <div className="flex items-center gap-1">
          <Wallet size={14} className="text-tertiary" />
          <span className="text-[10px] leading-[100%] tracking-[0%] text-tertiary">{`${token?.userBalance} ${token?.symbol}`}</span>
        </div>
        <Input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
          className="text-[20px] font-bold leading-[100%] tracking-[0%] text-right border-0 focus-visible:ring-0 text-tertiary"
        />
        <span className="text-[10px] leading-[100%] tracking-[0%] text-tertiary">{token!.currentPrice * amount}</span>
      </div>
    </div>
  );
};

export default TokenAmountInput;
