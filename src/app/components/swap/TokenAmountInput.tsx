"use client";

import { FC } from "react";
import { Wallet } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Token } from "@/types";
import { LoseIcon } from "@/assets";
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
    <div className="flex items-center justify-between w-full p-5 rounded-[10px] bg-slate-500">
      <Select value={selectedToken} onValueChange={onTokenChange}>
        <SelectTrigger className="inactive-nav-bg p-[10px] w-fit border-0 focus-visible:ring-0 relative">
          <SelectValue>
            {token && (
              <div className="flex items-center gap-2">
                <Image src={token.icon} width={22} height={22} alt={`${token.name} icon`} />
                <span className="text-[10px] leading-[100%] tracking-[0%]">{token.symbol}</span>
                <div
                  className={`flex items-center justify-center gap-1 w-[62px] h-[20px] rounded-[5px] ${
                    token.priceChange > 0 ? "bg-green-200" : "bg-blue-900"
                  }`}
                >
                  <Image src={LoseIcon} alt="" />
                  <span className="text-[10px] leading-[100%] tracking-[0%]">{`${token.currentPrice} ${
                    token.currentPrice > 0 ? "+" : ""
                  }`}</span>
                </div>
              </div>
            )}
          </SelectValue>
          <span className="absolute -bottom-6 -left-1 text-[10px] leading-[100%] tracking-[0%]">
            Token Supply: <span>{formatNum(token!.totalSupply)}</span> Holders: <span>{formatNum(token!.holders)}</span>
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
          <Wallet size={14} className="text-[#A0A0FF]" />
          <span className="text-[10px] leading-[100%] tracking-[0%]">{`${token?.userBalance} ${token?.symbol}`}</span>
        </div>
        <Input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
          className="text-[20px] font-bold leading-[100%] tracking-[0%] text-right border-0 focus-visible:ring-0"
        />
        <span className="text-[10px] leading-[100%] tracking-[0%]">{token!.currentPrice * amount}</span>
      </div>
    </div>
  );
};

export default TokenAmountInput;
