import { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Pools from "./Pools";
import CreatePool from "./CreatePool";
import MyPool from "./MyPool";

interface LiquidityInterfaceProps {
  tokens: {
    mint: string;
    amount: number;
    decimals: number;
    name: string;
    picture: string;
    symbol: string;
  }[];
}

const LiquidityInterface: FC<LiquidityInterfaceProps> = ({tokens}) => {
  return (
    <div>
      <Tabs defaultValue="pools" className="">
        <TabsList className="flex gap-2 justify-start mr-auto">
          <TabsTrigger value="pools" className="px-2 py-1 rounded-[10px] font-medium text-xs transition-all data-[state=active]:bg-[#001AEF] bg-[#34359C] text-white">Pools</TabsTrigger>
          <TabsTrigger value="create" className="px-2 py-1 rounded-[10px] font-medium text-xs transition-all data-[state=active]:bg-[#001AEF] bg-[#34359C] text-white">Create</TabsTrigger>
          <TabsTrigger value="myPool" className="px-2 py-1 rounded-[10px] font-medium text-xs transition-all data-[state=active]:bg-[#001AEF] bg-[#34359C] text-white">My Pool</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <CreatePool tokens={tokens} />
        </TabsContent>
        <TabsContent value="myPool">
          <MyPool />
        </TabsContent>
        <TabsContent value="pools">
          <Pools />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiquidityInterface;
