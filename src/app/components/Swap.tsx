import { useEffect, useState } from "react";
import Image from "next/image";

import { ChevronDown, Circle, DollarSign, Wallet, Palette, Settings, Info, Lock, LockOpen } from "lucide-react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { BsFillLightningFill } from "react-icons/bs";
import CreateLiquidity from "./CreateLiquidity";
// import { FaXTwitter } from "react-icons/fa6";

const connection = new Connection('https://api.testnet.sonic.game', 'confirmed');

const tokenIcons: { [key: string]: string } = {
  "So11111111111111111111111111111111111111112": "/sol.svg",
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN": "/jup.svg",
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "/usdc.svg",
};

const defaultIcon = "/sonic.svg";

export default function SwapLiquidity() {
  const [tokens, setTokens] = useState<{ mint: string; amount: number; decimals: number; name: string, picture: string, symbol: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const { publicKey } = useWallet();
   const [activeTab, setActiveTab] = useState('swap');
   const [liquidityActiveTab, setLiquidityActiveTab] = useState('pool');

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
    <div className="flex justify-center bg-cover bg-center">
      <div className="bg-[#6464FF1A] bg-opacity-50 p-4 rounded-2xl w-full max-w-sm text-white shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-x-2">
            <button className={`flex  px-4 py-2 rounded-[10px] font-semibold text-sm ${activeTab === 'swap' ? 'bg-[#001AEF] text-white' : 'bg-[#040C6E] text-[#A0A0FF]'} `} onClick={() => setActiveTab('swap')} >
              <BsFillLightningFill className="text-xl" /> Swap
            </button>
            <button className={`px-4 py-2 rounded-[10px] font-semibold text-sm ${activeTab === 'liquidity' ? 'bg-[#001AEF] text-white' : 'bg-[#040C6E] text-[#A0A0FF]'} `} onClick={() => setActiveTab('liquidity')} >
              Liquidity
            </button>
          </div>

          <div className="bg-[#34359C] text-white px-4 py-2 rounded-[10px] text-sm font-medium flex gap-x-2 ml-auto">
            <Palette size={20} className="text-white" /> Flip
          </div>
        </div>
        {activeTab === 'swap' && (
        <div className="space-y-2 font-sans">
          {/* Item-1 */}
          <div className="flex justify-center bg-cover bg-center">
            <div className=" bg-[#070834] p-3 rounded-[10px] shadow-lg w-[350px]">
              <div className="flex justify-between items-center">
                <div className="flex gap-x-1">
                  <button className="bg-[#233BFF80] text-[#A0A0FF] px-4 py-2 rounded-[5px] font-semibold flex items-center gap-2">
                    <Image
                      src="/sol.svg"
                      alt="Solana Logo"
                      width={20}
                      height={20}
                      className="bg-black rounded-full p-[2px]"
                    />

                    <span className="text-white text-[13px]">SOL</span>
                    <span className="text-[#E13636] bg-[#000423] px-3 py-[2px] rounded text-[10px]">
                      -7%
                    </span>
                    <span className="text-[#E13636] text-xs pe-2">
                      <ChevronDown size={14} className="text-white" />
                    </span>
                  </button>
                </div>
                {/* Amount input field */}
                <div className="flex flex-col items-end rounded-lg w-full">
                  <label className="flex items-center gap-x-1 text-[#A0A0FF] text-[8px]">
                    <Wallet size={14} className="text-[#A0A0FF]" />
                    <span>10052 SOL</span>
                  </label>
                  <input
                    type="text"
                    value="10052"
                    className="bg-transparent text-[#A0A0FF] text-right text-2xl font-bold outline-none w-28 mt-1"
                  />

                  <span className="flex items-center   text-[#A0A0FF] text-[8px]">
                    <DollarSign size={10} className="text-[#A0A0FF]" /> 0
                  </span>
                </div>
              </div>

              {/* BUTTOM TEXT*/}
              <div className="text-[#b6b6cf] text-[8px]">
                <span>Total Supply: 100B</span>{" "}
                <span className="ml-2">Holders: 1.8M</span>
              </div>
            </div>
          </div>

          {/* item-2 */}
          <div className="flex justify-center bg-cover bg-center">
            <div className=" bg-[#070834] p-3 rounded-[10px] shadow-lg w-[350px]">
              <div className="flex justify-between items-center">
                <div className="flex gap-x-1">
                  <button className="bg-[#233BFF80] text-[#A0A0FF] px-4 py-2 rounded-[5px] font-semibold flex items-center gap-2">
                    <Image
                      src="/jup.svg"
                      alt="Solana Logo"
                      width={20}
                      height={20}
                      className="bg-black rounded-full p-[2px]"
                    />

                    <span className="text-white text-[13px]">JUP</span>
                    <span className="text-[#85EC7C] bg-[#1EDF0D33] px-3 py-[2px] rounded text-[10px]">+998%</span>


                    <span className="text-[#E13636] text-xs pe-2">
                      <ChevronDown size={14} className="text-white" />
                    </span>
                  </button>
                </div>
                {/* Amount input field */}
                <div className="flex flex-col items-end rounded-lg w-full">
                  <label className="flex items-center gap-x-1 text-[#A0A0FF] text-[8px]">
                    <Wallet size={14} className="text-[#A0A0FF]" />
                    <span>1000000 JUP</span>
                  </label>
                  <input
                    type="text"
                    value="1000000"
                    className="bg-transparent font-sans text-[#A0A0FF] text-right text-2xl font-bold outline-none w-28 mt-1"
                  />

                  <span className="flex items-center   text-[#A0A0FF] text-[8px]">
                    <DollarSign size={10} className="text-[#A0A0FF]" /> 0
                  </span>
                </div>
              </div>

              {/* BUTTOM TEXT*/}
              <div className="text-[#b6b6cf] text-[8px]">
                <span>Total Supply: 100B</span>{" "}
                <span className="ml-2">Holders: 800K</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4 text-xs">
            <button className="bg-[#233BFF80] text-[#A0A0FF] px-4 py-2 rounded-[10px] font-semibold text-sm" >
              Spillage: 0.5%
            </button>
            <Settings size={20} className="text-[#A0A0FF]" />
          </div>
          <button className="w-full mt-4 bg-blue-500 p-2 rounded">Connect</button>
        </div>
        )}
        {activeTab === 'liquidity' && (
          <div className="font-sans">
              <div className="justify-between items-center mb-4">
                <div className="flex gap-x-2">
                  <button
                    className={`px-2 py-1 rounded-[10px] font-medium text-xs transition-all ${liquidityActiveTab === 'create' ? 'bg-[#001AEF] text-white' : 'bg-[#34359C] text-white'}
                        `} onClick={() => setLiquidityActiveTab('create')}
                  >
                    Create
                  </button>                  
                  <button className={`px-2 py-1 rounded-[10px] font-medium transition-all text-xs ${liquidityActiveTab === 'pool' ? 'bg-[#001AEF] text-white' : 'bg-[#34359C] text-white'}`} onClick={() => setLiquidityActiveTab('pool')}>
                    My Pool
                  </button>
                </div>

                <div className=""></div>
              </div>

              {liquidityActiveTab === 'pool' && (
              <div className="max-w-sm bg-[#000423B2] opacity-70 rounded-md p-4 flex justify-center">

                {/* SearchBox */}
                <div
                  className="relative">
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
                      <svg
                        className="shrink-0 size-4 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                    </div>
                    <input
                      className="py-1 ps-10 pe-4 block w-full border-0 rounded-md sm:text-sm focus:border-transparent text-white focus:ring-transparent disabled:opacity-50 disabled:pointer-events-none bg-[#181A5D] font-semibold"
                      type="text"
                      role="combobox"
                      aria-expanded="false"
                      aria-controls="combobox-list"
                      placeholder="Paste contract address" 
                      defaultValue=""
                      data-hs-combo-box-input=""
                    />
                  </div>
                </div>
                {/* End SearchBox */}
              </div>
              )}

              {liquidityActiveTab == 'create' && (
                loading ? <h3>Loading</h3> :
                <CreateLiquidity tokens={tokens} />
              )}
            </div>
        )}
      </div>
    </div>
  );
}
