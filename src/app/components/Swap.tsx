import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';

const tokens = [
  { label: 'SOL', value: 'SOL' },
  { label: 'JUP', value: 'JUP' },
  { label: 'USDC', value: 'USDC' },
];

export default function SwapLiquidity() {
  const [activeTab, setActiveTab] = useState('swap');
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('JUP');
  const [amount, setAmount] = useState('');

  const handleFlip = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };

  return (
    <div className="p-4 max-w-xs mx-auto bg-gray-900 text-white rounded-lg shadow-md">
      <div className="flex space-x-4 border-b border-gray-700 pb-2">
        <button className={`px-4 py-2 rounded ${activeTab === 'swap' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-400'}`} onClick={() => setActiveTab('swap')}>Swap</button>
        <button className={`px-4 py-2 rounded ${activeTab === 'liquidity' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-400'}`} onClick={() => setActiveTab('liquidity')}>Liquidity</button>
        <button className="ml-auto p-2 bg-gray-800 rounded" onClick={handleFlip}>
          <ArrowUpDown size={20} /> 
        </button>
      </div>

      {activeTab === 'swap' && (
        <div className="mt-4 space-y-3">
          <select className="w-full p-2 bg-gray-800 rounded" value={fromToken} onChange={(e) => setFromToken(e.target.value)}>
            {tokens.map((token) => (
              <option key={token.value} value={token.value}>{token.label}</option>
            ))}
          </select>
          <input className="w-full p-2 bg-gray-800 rounded" value={amount} onChange={handleAmountChange} placeholder="Enter amount" />
          <select className="w-full p-2 bg-gray-800 rounded" value={toToken} onChange={(e) => setToToken(e.target.value)}>
            {tokens.map((token) => (
              <option key={token.value} value={token.value}>{token.label}</option>
            ))}
          </select>
          <button className="w-full mt-4 bg-blue-500 p-2 rounded">Connect</button>
        </div>
      )}

      {activeTab === 'liquidity' && (
        <div className="mt-4 space-y-3">
          <p className="text-center">Liquidity Pool Coming Soon...</p>
        </div>
      )}
    </div>
  );
}
