"use client";

import { FC, useEffect } from "react";
import { useState } from "react";
import { InfoIcon as InfoCircle, Wallet } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import Image from "next/image";
import { Switch } from "../ui/switch";
import { feeTiers, poolTokens } from "@/constants";
import { Button } from "@/components/ui/button";

// const CreatePool: FC = ({}) => {
// import { Button } from "../ui/Button";
import { useWallet } from "@solana/wallet-adapter-react";
import { AddLiqudityToThePool, initializeAPool } from "@/anchor/pool";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
// import { connection } from "@/anchor/setup";
import toast from "react-hot-toast";

interface CreatePoolProps {
  tokens: {
    mint: string;
    amount: number;
    decimals: number;
    name: string;
    picture: string;
    symbol: string;
  }[];
}

const connection = new Connection('https://api.testnet.sonic.game', 'confirmed');

const CreatePool: FC<CreatePoolProps> = ({ tokens }) => {
  const [baseToken, setBaseToken] = useState<string>("");
  const [quoteToken, setQuoteToken] = useState<string>("");
  const [baseAmount, setBaseAmount] = useState<string>("0.00");
  const [quoteAmount, setQuoteAmount] = useState<string>("0.00");
  const [initialPrice, setInitialPrice] = useState<string>("0.00");
  const [selectedFee, setSelectedFee] = useState<string>("0.25");
  const [isLocked, setIsLocked] = useState(false);
  const [appLoading, setAppLoading] = useState(false);
  const { publicKey, sendTransaction } = useWallet();
  const [fee, setFee] = useState(0);

  useEffect(() => {
    if (baseAmount !== "0.00") {
      const calculatedPrice = parseFloat(quoteAmount) / parseFloat(baseAmount);
      setInitialPrice(calculatedPrice.toFixed(2));
    } else {
      setInitialPrice("0.00");
    }
  }, [quoteAmount, baseAmount]);

  const handleCreatePool = async () => {
    if (!publicKey || !baseToken || !quoteToken) return;

    setAppLoading(true);

    try {
      const baseTokenObj = tokens.find(token => token.mint === baseToken);
      const quoteTokenObj = tokens.find(token => token.mint === quoteToken);

      if (!baseTokenObj || !quoteTokenObj) throw new Error("Invalid tokens selected");
      if (baseTokenObj.mint === quoteTokenObj.mint) throw new Error("Same Token is not accepted");

      const initializePoolInstruction = await initializeAPool(
        publicKey,
        new PublicKey(baseTokenObj.mint),
        new PublicKey(quoteTokenObj.mint),
        parseFloat(selectedFee)
      );

      const transaction = new Transaction().add(initializePoolInstruction);

      const IPtx = await sendTransaction(transaction, connection);
      
      const confirmation = await connection.confirmTransaction(IPtx, 'confirmed');

      if (!confirmation.value.err) {

        const transactionHash = await connection.getTransaction(IPtx, { commitment: "confirmed" });

        if (!transactionHash) throw new Error("Transaction not found");

        // Extract pool account from transaction instructions safely
        const poolAcc = transactionHash.transaction.message.accountKeys
          .find((key) => key.toBase58() !== publicKey.toBase58())?.toBase58();

        if (!poolAcc) throw new Error("Pool account not found in transaction");

        const deposit = await AddLiqudityToThePool(
          publicKey,
          new PublicKey(poolAcc),
          parseFloat(baseAmount),
          parseFloat(quoteAmount)
        );

        // Use spread operator to add multiple instructions
        const depoTx = new Transaction().add(...deposit);
        const DPtx = await sendTransaction(depoTx, connection);
        const depoConfirmation = await connection.confirmTransaction(DPtx, 'confirmed');

        if (!depoConfirmation.value.err) {
          toast.success("Pool Initialized and deposited");
          setBaseToken("");
          setQuoteToken("");
          setBaseAmount("0.00");
          setQuoteAmount("0.00");
          setInitialPrice("0.00");
          setSelectedFee("0.25");
          setIsLocked(false);
          setAppLoading(false);
          return;
        }
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
          <Select required value={baseToken} onValueChange={setBaseToken}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent className="bg-dark-blue border-none">
              {tokens.map((token, index) => (
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
        {/* </div> */}

        {/* Quote Token */}
        <div className="space-y-2">
          <div className="flex mt-2 items-center justify-between">
            <div className="flex items-center space-x-2">
              <label className="text-white text-sm">Quote token</label>
              <InfoCircle className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex text-xs text-white gap-2"><Wallet size={15} /> {tokens.find(token => token.mint === quoteToken)?.amount || 0}</div>
          </div>
        </div>
        <div className="flex items-center rounded-[10px] h-[42px] w-full bg-dark-blue">
          <Select required value={quoteToken} onValueChange={setQuoteToken}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent className="bg-dark-blue border-none">
              {tokens.map((token, index) => (
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
            className="outline-none border-none focus:ring-0 no-spinner text-tertiary bg-none text-right"
            placeholder="0.00" required
          />
        </div>
      </div>

      {/* Initial Price */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <label className="text-white text-sm">Initial Price</label>
          <InfoCircle className="w-4 h-4 text-gray-400" />
        </div>
        <span className="inline-block h-[42px] mx-auto border-none text-tertiary text-right">{initialPrice}</span>
      </div>

      {/* Fee Tier */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <label className="text-white text-sm">Fee tier</label>
          <InfoCircle className="w-4 h-4 text-gray-400" />
        </div>
        <div className="grid grid-cols-6 gap-[6px]">
          {feeTiers.map(({ id, percentage }) => (
            <Button
              key={id}
              onClick={() => setSelectedFee(id)}
              className={`h-[42px] w-full ${selectedFee === id ? "bg-primary text-white" : "bg-dark-blue"}`}
            >
              {percentage}
            </Button>
          ))}
          <Input
            type="number"
            value={fee}
            onChange={(e) => setFee(parseFloat(e.target.value))}
            className="h-[42px] border-none text-tertiary text-center bg-dark-blue"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="flex items-center gap-[6px]">
        <Button className="bg-primary h-[42px] w-[103px]">Start Now</Button>
        <Button className="h-[42px] w-[103px] text-tertiary bg-dark-blue">Custom</Button>
      </div>

      {/* Lock Switch */}
      <div className="flex items-center gap-3">
        <Switch checked={isLocked} onCheckedChange={setIsLocked} className="" />
        <div className="flex items-center space-x-2">
          <span className="text-white text-sm">Lock</span>
          <InfoCircle className="w-4 h-4 text-secondary" />
        </div>
      </div>

      {/* Create and Deposit Button */}
      <Button className="w-full bg-secondary rounded-[10px] h-[51px]" onClick={handleCreatePool}>{appLoading ? "loading" : "Create and deposit"}        
      </Button>
    </div >
  );
};

export default CreatePool;
