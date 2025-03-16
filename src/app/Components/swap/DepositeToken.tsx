"use client";

import { FC, useEffect } from "react";
import { useState } from "react";
import { InfoIcon as InfoCircle, Wallet } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import Image from "next/image";
import { Switch } from "../ui/switch";
import { feeTiers, poolTokens } from "@/constants";
import { Button } from "../ui/Button";
import { useWallet } from "@solana/wallet-adapter-react";
import { AddLiqudityToThePool, initializeAPool } from "@/anchor/pool";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { connection } from "@/anchor/setup";
import toast from "react-hot-toast";

type Pool = {
  poolAddress: string;
  owner: string;
  tokenA: { address: string; symbol: string };
  tokenB: { address: string; symbol: string };
  reserveA: number;
  reserveB: number;
  totalLiquidity: number;
};

type Token = {
  mint: string;
  amount: number;
  decimals: number;
  name: string;
  picture: string;
  symbol: string;
};

// Define props type
interface DepositPoolProps {
  pools: Pool[];
  tokens: Token[];
}


const DepositPool: FC<DepositPoolProps> = ({ pools, tokens }) => {

  const [baseToken, setBaseToken] = useState<string>("");
  const [quoteToken, setQuoteToken] = useState<string>("");
  const [baseAmount, setBaseAmount] = useState<string>("0.00");
  const [quoteAmount, setQuoteAmount] = useState<string>("0.00");
  const [isLocked, setIsLocked] = useState(false);
  const [appLoading, setAppLoading] = useState(false);
  const { publicKey, sendTransaction } = useWallet();

  const filteredBaseToken = tokens.filter(token =>
    pools.some(pool => pool.tokenA.address === token.mint)
  );

  const filteredQouteTokens = tokens.filter(token =>
    pools.some(pool => pool.tokenB.address === token.mint)
  );

  // useEffect(() => {
  //   if (baseAmount !== "0.00") {
  //     const calculatedPrice = parseFloat(quoteAmount) / parseFloat(baseAmount);
  //     setInitialPrice(calculatedPrice.toFixed(2));
  //   } else {
  //     setInitialPrice("0.00");
  //   }
  // }, [quoteAmount, baseAmount]);

  const handleDepositPool = async () => {
    const poolAccount = pools[0]?.poolAddress;

    if (!publicKey || !poolAccount || !baseAmount || !quoteAmount ) return;

    setAppLoading(true);

    try {
      const deposit = await AddLiqudityToThePool(publicKey, new PublicKey(poolAccount), parseFloat(baseAmount), parseFloat(quoteAmount));
      const depoTx = new Transaction().add(...deposit);

      const DPtx = await sendTransaction(depoTx, connection);
      const confirmation = await connection.confirmTransaction(DPtx, 'confirmed');
      if (!confirmation.value.err) {

        toast.success("Deposited into the pool");
        setBaseToken("");
        setQuoteToken("");
        setBaseAmount("0.00");
        setQuoteAmount("0.00");
        setIsLocked(false);
        setAppLoading(false);

        return
      }
      toast.error("Pool not Initialized");

    } catch (error) {
      console.error(error);
    } finally {
      setAppLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#0A0B1E] rounded-xl p-6 space-y-6">
      {/* Base Token */}
      <div className="space-y-2">
        <div className="flex mt-2 items-center justify-between">
          <label className="text-white mb-2 text-sm">Base Token</label>
          <div className="flex text-xs text-white gap-2"><Wallet size={15} /> {filteredBaseToken.find(token => token.mint === baseToken)?.amount || 0}</div>
        </div>
        
        <div className="flex space-x-2">
          <Select required value={baseToken} onValueChange={setBaseToken}>
            <SelectTrigger className="bg-[#141529] border-0 text-white">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent className="bg-[#141529] border-[#2A2B3F]">
              {filteredBaseToken.map((token, index) => (
                <SelectItem key={`${token.mint}-${token.symbol}-${index}`} value={token.mint} className="text-white hover:bg-white/10">
                  <div className="flex items-center space-x-2">
                    <Image src={token.picture || "/placeholder.svg"} alt={token.symbol} className="w-5 h-5 rounded-full" width={20}
                      height={20} priority />
                    <span>{token.symbol}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={baseAmount}
            onChange={(e) => setBaseAmount(e.target.value)}
            className="bg-[#141529] outline-none border-none focus:ring-0 no-spinner text-white text-right"
            placeholder="0.00" required
          />
        </div>
        {/* </div> */}

        {/* Quote Token */}
        <div className="space-y-2">
          <div className="flex mt-2 items-center justify-between">
            <div className="flex items-center space-x-2">
              <label className="text-white text-sm">Quote token</label>
              <InfoCircle className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex text-xs text-white gap-2"><Wallet size={15} /> {filteredQouteTokens.find(token => token.mint === quoteToken)?.amount || 0}</div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Select required value={quoteToken} onValueChange={setQuoteToken}>
            <SelectTrigger className="bg-[#141529] border-0 text-white">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent className="bg-[#141529] border-[#2A2B3F]">
              {filteredQouteTokens.map((token, index) => (
                <SelectItem key={`${token.mint}-${token.symbol}-${index}`} value={token.mint} className="text-white hover:bg-white/10">
                  <div className="flex items-center space-x-2">
                    <Image src={token.picture || "/placeholder.svg"} alt={token.symbol} className="w-5 h-5 rounded-full" width={20}
                      height={20} priority />
                    <span>{token.symbol}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={quoteAmount}
            onChange={(e) => setQuoteAmount(e.target.value)}
            className="bg-[#141529] outline-none border-none focus:ring-0 no-spinner text-white text-right"
            placeholder="0.00" required
          />
        </div>
      </div>

      {/* Lock Switch */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-white text-sm">Lock</span>
          <InfoCircle className="w-4 h-4 text-gray-400" />
        </div>
        <Switch checked={isLocked} onCheckedChange={setIsLocked} className="bg-gray-400 data-[state=checked]:bg-blue-600 transition-colors" />
      </div>

      {/* Create and Deposit Button */}
      <Button className="w-full bg-[#383964] hover:bg-[#434687] text-white" onClick={handleDepositPool}>
        {appLoading ? 'loading...' : 'deposit'}
      </Button>
    </div >
  );
};

export default DepositPool;