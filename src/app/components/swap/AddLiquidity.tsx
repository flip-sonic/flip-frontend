"use client";

import { FC, useEffect } from "react";
import { useState } from "react";
import { InfoIcon as InfoCircle, Wallet } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import Image from "next/image";
import { Switch } from "../ui/switch";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import { AddLiqudityToThePool } from "@/anchor/pool";
import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { quoteSwap } from "@/anchor/swap";
import { createAssociatedTokenAccountInstruction, createCloseAccountInstruction, createSyncNativeInstruction, getAssociatedTokenAddress, NATIVE_MINT } from "@solana/spl-token";

type Pool = {
  poolAddress: string;
  owner: string;
  tokenA: { address: string; symbol: string };
  tokenB: { address: string; symbol: string };
  reserveA: number;
  reserveB: number;
  fee: number;
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

const connection = new Connection('https://api.testnet.sonic.game', 'confirmed');

const AddLiquidityPool: FC<DepositPoolProps> = ({ pools, tokens }) => {
  const [baseToken, setBaseToken] = useState<string>("");
  const [quoteToken, setQuoteToken] = useState<string>("");
  const [baseAmount, setBaseAmount] = useState<string>("0.00");
  const [quoteAmount, setQuoteAmount] = useState<string>("0.00");
  const [selectedFee, setSelectedFee] = useState<string>("0.25");
  const [isLocked, setIsLocked] = useState(false);
  const [appLoading, setAppLoading] = useState(false);
  const { publicKey, sendTransaction } = useWallet();

  const filteredBaseToken = tokens.filter(token =>
    pools.some(pool => pool.tokenA.address === token.mint)
  );

  const filteredQouteTokens = tokens.filter(token =>
    pools.some(pool => pool.tokenB.address === token.mint)
  );

  const reserveA = pools.length > 0 ? pools[0].reserveA.toString() : "";
  const reserveB = pools.length > 0 ? pools[0].reserveB.toString() : "";

  useEffect(() => {
    if (!publicKey) return;
    const fetchData = async () => {
      if (baseAmount && baseToken && quoteToken) {
        if (pools[0].reserveA || pools[0].reserveB) {
          const quoteEqual = (parseFloat(reserveB)  * parseFloat(baseAmount)/ parseFloat(reserveA));
          setQuoteAmount(quoteEqual.toString());
        }
      } else {
        setQuoteAmount("0.00");
      }
    }
    fetchData();
  }, [baseAmount, baseToken, quoteToken, publicKey, reserveA, reserveB, pools]);

  const addLiquidity = async () => {

    const baseTokenAmount = tokens.find(token => token.mint === baseToken)?.amount || 0;
    const quoteTokenAmount = tokens.find(token => token.mint === quoteToken)?.amount || 0;
    const isBaseAmountValid = Number(baseAmount) <= baseTokenAmount;
    const isQuoteAmountValid = Number(quoteAmount) <= quoteTokenAmount;

    if (!isBaseAmountValid || !isQuoteAmountValid) {
      toast.error("you can't add more than you have in your wallet");
      return;
    }

    const poolAccount = pools[0]?.poolAddress;

    if (!publicKey || !poolAccount || !baseAmount || !quoteAmount) return;

    setAppLoading(true);

    try {
      const deposit = await AddLiqudityToThePool(publicKey, new PublicKey(poolAccount), parseFloat(baseAmount), parseFloat(quoteAmount));
      const depoTx = new Transaction().add(...deposit);

      // const associatedTokenAccount = await getAssociatedTokenAddress(
      //   NATIVE_MINT,
      //   publicKey
      // );

      // const txx = new Transaction()
      
      // txx.add(createAssociatedTokenAccountInstruction(
      //   publicKey,
      //   associatedTokenAccount,
      //   publicKey,
      //   NATIVE_MINT,
      //   // TOKEN_PROGRAM_ID,
      //   // ASSOCIATED_TOKEN_PROGRAM_ID
      // ),)

      // txx.add(
      //   SystemProgram.transfer({
      //     fromPubkey: publicKey,
      //     toPubkey: associatedTokenAccount,
      //     lamports: 1000000000,
      //   }),
      //   createSyncNativeInstruction(associatedTokenAccount)
      // )
      //  txx.add(createCloseAccountInstruction(associatedTokenAccount, publicKey, publicKey));
      // const txxx = await sendTransaction(txx, connection);
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
    <div className="w-full rounded-[10px] bg-black/90 p-4 space-y-4">
      {/* Base Token */}
      <div className="space-y-2">
        <div className="flex mt-2 items-center justify-between">
          <label className="text-white mb-2 text-sm">Base Token</label>
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

      {/* Quote Token */}
      <div className="space-y-2">
        <div className="flex mt-2 items-center justify-between">
          <div className="flex items-center space-x-2">
            <label className="text-white text-sm">Quote token</label>
            <InfoCircle className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex text-xs text-white gap-2"><Wallet size={15} /> {tokens.find(token => token.mint === quoteToken)?.amount || 0}</div>
        </div>
        <div className="flex items-center rounded-[10px] h-[42px] w-full bg-dark-blue">
          <Select value={quoteToken} onValueChange={setQuoteToken}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent className="bg-dark-blue border-none">
              {filteredQouteTokens.map((token, index) => (
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
            value={quoteAmount}
            onChange={(e) => setQuoteAmount(e.target.value)}
            className="bg-none text-tertiary outline-none border-none focus:ring-0 no-spinner text-right"
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
      <Button className="w-full bg-secondary rounded-[10px] h-[51px]" onClick={addLiquidity}>
        {appLoading ? 'loading...' : 'deposit'}
      </Button>
    </div>
  );
};

export default AddLiquidityPool;
