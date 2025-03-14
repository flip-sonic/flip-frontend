import { useState } from "react";

import { Palette } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";

const tokens = [
  { label: "SOL", value: "SOL" },
  { label: "JUP", value: "JUP" },
  { label: "USDC", value: "USDC" },
];

export default function SwapLiquidity() {
  const [activeTab, setActiveTab] = useState("swap");
  const [fromToken, setFromToken] = useState("SOL");
  const [toToken, setToToken] = useState("JUP");
  const [amount, setAmount] = useState("");

  const handleFlip = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(value);
  };

  return (
    <div className="flex justify-center bg-cover bg-center">
      <div className="bg-[#00042380] bg-opacity-50 p-4 rounded-2xl w-full max-w-sm text-white shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-x-2">
            <button className="bg-[#001AEF] text-white px-4 py-2 rounded-[10px] font-semibold text-sm">
              Swap
            </button>
            <button className="bg-[#040C6E] text-[#A0A0FF] px-4 py-2 rounded-[10px] font-semibold text-sm">
              Liquidity
            </button>
          </div>

          <div className="bg-[#34359C] text-white px-4 py-2 rounded-[10px] text-sm font-medium flex gap-x-2 ml-auto">
            <Palette size={20} className="text-white" /> Flip
          </div>
        </div>
      </div>
    </div>
  );
}
