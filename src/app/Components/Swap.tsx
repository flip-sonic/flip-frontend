import {  Database, Send } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
const Swap = () => {
  return (
    <div className="py-10">
      <div className="flex justify-center items-center min-h-screen bg-cover bg-center">
        <div className="bg-[#00042380] bg-opacity-50 p-6 rounded-2xl w-full max-w-xs text-white shadow-lg">
          {/* background: #00042380; */}

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button className="bg-[#A0A0FF] bg-opacity-30 text-[#A0A0FF] px-4 py-2 rounded-full font-semibold text-sm">
              Swap
            </button>
            <button className="bg-[#A0A0FF] bg-opacity-30 text-[#A0A0FF] px-4 py-2 rounded-full font-semibold text-sm">
              Liquidity
            </button>
            <div className="bg-[#000423] text-[#A0A0FF] px-4 py-2 rounded-full text-sm font-medium flex gap-x-2">
              <Database size={20} className="text-[#A0A0FF]" /> Flip
            </div>
          </div>

          
        </div>
      </div>
      
    </div>
  );
};

export default Swap;
