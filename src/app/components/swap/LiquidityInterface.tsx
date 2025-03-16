import { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Pools from "./Pools";
import CreatePool from "./CreatePool";
import MyPool from "./MyPool";

const LiquidityInterface: FC = ({}) => {
  return (
    <div className="w-full rounded-[10px] bg-primary/10">
      <Tabs defaultValue="pools" className="">
        <TabsList className="flex items-center gap-[10px] justify-start">
          <TabsTrigger value="pools">Pools</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="myPool">My Pool</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <CreatePool />
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
