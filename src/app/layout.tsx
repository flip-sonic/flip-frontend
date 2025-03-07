import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PrelineScript from "./components/PrelineScript";
import AppWalletProvider from "./components/AppWalletProvider";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Flip Sonic",
  description: "Powered By Solana SVM",
  icons: {
    icon: "/logo-desktop.png", // Default favicon
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
        className={`${inter.className}  min-h-screen font-inter 
             bg-[url('/mobile-bg.jpg')] md:bg-[url('/desktop-bg.jpg')] 
             bg-cover bg-center antialiased`}
      >
         <AppWalletProvider>
          <SessionProvider>
        {children}
        <PrelineScript />
        </SessionProvider>
        </AppWalletProvider>
      </body>
    </html>
  );
}
