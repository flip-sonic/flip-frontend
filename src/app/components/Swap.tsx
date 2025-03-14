import { useEffect, useState } from 'react';
import { ArrowUpDown, CreditCard, Palette } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import TokenDropdown from './TokenDropdown';
import { BsFillLightningFill } from "react-icons/bs";
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

// const tokens = [
//   { label: 'SOL', value: 'SOL', image: "/sol.svg" },
//   { label: 'JUP', value: 'JUP', image: "jup.svg" },
//   { label: 'USDC', value: 'USDC', image: "/usdc.svg" },
//   { label: 'USDT', value: 'USDT', image: '/usdt.svg' },
// ];

const connection = new Connection('https://api.testnet.sonic.game', 'confirmed');

export default function SwapLiquidity() {
  const [activeTab, setActiveTab] = useState('swap');
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('JUP');
  const [amount, setAmount] = useState('');
  const { publicKey } = useWallet();


  interface Token {
    mint: string;
    amount: number;
    decimals: number;
    usdValue?: number | string;
  }

  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) return;

    setLoading(true);

    const fetchBalances = async () => {
      try {
        // Fetch SOL balance
        const solBalance = await connection.getBalance(publicKey);

        // Fetch other token balances
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID });

        const tokenList = tokenAccounts.value.map((account) => {
          const info = account.account.data.parsed.info;
          return {
            mint: info.mint,
            amount: info.tokenAmount.uiAmount,
            decimals: info.tokenAmount.decimals
          };
        });

        // Include SOL balance as a token, using `publicKey` as the "mint"
        tokenList.unshift({
          mint: publicKey.toBase58(),
          amount: solBalance / LAMPORTS_PER_SOL,
          decimals: 9
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

      {/* {activeTab === 'swap' && (
        <div className="mt-4 space-y-3">
          <div className='flex '>
            <select className="w-full p-2 bg-gray-800 rounded" value={fromToken} onChange={(e) => setFromToken(e.target.value)}>
            {tokens.map((token) => (
              <option key={token.value} value={token.value}>
                <Image src={token.image} /> {token.label}</option>
            ))}
          </select>
          <input className="w-full p-2 bg-gray-800 rounded" value={amount} onChange={handleAmountChange} placeholder="Enter amount" />
          </div>
          
          <select className="w-full p-2 bg-gray-800 rounded" value={toToken} onChange={(e) => setToToken(e.target.value)}>
            {tokens.map((token) => (
              <option key={token.value} value={token.value}>{token.label}</option>
            ))}
          </select>
          <button className="w-full mt-4 bg-blue-500 p-2 rounded">Connect</button>
        </div>
      )} */}

      {activeTab === 'swap' && (
        <div className="mt-4 space-y-3">
          {/* From Token Selection */}
          <div className="flex p-2 space-x-2">
            <div>
              <TokenDropdown tokens={tokens} fromToken={fromToken} setFromToken={setFromToken} />
              <div className='flex flex-row'>
                <p className='text-xs'>Total supply: 100B</p>
                <p className='text-xs'>Holders: 1.8M</p>
              </div>
            </div>
            <div>
              <p><CreditCard /> {tokens.map(token => token.value).join(', ')}</p>
              <input 
            className="w-full p-2 bg-gray-800 rounded" 
            value={amount} 
            onChange={handleAmountChange} 
            placeholder="Enter amount" 
            />
            {/* price of the input amount in dollars */}
            <div>
              {/* {WalletToken.map((token, index) => (
                <p key={index}>{token.label}: {token.value}</p>
              ))} */}
            </div>
            </div>
          </div>
          {/* To Token Selection */}
          <TokenDropdown tokens={tokens} fromToken={toToken} setFromToken={setToToken} />
          <button className="w-full mt-4 bg-blue-500 p-2 rounded">Connect</button>
        </div>
      )}


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
      <div>
        <h1>Your Public key is: {publicKey?.toString()}</h1>
            <ul>
              {tokens.map((token, index) => (
                <li key={index} className="p-2 border-b">
                  <p><strong>Mint:</strong> {token.mint}</p>
                  <p><strong>Balance:</strong> {token.amount}</p>
                  <p><strong>Value:</strong> ${token.usdValue}</p>
                </li>
              ))}
            </ul>
      </div>
    </div>
  );
}
