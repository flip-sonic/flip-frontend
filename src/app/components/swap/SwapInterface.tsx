"use client";

import { FC, useRef } from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TokenAmountInput from "./TokenAmountInput";
import Image from "next/image";
import { SettingsIcon, SwapIcon } from "@/assets";
import { Input } from "../ui/input";
import { useWallet } from "@solana/wallet-adapter-react";
import { getAllUsersPools } from "@/anchor/utils";
import toast from "react-hot-toast";
import { quoteSwap, SwapOnPool } from "@/anchor/swap";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";

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
  reserve: string;
};

const tokenSymbol: { [key: string]: string } = {
  "So11111111111111111111111111111111111111112": "SOL",
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN": "JUP",
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "USDC",
};

const connection = new Connection('https://api.testnet.sonic.game', 'confirmed');


const SwapInterface: FC<SwapInterfaceProps> = ({ tokens }) => {
  const [sellToken, setSellToken] = useState("");
  const [buyToken, setBuyToken] = useState("");
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
      setLoading(true);
      try {
        const response = await getAllUsersPools(publicKey);
        const poolTokens: Token[] = [];

        const uniqueTokens = new Set();
        if (!response) {
          toast.error("Response was not Fetched");
          return;
        }
        response.slice(0, 10).forEach((pool) => {
          const mintA = pool.account.mintA.toBase58();
          const mintB = pool.account.mintB.toBase58();
          const reserveA = pool.account.reserveA.toString();
          const reserveB = pool.account.reserveB.toString();

          if (!uniqueTokens.has(mintA)) {
            uniqueTokens.add(mintA);
            poolTokens.push({ address: mintA, symbol: tokenSymbol[mintA] || mintA.slice(0, 3), reserve: reserveA });
          }

          if (!uniqueTokens.has(mintB)) {
            uniqueTokens.add(mintB);
            poolTokens.push({ address: mintB, symbol: tokenSymbol[mintB] || mintB.slice(0, 3), reserve: reserveB });
          }
        });

        setTokensInPool(poolTokens);


      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }
    }
    fetchData();
  }, [publicKey]);

  const filteredToken = tokens
    .filter(token => tokensInPool.some(pool => pool.address === token.mint))
    .map(token => {
      const poolMatch = tokensInPool.find(pool => pool.address === token.mint);
      return {
        ...token,
        reserve: poolMatch ? poolMatch.reserve : "0"
      };
    });

  useEffect(() => {
    // default buy and sell token
    if (filteredToken.length > 0 && !sellToken) {
      setSellToken(filteredToken[0]?.mint || "");
    }
    if (filteredToken.length > 1 && !buyToken) {
      setBuyToken(filteredToken[1]?.mint || "");
    }
  }, [filteredToken, sellToken, buyToken]);

  // Calculate equivalent amount when sell amount changes
  useEffect(() => {
    if (!publicKey) return;
    const fetchData = async () => {
    if (sellAmount && sellToken && buyToken) {

      const QouteTx = await quoteSwap(new PublicKey(sellToken), new PublicKey(buyToken), Number(sellAmount), parseFloat(slippage));

      setBuyAmount(parseFloat(QouteTx?.minAmountOut.toString()));
    } else {
      setBuyAmount(0);
    }
  }
  fetchData();
  }, [sellAmount, sellToken, buyToken, slippage, publicKey]);

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
    const token = tokens.find((t) => t.amount === parseFloat(sellToken));
    if (!token || !sellAmount) return true;
    return Number(sellAmount) <= Number(token.amount);
  };
  
  const handleSwapOnPools = async () => {
    if (!publicKey) return;
    const sellTokenAmount = tokens.find(token => token.mint === sellToken)?.amount || 0;
    const isSellAmountValid = Number(sellAmount) <= sellTokenAmount;

    if (!isSellAmountValid) {
      toast.error("Insufficient Token");
      return;
    }
    
    const AmountInNum = sellAmount.toString();
    const sellTokenKey = new PublicKey(sellToken);
    const buyTokenKey = new PublicKey(buyToken);

    if (sellTokenKey === buyTokenKey) {
      toast.error("You can't select same token!")
      return;
    }
    try {
      setLoading(true);
      const Swap = await SwapOnPool(publicKey, sellTokenKey, buyTokenKey, parseFloat(AmountInNum), parseFloat(slippage) );

      const SwapTx = new Transaction().add(...Swap);
      
      const SPtx = await sendTransaction(SwapTx, connection);
      const confirmation = await connection.confirmTransaction(SPtx, 'confirmed');
      
      if (!confirmation.value.err) {
        toast.success(`You have swapped ${buyToken}`);
        setBuyAmount(0);
        setSellAmount(0);
        setBuyToken('');
        setSellToken('');
        setSlippage("0.5");
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full rounded-[10px] pt-[56px] bg-primary/10">
      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-1 w-full relative">
          <TokenAmountInput
            tokens={filteredToken}
            selectedToken={sellToken}
            amount={sellAmount}
            onTokenChange={setSellToken}
            onAmountChange={setSellAmount}
          />

          <Button className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" onClick={handleSwapTokens}>
            <Image src={SwapIcon} alt="" />
          </Button>

          <TokenAmountInput
            tokens={filteredToken}
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

        <Button type="submit" className="bg-secondary text-white py-4 rounded-[10px]" onClick={() => handleSwapOnPools()}>
          {publicKey ? loading ? 'loading...' : "Swap" :'Connect'}
        </Button>
      </div>
    </div>
  );
};

export default SwapInterface;
