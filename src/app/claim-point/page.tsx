"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Database } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import SignIn from "../components/SignIn";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

export default function ClaimPoint() {
  const { publicKey } = useWallet();
  const [points, setPoints] = useState(0);
  const [follow, setFollow] = useState('');
  const [join, setJoin] = useState('');
  const [like, setLike] = useState('');
  const [repost, setRepost] = useState('');

   useEffect(() => {
        if (!publicKey) return;

        const wallet_address = publicKey.toBase58();

        fetch(`/api/get-points/${wallet_address}`)
        .then((res) => res.json())
        .then((data) => {
            setPoints(data.points || 0);
        })
        .catch((error) => console.error("Error fetching points:", error));
    }, [publicKey]);

    useEffect(() => {
      if (!publicKey) return;

        const wallet_address = publicKey.toBase58();

        fetch(`/api/get-actions/${wallet_address}`)
        .then((res) => res.json())
        .then((data) => {
           if (!data.activity) {
                console.error("Invalid API response:", data);
                return;
            }

            setFollow(data.activity.filter((action: { actionType: string }) => action.actionType === "follow").length);
            setJoin(data.activity.filter((action: { actionType: string }) => action.actionType === "join").length);
            setRepost(data.activity.filter((action: { actionType: string }) => action.actionType === "repost").length);
            setLike(data.activity.filter((action: { actionType: string }) => action.actionType === "like").length);
        })
        .catch((error) => console.error("Error fetching points:", error));

    }, [publicKey, setFollow, setJoin, setRepost, setLike]);

  const handleFollow = async () => {
    if (!publicKey) return;

    window.open("https://x.com/flipsonic", "_blank");
    alert("Follow the account to earn rewards!");

    try {
        const wallet_address = publicKey.toBase58();

        const response = await fetch("/api/follow-action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ wallet_address }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to record action.");
        }

        console.log("Follow action recorded successfully:", data);
    } catch (error) {
        console.error("Error recording follow action:", error);
    }
};


  const handleLike = () => {
    window.open("https://x.com/flipsonic/status/1891841157904072828", "_blank");
    alert("Like the post to earn rewards!");
  };

  const handleRepost = () => {
    window.open("https://x.com/flipsonic/status/1891841157904072828", "_blank");
    alert("Repost this tweet to earn rewards!");
  };

  const handleJoinTelegram = () => {
    window.open("https://t.me/flipsonic", "_blank");
    alert("Join our Telegram to earn rewards!");
  };

  return (
    <div className="flex justify-center bg-transparent flex-col items-center min-h-screen p-4">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-lg bg-opacity-90">
        <div className="flex flex-row justify-between items-center mb-4 border-b pb-2">
          <SignIn />
          <p className="flex items-center gap-2">
            <Database /> $sFLIP Balance: - {points}
          </p>
        </div>
        <h1 className="text-center text-xl font-bold mb-4">Quest</h1>

        {/* Follow Button */}
        <div className="flex flex-row justify-between items-center p-3 border rounded-lg mb-2 bg-opacity-80">
          <div className="flex flex-row items-center gap-2">
            <FaXTwitter />
            <p>Follow</p>
          </div>
          {follow ? (
              <Button className="px-4 py-2" disabled>Claimed</Button>  
            ) : (
              <Button className="px-4 py-2" onClick={handleFollow}>Follow</Button>  
            )}
        </div>

        {/* Like Button */}
        <div className="flex flex-row justify-between items-center p-3 border rounded-lg mb-2 bg-opacity-80">
          <div className="flex flex-row items-center gap-2">
            <FaXTwitter />
            <p>Like</p>
          </div>
          {like ? <Button className="px-4 py-2" disabled>Claimed</Button> :
          <Button className="px-6 py-2" onClick={handleLike}>Like</Button> }
        </div>

        {/* Repost Button */}
        <div className="flex flex-row justify-between items-center p-3 border rounded-lg mb-2 bg-opacity-80">
          <div className="flex flex-row items-center gap-2">
            <FaXTwitter />
            <p>Repost</p>
          </div>
          {repost ? <Button className="px-4 py-2" disabled>Claimed</Button> :
          <Button className="px-4 py-2" onClick={handleRepost}>Repost</Button> }
        </div>

        {/* Join Telegram Button */}
        <div className="flex flex-row justify-between items-center p-3 border rounded-lg mb-2 bg-opacity-80">
          <div className="flex flex-row items-center gap-2">
            <FaXTwitter />
            <p>Join Telegram</p>
          </div>
          {join ? <Button className="px-4 py-2" disabled>Claimed</Button> :
          <Button className="px-6 py-2" onClick={handleJoinTelegram}>Join</Button>}
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Take your reward immediately with flip tokens after each task completion.
        </p>
      </Card>
    </div>
  );
}
