"use client";
import { WalletButton } from "@/components/WalletButton";
import Image from "next/image";
// import { connect } from "http2";
import Link from "next/link";
import React from "react";
import { BsFillLightningFill } from "react-icons/bs";

const Header = () => {

  return (
    <div>
      {/* <!-- ========== HEADER ========== --> */}
      <header className="flex flex-wrap lg:justify-start lg:flex-nowrap z-50 w-full py-2">
        <nav className="relative max-w-full w-full flex flex-wrap lg:grid lg:grid-cols-12 basis-full items-center px-4 md:px-6 lg:px-8 mx-auto">
          <div className="lg:col-span-3 flex">
            {/* <!-- Logo --> */}
            <Link
              className="flex items-center gap-2 rounded-xl text-xl font-semibold focus:outline-none focus:opacity-80"
              href="/"
              aria-label="Flip Sonic" >
              {/* <img
                className="size-14 w-auto"
                src="/logo-desktop.png"
                alt="Flip"
              /> */}
              <Image src="/logo-desktop.png" alt="Flip" width={56} height={56} className="w-auto" priority />
              <span className="text-sm text-white">flip sonic</span>
            </Link>

            {/* <!-- End Logo --> */}
          </div>

          {/* <!-- Button Group --> */}
          <div className="flex items-center gap-x-1 lg:gap-x-2 ms-auto py-1 lg:ps-6 lg:order-3 lg:col-span-3">
            <WalletButton />
          </div>
          {/* <!-- End Button Group --> */}

          {/* <!-- Collapse --> */}
          <div
            id="hs-navbar-hcail"
            className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow lg:block lg:w-auto lg:basis-auto lg:order-2 lg:col-span-6"
            aria-labelledby="hs-navbar-hcail-collapse"
          >
            <div className="flex text-xl text-white flex-col gap-y-4 gap-x-0 mt-5 lg:flex-row lg:justify-center lg:items-center lg:gap-y-0 lg:gap-x-4 lg:mt-0">
              {/* Something goes here */}
              <BsFillLightningFill className="text-[#EFAA22] text-xl" />
              The ultimate high speed swap
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
