import { useEffect, useState } from 'react';
import { ArrowUpDown, ChevronDown, CreditCard, Palette, Wallet } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import TokenDropdown from './TokenDropdown';
import { BsFillLightningFill } from "react-icons/bs";
import Image from 'next/image';

const tokens = [
  { label: 'SOL', value: 'SOL', image: "/sol.svg" },
  { label: 'JUP', value: 'JUP', image: "jup.svg" },
  { label: 'USDC', value: 'USDC', image: "/usdc.svg" },
  { label: 'USDT', value: 'USDT', image: '/usdt.svg' },
];

const connection = new Connection('https://api.testnet.sonic.game', 'confirmed');

export default function SwapLiquidity() {
  const [activeTab, setActiveTab] = useState('swap');
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('JUP');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const { publicKey } = useWallet();
  const [WalletToken, setWalletToken] = useState<{ label: string; value: string }[]>([]);

  // const wallet_address = publicKey?.toBase58();
  // console.log(wallet_address);

  useEffect(() => {
    const get = async () => {
      await getSolBalance();
    }
    get();

  }, [publicKey]);

  const getSolBalance = async () => {
    if (!publicKey) return;
    await connection.getBalance(publicKey).then((info) => {
      if (info) {
        setBalance(info / LAMPORTS_PER_SOL);
      }
    });
  }

  const handleFlip = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-900 text-white rounded-lg shadow-md">
      <div className="flex justify-between space-x-4 border-b border-gray-700 pb-2">
        <span className='flex'>
          <button className={`px-4 flex py-2 rounded ${activeTab === 'swap' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-400'}`} onClick={() => setActiveTab('swap')}><BsFillLightningFill className="text-xl" /> Swap</button>
          <button className={`px-4 py-2 rounded ${activeTab === 'liquidity' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-400'}`} onClick={() => setActiveTab('liquidity')}>Liquidity</button>
        </span>
        <span className='bg-[#34359c]'>
        <button className="ml-auto flex gap-1 flex-row px-4 py-2 text-white bg-[#34359c] rounded-sm" onClick={handleFlip}>
          <Palette size={20} /> Flip
        </button>
        </span>
      </div>

      {activeTab === 'swap' && (
        <div className="space-y-2">
          <div className="flex justify-center bg-cover bg-center">
            <div className="justify-between bg-[#000423] p-4 rounded-2xl shadow-lg w-[350px]">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-x-2">
                  <button className="bg-[#17175B] text-[#A0A0FF] px-4 py-2 rounded-[10px] font-semibold flex items-center gap-2">
                    <Image
                      src="/sol.svg" // Update the path with the correct logo
                      alt="Solana Logo"
                      width={20}
                      height={20}
                    />
                    <span className="text-white">SOL</span>
                    <span className="text-[#FF646A] text-xs">-7%</span>
                    <ChevronDown size={14} className="text-white" />
                  </button>
                </div>
              </div>

              {/* Token Supply and Holders */}
              <div className="text-[#b6b6cf] text-[8px]">
                <span>Total Supply: 100B</span>{" "}
                <span className="ml-2">Holders: 1.8M</span>
              </div>
              <div className="flex mt-2">
                <label className="text-[#b6b6cf] text-xs flex items-center gap-1">
                  <Wallet size={14} className="text-white" />
                  10052 SOL
                </label>
                <input
                  type="text"
                  value="10052"
                  className="bg-transparent text-white text-right text-2xl font-bold outline-none w-28"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* {activeTab === 'swap' && (
        <div className="mt-4 space-y-3">
          {/* From Token Selection */}
          {/* <div className="flex p-2 space-x-2">
            <div>
              <TokenDropdown tokens={tokens} fromToken={fromToken} setFromToken={setFromToken} />
              <div className='flex flex-row'>
                <p className='text-xs'>Total supply: 100B</p>
                <p className='text-xs'>Holders: 1.8M</p>
              </div>
            </div>
            <div>
              <p><CreditCard /> {balance} {tokens.map(token => token.value).join(', ')}</p>
              <input 
            className="w-full p-2 bg-gray-800 rounded" 
            value={amount} 
            onChange={handleAmountChange} 
            placeholder="Enter amount" 
            /> */}
            {/* price of the input amount in dollars */}
            {/* <p>{}</p>
            </div>
          </div> */}
          {/* To Token Selection */}
          {/* <TokenDropdown tokens={tokens} fromToken={toToken} setFromToken={setToToken} />
          <button className="w-full mt-4 bg-blue-500 p-2 rounded">Connect</button>
        </div> */}
      {/* )} */}


      {activeTab === 'liquidity' && (
        <div className="mt-4 space-y-3">
          <p className="text-center">Liquidity Pool Coming Soon...</p>
        </div>
      )}

      {activeTab === 'flip' && (
        <div className="mt-4 space-y-3">
          <p className="text-center">Flip Pool Coming Soon...</p>
        </div>
      )}
    </div>
  );
}
