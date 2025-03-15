"use client";

import { FC } from "react";
import SwapInterface from "./SwapInterface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Image from "next/image";
import { FlipIcon } from "@/assets";
import LiquidityInterface from "./LiquidityInterface";
import { Button } from "../ui/Button";

const Hero: FC = ({}) => {
  return (
    <div className="w-full flex items-center justify-center">
      {/* <SwapInterface /> */}

      <Tabs defaultValue="swap" className="">
        <TabsList className="">
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
    </div>
  );
};

export default Hero;
