import { JupLogo, SolanaLogo } from "@/assets";
import { TradingPair } from "@/types";

export const tokens = [
    {
        symbol: "SOL",
        name: "Solana",
        icon: SolanaLogo,
        priceChange: -7,
        totalSupply: 100000000000,
        holders: 1800000,
        userBalance: 10052,
        currentPrice: 130,
    },
    {
        symbol: "JUP",
        name: "Jupiter",
        icon: JupLogo,
        priceChange: 999999,
        totalSupply: 100000000,
        holders: 800000,
        userBalance: 10052,
        currentPrice: 0.56,
    },
]



export const tradingPairs = [
    {
        id: "1",
        baseToken: "USDC",
        quoteToken: "USDT",
        volume: 152850586,
        priceChange: 0.5,
    },
    {
        id: "2",
        baseToken: "HFT",
        quoteToken: "USDT",
        volume: 822586,
        priceChange: -1.2,
    },
    {
        id: "3",
        baseToken: "SAT",
        quoteToken: "USDC",
        volume: 522586,
        priceChange: 2.1,
    },
    {
        id: "4",
        baseToken: "BOSS",
        quoteToken: "USDC",
        volume: 800522586,
        priceChange: 0.8,
    },
    {
        id: "5",
        baseToken: "WEN",
        quoteToken: "USDC",
        volume: 400586,
        priceChange: -0.3,
    },
    {
        id: "6",
        baseToken: "WEN",
        quoteToken: "USDC",
        volume: 400586,
        priceChange: 1.5,
    },
    {
        id: "7",
        baseToken: "BOSS",
        quoteToken: "USDC",
        volume: 800522586,
        priceChange: -0.7,
    },
    {
        id: "8",
        baseToken: "WEN",
        quoteToken: "USDC",
        volume: 400586,
        priceChange: 0.9,
    },
    {
        id: "9",
        baseToken: "BOSS",
        quoteToken: "USDC",
        volume: 800522586,
        priceChange: 1.1,
    },
    {
        id: "10",
        baseToken: "WEN",
        quoteToken: "USDC",
        volume: 400586,
        priceChange: -0.4,
    },
]



export const poolTokens = [
    {
        id: "1",
        symbol: "SOL",
        name: "Solana",
        icon: SolanaLogo,
        balance: 1.5,
    },
    {
        id: "2",
        symbol: "USDC",
        name: "USD Coin",
        icon: JupLogo,
        balance: 1500.0,
    },
    {
        id: "3",
        symbol: "USDT",
        name: "Tether",
        icon: SolanaLogo,
        balance: 1500.0,
    },
    {
        id: "4",
        symbol: "JUP",
        name: "Jupiter",
        icon: JupLogo,
        balance: 1500.0,
    },
]

export const feeTiers = [
    { id: "0.25", percentage: 0.25 },
    { id: "0.3", percentage: 0.3 },
    { id: "1", percentage: 1 },
    { id: "2", percentage: 2 },
    { id: "4", percentage: 4 },
]

export const myPools = [
    {
        id: "1",
        baseToken: "USDC",
        quoteToken: "USDT",
        volume: 152850586,
        isLocked: false,
    },
    {
        id: "2",
        baseToken: "HFT",
        quoteToken: "USDT",
        volume: 822586,
        isLocked: false,
    },
    {
        id: "3",
        baseToken: "SAT",
        quoteToken: "USDC",
        volume: 522586,
        isLocked: true,
    },
    {
        id: "4",
        baseToken: "BOSS",
        quoteToken: "USDC",
        volume: 800522586,
        isLocked: false,
    },
    {
        id: "5",
        baseToken: "WEN",
        quoteToken: "USDC",
        volume: 400586,
        isLocked: true,
    },
]

