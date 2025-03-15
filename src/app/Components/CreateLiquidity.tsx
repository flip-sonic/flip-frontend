"use client";
import { useState } from "react";
import { Info, LockOpen, Wallet, Lock } from "lucide-react";

interface Prop {
  tokens: {
    mint: string;
    amount: number;
    decimals: number;
    name: string;
    symbol: string;
    picture: string;
  }[];
}

export default function CreateLiquidity({ tokens }: Prop) {
  const [baseToken, setBaseToken] = useState<Prop['tokens'][0] | null>(null);
  const [quoteToken, setQuoteToken] = useState<Prop['tokens'][0] | null>(null);
  const [baseAmount, setBaseAmount] = useState('');
  const [quoteAmount, setQuoteAmount] = useState('');
  const [initialPrice, setInitialPrice] = useState('');
  const [isLock, setIsLock] = useState(false);
  const [selectedTier, setSelectedTier] = useState("0");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);

  const handleBaseTokenChange = (token: { mint: string; amount: number; decimals: number; name: string; picture: string, symbol: string }) => {
    if (token.mint === quoteToken?.mint) return;
    setBaseToken(token);
    setIsOpen(false); // Close the dropdown after selection
  };

  const handleQuoteTokenChange = (token: { mint: string; amount: number; decimals: number; name: string; picture: string, symbol: string }) => {
    if (token.mint === baseToken?.mint) return;
    setQuoteToken(token);
    setIsOpen1(false); // Close the dropdown after selection
  };

  const handleBaseAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value > (baseToken?.amount || 0)) return;
    setBaseAmount(e.target.value);
  };

  const handleQuoteAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value > (quoteToken?.amount || 0)) return;
    setQuoteAmount(e.target.value);
  };

  const handleInitialPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInitialPrice(e.target.value);
  };

  const handleSubmit = () => {
    console.log({
      baseToken: baseToken?.mint,
      baseAmount,
      quoteToken: quoteToken?.mint,
      quoteAmount,
      initialPrice,
      selectedTier,
      isLock,
    });
  };

  return (
    <div>
      <div className="max-w-sm bg-[#000423] opacity-70 rounded-md p-4 flex justify-center relative">
        <form className="w-full">
          <label className="block text-[13px] text-[#ffffff] mb-2">Base Token</label>
          <div className="flex w-full justify-between relative bg-[#181A5D] rounded-md z-10">
            <div className="relative w-1/2">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-white px-4 py-2 text-left flex items-center text-sm flex flex-row gap-2"
              >
                {baseToken ? baseToken.symbol : <p>Select Token</p>}
                <span className="inline-block rotate-90 text-xl">{'>'}</span>
              </button>

              {isOpen && (
                <ul className="absolute w-full bg-gray-900 border border-gray-700 rounded-md mt-1 max-h-40 overflow-y-auto z-40">
                  {tokens.map((token) => (
                    <li
                      key={token.mint}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                      onClick={() => handleBaseTokenChange(token)}
                    >
                      <img src={token.picture} alt={token.symbol} className="w-5 h-5" />
                      {token.symbol}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <span className="inline-block"><br /></span>

            <input
              type="number"
              value={baseAmount}
              onChange={handleBaseAmountChange}
              placeholder="0.00"
              className="w-1/2 outline-none border-none focus:ring-0 no-spinner text-white px-4 py-2 bg-transparent text-right ml-2"
            />
          </div>

          <div className="flex mt-2 items-center justify-between">
            <label className="block text-[13px] flex items-center gap-2 text-[#ffffff] mb-2">
              Quote Token
              <Info size={15} fill="fill" className="text-blue-500" />
            </label>
            <div className="flex text-xs gap-2"><Wallet size={15} /> {quoteToken?.amount || 0}</div>
          </div>
          <div className="flex w-full justify-between relative bg-[#181A5D] rounded-md z-10">
            <div className="relative w-1/2">
              <button
                type="button"
                onClick={() => setIsOpen1(!isOpen1)}
                className="w-full text-white px-4 py-2 text-left flex items-center text-sm flex flex-row gap-2"
              >
                {quoteToken ? quoteToken.symbol : <p>Select Token</p>}
                <span className="inline-block rotate-90 text-xl">{'>'}</span>
              </button>

              {isOpen1 && (
                <ul className="absolute w-full bg-gray-900 border border-gray-700 rounded-md mt-1 max-h-40 overflow-y-auto z-20">
                  {tokens.map((token) => (
                    <li
                      key={token.mint}
                      className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                      onClick={() => handleQuoteTokenChange(token)}
                    >
                      <img src={token.picture} alt={token.symbol} className="w-5 h-5" />
                      {token.symbol}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <span className="inline-block"><br /></span>

            <input
              type="number"
              value={quoteAmount}
              onChange={handleQuoteAmountChange}
              placeholder="0.00"
              className="w-1/2 outline-none border-none focus:ring-0 no-spinner text-white px-4 py-2 bg-transparent text-right ml-2"
            />
          </div>

          <div className="flex mt-2 items-center justify-between">
            <label className="block text-[13px] flex items-center gap-2 text-[#ffffff] mb-2">
              Initial Price
              <Info size={15} fill="fill" className="text-blue-500" />
            </label>
          </div>
          <div className="flex w-full justify-between relative bg-[#181A5D] rounded-md">
            <input
              type="number"
              value={initialPrice}
              onChange={handleInitialPriceChange}
              placeholder="0.00"
              className="w-1/2 outline-none border-none focus:ring-0 no-spinner text-white px-2 py-2 bg-transparent text-left ml-2"
            />
          </div>

          <div className="flex mt-2 items-center justify-between">
            <label className="block text-[13px] flex items-center gap-2 text-[#ffffff] mb-2">
              Free Tier (Burn Percentage)
              <Info size={15} fill="fill" className="text-blue-500" />
            </label>
          </div>
          <div className="flex flex-wrap justify-center gap-2 p-2 mx-auto max-w-full">
            {["0.25%", "0.3%", "1%", "2%", "4%", "0"].map((tier) => (
              <button
                key={tier}
                type="button"
                className={`rounded-md bg-[#34359C] text-white px-3 py-1 text-center text-xs cursor-pointer hover:bg-[#4546B6] transition-all ${selectedTier === tier ? 'border-2 border-white' : ''}`}
                onClick={() => setSelectedTier(tier)}
                style={{ minWidth: "25px", maxWidth: "60px" }}
              >
                {tier}
              </button>
            ))}
          </div>

          <div className="flex items-center mt-2 gap-2">
            <div
              className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition relative ${isLock ? "bg-green-500" : "bg-gray-400"}`}
              onClick={() => setIsLock(!isLock)}
            >
              <span className="absolute left-2 text-white">
                {isLock ? <LockOpen size={15} color="blue" /> : <Lock color="blue" size={15} />}
              </span>
              <div
                className={`bg-[#000] w-6 h-6 rounded-full shadow-md text-white flex items-center justify-center text-xs font-bold transform transition ${isLock ? "translate-x-7" : "translate-x-0"}`}
              >
                {isLock ? "ON" : "OFF"}
              </div>
            </div>
            <div>
              <p className="flex gap-2 items-center">
                Lock
                <Info size={15} fill="fill" className="text-blue-500" />
              </p>
            </div>
          </div>
        </form>
      </div>
      <button type="button" onClick={handleSubmit} className="w-full mt-4 bg-blue-500 p-2 rounded">Create and Deposit</button>
    </div>
  );
}
