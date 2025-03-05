import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import PrelineScript from "./Components/PrelineScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        className={`${inter.className} antialiased`}
      >
        <div className="min-h-screen bg-[url('/Images/mobile_background.jpg')] sm:bg-[url('/Images/desktop_background.jpg')] bg-cover bg-center bg-no-repeat">
        <AppWalletProvider>
        <Navbar />
        {children}
        <PrelineScript />
      </body>
    </html>
  );
}
