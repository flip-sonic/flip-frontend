import React from "react";

const Header = () => {
  return (
    <div>
      {/* <!-- ========== HEADER ========== --> */}
      <header className="flex flex-wrap lg:justify-start lg:flex-nowrap z-50 w-full py-7">
        <nav className="relative max-w-full w-full flex flex-wrap lg:grid lg:grid-cols-12 basis-full items-center px-4 md:px-6 lg:px-8 mx-auto">
          <div className="lg:col-span-3 flex">
            {/* <!-- Logo --> */}
            <a
              className="flex items-center gap-2 rounded-xl text-xl font-semibold focus:outline-none focus:opacity-80"
              href="/"
              aria-label="Flip Sonic"
            >
              <img
                className="size-14 w-auto"
                src="/logo-desktop.png"
                alt="Flip"
              />
              <span className="text-sm">flip sonic</span>
            </a>

            {/* <!-- End Logo --> */}
          </div>

          {/* <!-- Button Group --> */}
          <div className="flex items-center gap-x-1 lg:gap-x-2 ms-auto py-1 lg:ps-6 lg:order-3 lg:col-span-3">
            <button
              type="button"
              className="py-2 px-6 inline-flex items-center gap-x-2 text-sm font-medium text-white bg-white/10 rounded-[40px] rounded-tr-lg rounded-br-[55px] backdrop-blur-md hover:bg-white/30 focus:outline-none focus:bg-white/30 disabled:opacity-30 disabled:pointer-events-none"
            >
              Connect Wallet
            </button>

            
          </div>
          {/* <!-- End Button Group --> */}

          {/* <!-- Collapse --> */}
          <div
            id="hs-navbar-hcail"
            className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow lg:block lg:w-auto lg:basis-auto lg:order-2 lg:col-span-6"
            aria-labelledby="hs-navbar-hcail-collapse"
          >
            <div className="flex flex-col gap-y-4 gap-x-0 mt-5 lg:flex-row lg:justify-center lg:items-center lg:gap-y-0 lg:gap-x-7 lg:mt-0">
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
