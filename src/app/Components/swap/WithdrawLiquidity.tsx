"use client";

import { FC } from "react";
import { useState } from "react";
import { InfoIcon as InfoCircle, Wallet } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import Image from "next/image";
import { Switch } from "../ui/switch";
import { feeTiers, poolTokens } from "@/constants";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { connection } from "@/anchor/setup";
import toast from "react-hot-toast";
import { AddLiqudityToThePool, WithdrawLiquidityFromThePool } from "@/anchor/pool";
import { PublicKey, Transaction } from "@solana/web3.js";

type Pool = {
  poolAddress: string;
  owner: string;
  tokenA: { address: string; symbol: string };
  tokenB: { address: string; symbol: string };
  reserveA: number;
  reserveB: number;
  liquidityTokenMint: string;
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




const WithdrawLiquidityPool: FC<DepositPoolProps> = ({ pools, tokens }) => {
  const [baseToken, setBaseToken] = useState<string>("");
  const [baseAmount, setBaseAmount] = useState<string>("0.00");
  const [isLocked, setIsLocked] = useState(false);
  const [appLoading, setAppLoading] = useState(false);
  const { publicKey, sendTransaction } = useWallet();

  const filteredBaseToken = tokens.filter(token =>
      pools.some(pool => pool.liquidityTokenMint === token.mint)
  );

  const withdrawLiquidity = async () => {

    const baseTokenAmount = tokens.find(token => token.mint === baseToken)?.amount || 0;
    const isBaseAmountValid = Number(baseAmount) <= baseTokenAmount;

    if (!isBaseAmountValid ) {
      toast.error("you can't withdraw more than you have in your wallet");
      return;
    } 

    const poolAccount = pools[0]?.poolAddress;
    
    if (!publicKey || !poolAccount || !baseAmount ) return;

    setAppLoading(true);

    try {
      const withdraw = await WithdrawLiquidityFromThePool(publicKey, new PublicKey(poolAccount), parseFloat(baseAmount));
        const withDTx = new Transaction().add(...withdraw);

        const WPtx = await sendTransaction(withDTx, connection);
      const confirmation = await connection.confirmTransaction(WPtx, 'confirmed');
      if (!confirmation.value.err) {

        toast.success("Withdrawn from the pool");
        setBaseToken("");
        setBaseAmount("0.00");
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
    <div className="w-full rounded-[10px] bg-black/90 p-4 space-y-4">
      {/* Base Token */}
      <div className="space-y-2">
        <div className="flex mt-2 items-center justify-between">
                  <label className="text-white mb-2 text-sm">liquidity Token Mint</label>
                <div className="flex text-xs text-white gap-2"><Wallet size={15} /> {tokens.find(token => token.mint === baseToken)?.amount || 0}</div>
                </div>
        <div className="flex items-center rounded-[10px] h-[42px] w-full bg-dark-blue">
          <Select value={baseToken} onValueChange={setBaseToken}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent className="bg-dark-blue border-none">
              {filteredBaseToken.map((token, index) => (
                <SelectItem key={`${token.mint}-${token.symbol}-${index}`} value={token.mint} className="text-white hover:bg-white/10">
                  <div className="flex items-center space-x-2">
                    <Image src={token.picture} alt={token.symbol} className="w-5 h-5 rounded-full" width={20}
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
            className="outline-none border-none focus:ring-0 no-spinner text-tertiary bg-none  text-right"
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
        <Switch checked={isLocked} onCheckedChange={setIsLocked} className="data-[state=checked]:bg-blue-600" />
      </div>

      {/* Create and Deposit Button */}
      <Button className="w-full bg-secondary rounded-[10px] h-[51px]" onClick={withdrawLiquidity}>
        {appLoading ? 'loading...' : 'withdraw'}
      </Button>
    </div>
  );
};

export default WithdrawLiquidityPool;
