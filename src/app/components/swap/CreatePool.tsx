"use client";

import { FC } from "react";
import { useState } from "react";
import { InfoIcon as InfoCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import Image from "next/image";
import { Switch } from "../ui/switch";
import { feeTiers, poolTokens } from "@/constants";
import { Button } from "@/components/ui/button";

const CreatePool: FC = ({}) => {
  const [baseToken, setBaseToken] = useState<string>("");
  const [quoteToken, setQuoteToken] = useState<string>("");
  const [baseAmount, setBaseAmount] = useState<string>("0.00");
  const [quoteAmount, setQuoteAmount] = useState<string>("0.00");
  const [initialPrice, setInitialPrice] = useState<string>("0.00");
  const [selectedFee, setSelectedFee] = useState<string>("0.25");
  const [isLocked, setIsLocked] = useState(false);

  const handleCreatePool = () => {
    console.log({
      baseToken,
      quoteToken,
      baseAmount,
      quoteAmount,
      initialPrice,
      selectedFee,
      isLocked,
    });
  };

  return (
    <div className="w-full rounded-[10px] bg-black/90 p-4 space-y-4">
      {/* Base Token */}
      <div className="space-y-2">
        <label className="text-white text-sm">Base Token</label>
        <div className="flex items-center rounded-[10px] h-[42px] w-full bg-dark-blue">
          <Select value={baseToken} onValueChange={setBaseToken}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent className="bg-dark-blue border-none">
              {poolTokens.map((token) => (
                <SelectItem key={token.id} value={token.id} className="text-white hover:bg-white/10">
                  <div className="flex items-center space-x-2">
                    <Image src={token.icon} alt={token.symbol} className="w-5 h-5 rounded-full" />
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
            className="bg-none border-none text-tertiary text-right"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Quote Token */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <label className="text-white text-sm">Quote token</label>
          <InfoCircle className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-center rounded-[10px] h-[42px] w-full bg-dark-blue">
          <Select value={quoteToken} onValueChange={setQuoteToken}>
            <SelectTrigger className="">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent className="bg-dark-blue border-none">
              {poolTokens.map((token) => (
                <SelectItem key={token.id} value={token.id} className="text-white hover:bg-white/10">
                  <div className="flex items-center space-x-2">
                    <Image src={token.icon || "/placeholder.svg"} alt={token.symbol} className="w-5 h-5 rounded-full" />
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
            className="bg-none border-none text-tertiary text-right"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Initial Price */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <label className="text-white text-sm">Initial Price</label>
          <InfoCircle className="w-4 h-4 text-gray-400" />
        </div>
        <Input
          type="number"
          value={initialPrice}
          onChange={(e) => setInitialPrice(e.target.value)}
          className="h-[42px] border-none text-tertiary text-right bg-dark-blue"
          placeholder="0.00"
        />
      </div>

      {/* Fee Tier */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <label className="text-white text-sm">Fee tier</label>
          <InfoCircle className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex flex-wrap gap-2">
          {feeTiers.map(({ id, percentage }) => (
            <Button
              key={id}
              onClick={() => setSelectedFee(id)}
              className={`px-4 py-2 ${
                selectedFee === id ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-[#141529] hover:bg-[#1A1B30] text-white"
              }`}
            >
              {percentage}
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
        <Switch checked={isLocked} onCheckedChange={setIsLocked} className="data-[state=checked]:bg-blue-600" />
      </div>

      {/* Create and Deposit Button */}
      <Button className="w-full bg-[#383964] hover:bg-[#434687] text-white" onClick={handleCreatePool}>
        Create and deposit
      </Button>
    </div>
  );
};

export default CreatePool;
