import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Database } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import SignIn from "../components/SignIn";


export default function ClaimPoint() {
    return (
        <div className="flex justify-center bg-transparent flex-col items-center min-h-screen p-4">
            <Card className="w-full max-w-md p-6 shadow-lg rounded-lg bg-opacity-90">
                <div className="flex flex-row justify-between items-center mb-4 border-b pb-2">
                    {/* <a href="#" className="text-blue-500">
                        Connect
                    </a> */}
                    <SignIn />
                    <p className="flex items-center gap-2">
                        <Database /> $sFLIP Balance: -
                    </p>
                </div>
                <h1 className="text-center text-xl font-bold mb-4">Quest</h1>
                {["Follow", "Like", "Repost", "Join Telegram"].map((task, index) => (
                    <div key={index} className="flex flex-row justify-between items-center p-3 border rounded-lg mb-2 bg-opacity-80">
                        <div className="flex flex-row items-center gap-2">
                            <FaXTwitter />
                            <p>{task}</p>
                        </div>
                        <a href="#">
                            <Button>Get</Button>
                        </a>
                    </div>
                ))}
                <p className="text-center text-sm text-gray-600 mt-4">
                    Take your reward immediately with flip tokens after each task completion.
                </p>
            </Card>
        </div>
    );
}