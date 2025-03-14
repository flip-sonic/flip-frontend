import { useState } from "react";
import Image from "next/image"; // Assuming you're using Next.js

interface Token {
  value: string;
  label: string;
  image: string;
}

interface TokenDropdownProps {
  tokens: Token[];
  fromToken: string;
  setFromToken: (value: string) => void;
}

const TokenDropdown: React.FC<TokenDropdownProps> = ({ tokens, fromToken, setFromToken }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        className="w-full p-2 bg-gray-800 rounded flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {fromToken && (
            <Image
              src={tokens.find(t => t.value === fromToken)?.image || ''}
              width={20}
              height={20}
              alt="token"
            />
          )}
          <span>{tokens.find(t => t.value === fromToken)?.label || "Select Token"}</span>
        </div>
        <span>▼</span>
      </button>

      {isOpen && (
        <ul className="absolute z-1 w-full bg-gray-800 mt-1 rounded shadow-lg max-h-60 overflow-y-auto">
          {tokens.map((token) => (
            <li
              key={token.value}
              className="p-2 flex items-center gap-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                setFromToken(token.value);
                setIsOpen(false);
              }}
            >
              <Image src={token.image} width={20} height={20} alt={token.label} />
              {token.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TokenDropdown;
