import { StaticImageData } from "next/image";

export interface Token {
  symbol: string;
  name: string;
  icon: StaticImageData;
  priceChange: number;
  totalSupply: number;
  holders: number;
  userBalance: number;
  currentPrice: number;
}

export interface TradingPair {
  id: string;
  baseToken: string;
  quoteToken: string;
  volume: number;
  priceChange: number;
}

export interface PaginatedPairs {
  pairs: TradingPair[];
  currentPage: number;
  totalPages: number;
}

export interface FeeTier {
  value: string;
  label: string;
}

export interface TradingPair {
  id: string;
  baseToken: string;
  quoteToken: string;
  volume: number;
  isLocked: boolean;
}
