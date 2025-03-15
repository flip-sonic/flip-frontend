import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatMoney = (amount: number): string => {
  if (amount < 1000) return amount.toString();
  const units = ['K', 'M', 'B', 'T'];
  const index = Math.floor(Math.log10(amount) / 3) - 1;
  const formattedAmount = (amount / Math.pow(1000, index + 1)).toFixed(0);
  return `${formattedAmount}${units[index]}`;
}

export function formatNum(num: number): string {
  if (num < 1000) {
    return `${num}`;
  } else if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(1)}B`;
  } else if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(1)}M`;
  } else if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(num % 1 === 0 ? 0 : 1)}K`;
  }
  return "$0";
}
