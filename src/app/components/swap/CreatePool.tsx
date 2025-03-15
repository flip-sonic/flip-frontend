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
import { initializeAPool } from "@/anchor/pool";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { connection } from "@/anchor/setup";
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

  useEffect(() => {
    if (baseAmount !== "0.00") {
      const calculatedPrice = parseFloat(quoteAmount) / parseFloat(baseAmount);
      setInitialPrice(calculatedPrice.toFixed(2));
    } else {
      setInitialPrice("0.00");
    }
  }, [quoteAmount, baseAmount]);

  const handleCreatePool = async () => {
    console.log({
      baseToken,
      quoteToken,
      baseAmount,
      quoteAmount,
      initialPrice,
      selectedFee,
      isLocked,
    });

    if (!publicKey || !baseToken || !quoteToken) return;

    setAppLoading(true);

    try {
      const baseTokenObj = tokens.find(token => token.mint === baseToken);
      const quoteTokenObj = tokens.find(token => token.mint === quoteToken);

      if (!baseTokenObj || !quoteTokenObj) throw new Error("Invalid tokens selected");

      const initializePoolInstruction = await initializeAPool(publicKey, new PublicKey(baseTokenObj.mint), new PublicKey(quoteTokenObj.mint), parseFloat(selectedFee));
      const transaction = new Transaction().add(initializePoolInstruction);

      const IPtx = await sendTransaction(transaction, connection);
      const confirmation = await connection.confirmTransaction(IPtx, 'confirmed');
      if (!confirmation.value.err) {

        toast.success("Pool Initialized");
        setBaseToken("");
        setQuoteToken("");
        setBaseAmount("0.00");
        setQuoteAmount("0.00");
        setInitialPrice("0.00");
        setSelectedFee("0.25");
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
        <label className="text-white mb-2 text-sm">Base Token</label>
        <div className="flex space-x-2">
          <Select required value={baseToken} onValueChange={setBaseToken}>
            <SelectTrigger className="bg-[#141529] border-0 text-white">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent className="bg-[#141529] border-[#2A2B3F]">
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
            <div className="flex text-xs text-white gap-2"><Wallet size={15} /> {tokens.find(token => token.mint === quoteToken)?.amount || 0}</div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Select required value={quoteToken} onValueChange={setQuoteToken}>
            <SelectTrigger className="bg-[#141529] border-0 text-white">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent className="bg-[#141529] border-[#2A2B3F]">
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
            className="bg-[#141529] outline-none border-none focus:ring-0 no-spinner text-white text-right"
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
        <span className="inline-block bg-[#141529] border-0 text-white">{initialPrice}</span>
      </div>

      {/* Fee Tier */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <label className="text-white text-sm">Fee tier</label>
          <InfoCircle className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex flex-wrap gap-2">
          {feeTiers.map((fee) => (
            <Button
              key={fee.value}
              variant={selectedFee === fee.value ? "default" : "secondary"}
              onClick={() => setSelectedFee(fee.value)}
              className={`px-4 py-2 ${selectedFee === fee.value
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-[#141529] hover:bg-[#1A1B30] text-white"
                }`}
            >
              {fee.label}
            </Button>
          ))}
          <Button variant="secondary" className="bg-[#141529] hover:bg-[#1A1B30] text-white">
            Custom
          </Button>
        </div>
      </div>

      {/* Start Now and Custom Buttons */}
      <div className="flex space-x-2">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1">Start Now</Button>
        <Button variant="secondary" className="bg-[#141529] hover:bg-[#1A1B30] text-white flex-1">
          Custom
        </Button>
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
      <Button className="w-full bg-[#383964] hover:bg-[#434687] text-white" onClick={handleCreatePool}>
        Create and deposit
      </Button>
    </div >
  );
};

export default CreatePool;
