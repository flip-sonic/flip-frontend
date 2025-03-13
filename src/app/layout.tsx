import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PrelineScript from "./components/PrelineScript";
import { SessionProvider } from "next-auth/react";
import { NetworkProvider } from "@/contexts/NetworkContext";
import { WalletProvider } from "@/components/WalletProvider";
import { ToastProvider } from "@/components/ToastProvider";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Flip Sonic",
  description: "Powered By Solana SVM",
  icons: {
    icon: "/logo-desktop.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-[60vh] md:min-h-screen font-inter 
                    bg-[url('/mobile-bg.jpg')] md:bg-[url('/desktop-bg.jpg')] 
                    bg-cover md:bg-fixed`}
      >
        <NetworkProvider>
          <WalletProvider>
            <SessionProvider>
            <ToastProvider />
              {/* <NetworkToggle /> */}
              {/* <WalletButton /> */}
              {children}
              <PrelineScript />
              </SessionProvider>
          </WalletProvider>
        </NetworkProvider>
      </body>
    </html>
  );
}
