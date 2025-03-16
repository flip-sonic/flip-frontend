"use client";

import { FC, useEffect, useState } from "react";
import SwapInterface from "./SwapInterface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Image from "next/image";
import { FlipIcon, SonicIcon } from "@/assets";
import LiquidityInterface from "./LiquidityInterface";
import { Button } from "@/components/ui/button";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { BsFillLightningFill } from "react-icons/bs";

const connection = new Connection('https://api.testnet.sonic.game', 'confirmed');

const tokenIcons: { [key: string]: string } = {
  "So11111111111111111111111111111111111111112": "/sol.svg",
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN": "/jup.svg",
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "/usdc.svg",
};

const defaultIcon = "/sonic.svg";

const Hero: FC = ({}) => {
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<{ mint: string; amount: number; decimals: number; name: string, picture: string, symbol: string }[]>([]);
  const { publicKey } = useWallet();

  useEffect(() => {
      if (!publicKey) return;
  
      setLoading(true);
  
      const fetchBalances = async () => {
        try {
          // Fetch SOL balance
          const solBalance = await connection.getBalance(publicKey);
  
          // Fetch token balances
          const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID });
  
          // Map fetched tokens & add name and logo
          const tokenList = tokenAccounts.value.map((account) => {
            const info = account.account.data.parsed.info;
            const mintAddress = info.mint;
  
            // Determine the token name
            const tokenSymbol = info.tokenSymbol || mintAddress.slice(0, 3);
  
            return {
              mint: mintAddress,
              name: info.tokenName || "unknown Token",
              amount: info.tokenAmount.uiAmount,
              decimals: info.tokenAmount.decimals,
              symbol: tokenSymbol, // Add symbol if available
              picture: tokenIcons[mintAddress] || defaultIcon,
            };
          });
  
          // Include SOL balance as a token (use SOL name & icon)
          tokenList.unshift({
            mint: "So11111111111111111111111111111111111111112",
            name: "SOL",
            symbol: "SOL",
            amount: solBalance / LAMPORTS_PER_SOL,
            decimals: 9,
            picture: "/sol.svg",
          });
  
          setTokens(tokenList);
        } catch (error) {
          console.error("Error fetching balances:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchBalances();
  
      const interval = setInterval(fetchBalances, 10000);
      return () => clearInterval(interval);
    }, [publicKey]);
  

  return (
    <section className="pt-[50px]">
      <div className="container max-w-[441px] mx-auto w-full">
        <div className="flex flex-col gap-6">
          <Tabs defaultValue="swap" className="">
            <TabsList className="flex items-center justify-betweenflex justify-between items-center">
              <div className="flex items-center gap-3 mr-auto">
                <TabsTrigger value="swap" className="h-[42px] px-[14px]">
                  <span className="text-[18px] px-4 flex py-3 leading-[100%] tracking-[0%] font-bold" ><BsFillLightningFill className="text-xl" /> Swap</span>
                  {/* className="px-4 py-2 data-[state=active]:bg-[#001AEF] data-[state=active]:text-white bg-[#040C6E] text-[#A0A0FF]" */}
                </TabsTrigger>
                <TabsTrigger value="liquidity" className="h-[42px] px-[14px]">
                  <span className="text-[18px] px-4 py-3 leading-[100%] tracking-[0%] font-bold" >Liquidity</span>
                </TabsTrigger>
              </div>
              <Button className="w-[90px] h-[42px] rouned-[10px] bg-secondary cursor-auto">
                <div className="flex text-white bg-[#34359C] items-center gap-1 ml-auto px-4 py-2 rounded-[10px] text-sm font-medium">
                  <Image src={FlipIcon} alt="" />
                  <span className="text-[18px] leading-[100%] tracking-[0%] font-bold">Flip</span>
                </div>
              </Button>
            </TabsList>
            <TabsContent value="swap">
              <SwapInterface tokens={tokens} />
            </TabsContent>
            <TabsContent value="liquidity">
              <LiquidityInterface tokens={tokens} />
            </TabsContent>
          </Tabs>
          <div className="flex items-center justify-center gap-1">
            <span className="text-[15px] leading-[100%] tracking-[0%] font-bold">Powered by SonicSVM</span>
            <Image src={SonicIcon} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
