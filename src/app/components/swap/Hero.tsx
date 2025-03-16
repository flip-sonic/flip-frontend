"use client";

import { FC } from "react";
import SwapInterface from "./SwapInterface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Image from "next/image";
import { FlipIcon, SonicIcon } from "@/assets";
import LiquidityInterface from "./LiquidityInterface";
import { Button } from "@/components/ui/button";

const Hero: FC = ({}) => {
  return (
    <section className="pt-[50px]">
      <div className="container max-w-[441px] mx-auto w-full">
        <div className="flex flex-col gap-6">
          <Tabs defaultValue="swap" className="">
            <TabsList className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TabsTrigger value="swap">Swap</TabsTrigger>
                <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
              </div>
              <Button>
                <div className="flex items-center gap-1">
                  <Image src={FlipIcon} alt="" />
                  Flip
                </div>
              </Button>
            </TabsList>
            <TabsContent value="swap">
              <SwapInterface />
            </TabsContent>
            <TabsContent value="liquidity">
              <LiquidityInterface />
            </TabsContent>
          </Tabs>
          <div className="flex items-center justify-center gap-1">
            <span className="text-[15px] leading-[100%] tracking-[0%] font-bold">Powered by SonicSVM</span>
            <Image src={SonicIcon} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
