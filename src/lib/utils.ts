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
    return `$${Math.floor(num / 1_000_000_000)}B`;
  } else if (num >= 1_000_000) {
    return `$${Math.floor(num / 1_000_000)}M`;
  } else if (num >= 1_000) {
    return `$${Math.floor(num / 1_000)}K`;
  }
  return "$0";
}

export const formatVolume = (volume: number) => {
  const formattedVolume = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(volume);

  return formattedVolume
};

// export const numberHandler = (value: number) => {
//   // Return 1000000 to 1M
//   if (value >= 1e12) {
//       return (value / 1e12).toFixed(2) + "T";
//   } else
//   if (value >= 1e9) {
//       return (value / 1e9).toFixed(2) + "B";
//   } else
//   if (value >= 1e6) {
//       return (value / 1e6).toFixed(2) + "M";
//   } else if (value >= 1e3) {
//       return (value / 1e3).toFixed(2) + "K";
//   }
//   return (value).toFixed(2);
// }

export const numberHandler = (value: unknown) => {
    // Convert to number if it's a string
    const num = typeof value === "number" ? value : Number(value);

    // Handle invalid numbers
    if (isNaN(num) || value === null || value === undefined) {
        return "Invalid number";
    }

    // Return formatted number
    if (num >= 1e12) {
        return (num / 1e12).toFixed(2) + "T";
    } else if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + "B";
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + "M";
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(2) + "K";
    }

    return num.toFixed(2); // Default case
};
