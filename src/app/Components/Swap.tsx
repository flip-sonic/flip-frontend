import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Settings } from "lucide-react";

const coins = [
  { name: "SOL", icon: "/sol.svg" },
  { name: "JUP", icon: "/jup.svg" },
  { name: "ETH", icon: "/eth.svg" },
  { name: "BTC", icon: "/btc.svg" }
];

export default function Swap() {
  const [activeTab, setActiveTab] = useState("swap");
  const [selectedCoin, setSelectedCoin] = useState(coins[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="max-w-xs mx-auto p-4 bg-blue-900/30 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-800">
      {/* Tabs */}
      <div className="flex justify-between mb-4">
        <Button 
          variant={activeTab === "swap" ? "default" : "ghost"} 
          className="w-1/2"
          onClick={() => setActiveTab("swap")}
        >
          Swap
        </Button>
        <Button 
          variant={activeTab === "liquidity" ? "default" : "ghost"} 
          className="w-1/2"
          onClick={() => setActiveTab("liquidity")}
        >
          Liquidity
        </Button>
      </div>
      
      {/* Swap Box */}
      <div className="bg-blue-900/40 p-4 rounded-xl border border-blue-800 mb-4 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 relative">
            <img src={selectedCoin.icon} alt={selectedCoin.name} className="w-6 h-6" />
            <span>{selectedCoin.name}</span>
            <ChevronDown 
              className="w-4 h-4 text-gray-400 cursor-pointer" 
              onClick={() => setDropdownOpen(!dropdownOpen)} 
            />
            {dropdownOpen && (
              <div className="absolute top-10 left-0 bg-blue-900/80 backdrop-blur-md rounded-lg p-2 w-32 border border-blue-700">
                {coins.map((coin) => (
                  <div 
                    key={coin.name} 
                    className="flex items-center space-x-2 p-2 hover:bg-blue-800 rounded cursor-pointer"
                    onClick={() => {
                      setSelectedCoin(coin);
                      setDropdownOpen(false);
                    }}
                  >
                    <img src={coin.icon} alt={coin.name} className="w-6 h-6" />
                    <span>{coin.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="0.0"
            className="bg-transparent text-right text-xl w-full focus:outline-none"
          />
        </div>
        <p className="text-xs text-gray-400">Total Supply: 100B | Holders: 1.8M</p>
      </div>
      
      {/* Flip Button */}
      <div className="flex justify-center mb-4">
        <div className="bg-blue-800 p-2 rounded-full border border-blue-700">
          <span className="text-white text-xl">8</span>
        </div>
      </div>
      
      {/* Receive Box */}
      <div className="bg-blue-900/40 p-4 rounded-xl border border-blue-800 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/jup.svg" alt="JUP" className="w-6 h-6" />
            <span>JUP</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="0.0"
            className="bg-transparent text-right text-xl w-full focus:outline-none"
          />
        </div>
        <p className="text-xs text-gray-400">Total Supply: 100B | Holders: 800K</p>
      </div>
      
      {/* Slippage & Settings */}
      <div className="flex justify-between items-center text-sm text-gray-300 mb-4">
        <div className="flex items-center space-x-1">
          <span>Slippage 0.5%</span>
          <Settings className="w-4 h-4" />
        </div>
      </div>
      
      {/* Connect Button */}
      <Button className="w-full">Connect</Button>
      
      {/* Footer */}
      <p className="text-center text-xs text-gray-400 mt-4">
        Powered by SonicSVM <img src="/sonic.svg" alt="SonicSVM" className="inline w-4 h-4" />
      </p>
    </div>
  );
}
