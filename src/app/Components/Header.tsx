"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
// import { connect } from "http2";
import Link from "next/link";
import React from "react";

const Header = () => {
  const { publicKey } = useWallet();

  return (
    <div>
      {/* <!-- ========== HEADER ========== --> */}
      <header className="flex flex-wrap lg:justify-start lg:flex-nowrap z-50 w-full py-7">
        <nav className="relative max-w-full w-full flex flex-wrap lg:grid lg:grid-cols-12 basis-full items-center px-4 md:px-6 lg:px-8 mx-auto">
          <div className="lg:col-span-3 flex">
            {/* <!-- Logo --> */}
            <Link className="flex items-center gap-2 rounded-xl text-xl font-semibold focus:outline-none focus:opacity-80"
              href="/"
              aria-label="Flip Sonic" >
              <img
                className="size-14 w-auto"
                src="/logo-desktop.png"
                alt="Flip"
              />
              <span className="text-sm">flip sonic</span>
            </Link>

            {/* <!-- End Logo --> */}
          </div>

          {/* <!-- Button Group --> */}
          <div className="flex items-center gap-x-1 lg:gap-x-2 ms-auto py-1 lg:ps-6 lg:order-3 lg:col-span-3">
            <WalletMultiButton
                style={{
                      padding: '0.5rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: '600', color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '40px', borderTopRightRadius: '40px',borderBottomRightRadius: '64px', backdropFilter: 'blur(12px)'}}>
                        {!publicKey ? "Connect Wallet" : ""}
                      </WalletMultiButton>
          </div>
          {/* <!-- End Button Group --> */}

          {/* <!-- Collapse --> */}
          <div
            id="hs-navbar-hcail"
            className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow lg:block lg:w-auto lg:basis-auto lg:order-2 lg:col-span-6"
            aria-labelledby="hs-navbar-hcail-collapse"
          >
            <div className="flex text-xl flex-col gap-y-4 gap-x-0 mt-5 lg:flex-row lg:justify-center lg:items-center lg:gap-y-0 lg:gap-x-7 lg:mt-0">
              {/* Something goes here */}
              ⚡The ultimate high speed swap
            </div>
          </div>
          {/* <!-- End Collapse --> */}
        </nav>
      </header>
      {/* <!-- ========== END HEADER ========== --> */}
    </div>
  );
};

export default Header;
