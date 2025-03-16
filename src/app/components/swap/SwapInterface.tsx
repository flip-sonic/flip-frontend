"use client";

import { FC, useRef } from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TokenAmountInput from "./TokenAmountInput";
// import { tokens } from "@/constants";
import Image from "next/image";
import { SettingsIcon, SwapIcon } from "@/assets";
import { Input } from "../ui/input";
import { useWallet } from "@solana/wallet-adapter-react";
import { getAllpools } from "@/anchor/utils";
import toast from "react-hot-toast";

interface SwapInterfaceProps {
  tokens: {
    mint: string;
    amount: number;
    decimals: number;
    name: string;
    picture: string;
    symbol: string;
  }[];
}

type Token = {
  address: string;
  symbol: string;
};

const tokenSymbol: { [key: string]: string } = {
  "So11111111111111111111111111111111111111112": "SOL",
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN": "JUP",
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "USDC",
};


const SwapInterface: FC<SwapInterfaceProps> = ({ tokens }) => {
  const [sellToken, setSellToken] = useState(tokens[0].name);
  const [buyToken, setBuyToken] = useState(tokens[1].name);
  const [sellAmount, setSellAmount] = useState(0);
  const [buyAmount, setBuyAmount] = useState(0);
  const [slippage, setSlippage] = useState<string>("0.5");
  const [editingSlippage, setEditingSlippage] = useState<boolean>(false);
  const slippageInputRef = useRef<HTMLInputElement>(null);
  const [tokensInPool, setTokensInPool] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);
  const { publicKey, sendTransaction } = useWallet();

  // get tokens from liquidity pools
  useEffect(() => {
    if (!publicKey) return;
    const fetchData = async () => {
      try {
        const response = await getAllpools(publicKey);
        const poolTokens: Token[] = [];

        const uniqueTokens = new Set();
        if (!response) {
          toast.error("Response was not Fetched");
          return;
        }
        response.slice(0, 10).forEach((pool) => {
          const mintA = pool.account.mintA.toBase58();
          const mintB = pool.account.mintB.toBase58();

          if (!uniqueTokens.has(mintA)) {
            uniqueTokens.add(mintA);
            poolTokens.push({ address: mintA, symbol: tokenSymbol[mintA] || mintA.slice(0, 3) });
          }

          if (!uniqueTokens.has(mintB)) {
            uniqueTokens.add(mintB);
            poolTokens.push({ address: mintB, symbol: tokenSymbol[mintB] || mintB.slice(0, 3) });
          }
        });
        console.log(poolTokens);

        setTokensInPool(poolTokens);


      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }
    }
    fetchData();
  }, [publicKey]);

  // filter tokens from result
  const filteredToken = tokens.filter(token =>
    tokensInPool.some(pool => pool.address === token.mint)
  );

  // Calculate equivalent amount when sell amount changes
  useEffect(() => {
    if (sellAmount && sellToken && buyToken) {
      const calculated = (Number(sellAmount) * 0.7).toFixed(6);
      setBuyAmount(parseFloat(calculated));
    } else {
      setBuyAmount(0);
    }
  }, [sellAmount, sellToken, buyToken]);

  const handleSlippageChange = (value: string) => {
    // Only allow numbers and decimal points
    const filtered = value.replace(/[^0-9.]/g, "");
    setSlippage(filtered);
  };

  const startEditingSlippage = () => {
    setEditingSlippage(true);
  };

  const stopEditingSlippage = () => {
    setEditingSlippage(false);
    // Ensure slippage is a valid number
    if (slippage === "" || isNaN(Number.parseFloat(slippage))) {
      setSlippage("0.5");
    }
  };

  // Focus the slippage input when editing starts
  useEffect(() => {
    if (editingSlippage && slippageInputRef.current) {
      slippageInputRef.current.focus();
    }
  }, [editingSlippage]);

  // Handle token swap positions
  const handleSwapTokens = () => {
    const tempToken = sellToken;
    const tempAmount = sellAmount;
    setSellToken(buyToken);
    setBuyToken(tempToken);
    setSellAmount(buyAmount);
    setBuyAmount(tempAmount);
  };

  // Validate if amount exceeds balance
  const isAmountValid = () => {
    const token = tokens.find((t) => t.name === sellToken);
    if (!token || !sellAmount) return true;
    return Number(sellAmount) <= Number(token.userBalance);
  };

  return (
    <div className="w-full rounded-[10px] pt-[56px] bg-primary/10">
      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-1 w-full relative">
          <TokenAmountInput
            tokens={tokens}
            selectedToken={sellToken}
            amount={sellAmount}
            onTokenChange={setSellToken}
            onAmountChange={setSellAmount}
          />

          <Button className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" onClick={handleSwapTokens}>
            <Image src={SwapIcon} alt="" />
          </Button>

          <TokenAmountInput
            tokens={tokens}
            selectedToken={buyToken}
            amount={buyAmount}
            onTokenChange={setBuyToken}
            onAmountChange={setBuyAmount}
          />
        </div>

        <div className="flex items-center space-x-2 pl-6">
          {editingSlippage ? (
            <div className="bg-primary/80 rounded-[5px] px-2 py-[6px] flex items-center gap-1">
              <span className="text-[13px] leading-[100%] tracking-[0%] text-white font-medium">Spillage:</span>
              <Input
                ref={slippageInputRef}
                type="text"
                value={slippage}
                onChange={(e) => handleSlippageChange(e.target.value)}
                onBlur={stopEditingSlippage}
                onKeyDown={(e) => e.key === "Enter" && stopEditingSlippage()}
                className="w-10 h-5 p-0 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white"
              />
              <span className="text-white">%</span>
            </div>
          ) : (
            <div className="bg-primary/80 rounded-[5px] px-2 py-[6px] cursor-pointer flex" onClick={startEditingSlippage}>
              <span className="text-[10px] leading-[100%] tracking-[0%] text-white font-medium">Spillage: {slippage}%</span>
            </div>
          )}
          <Button>
            <Image src={SettingsIcon} alt="" />
          </Button>
        </div>

        <Button type="submit" className="bg-secondary text-white py-4 rounded-[10px]">
          {/* {!isAmountValid() ? "Insufficient Balance" : "Swap"} */}
          Connect
        </Button>
      </div>
    </div>
  );
};

export default SwapInterface;
