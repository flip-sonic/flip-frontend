"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Database } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import SignIn from "../components/SignIn";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";


export default function ClaimPoint() {
  const { publicKey } = useWallet();
  const [points, setPoints] = useState(0);
  const [follow, setFollow] = useState('');
  const [join, setJoin] = useState('');
  const [like, setLike] = useState('');
  const [repost, setRepost] = useState('');
  const [twitterId, setTwitterId] = useState('');
  const { data: session } = useSession();

  const wallet_address = publicKey ? publicKey.toBase58() : '';

  useEffect(() => {
    if (!wallet_address) return;
    if (session?.user?.twitterId)  {

      fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_address,
          twitterId: session.user.twitterId,
          twitterUsername: session.user.twitterUsername,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to save Twitter ID");
          }
          alert("Twitter ID saved");
        })
        .catch((err) => {
          console.error(err);
        })
    }
  }, [session, wallet_address]);

  useEffect(() => {
    if (!wallet_address) return;

    fetch(`/api/get-twitterid/${wallet_address}`)
        .then((res) => res.json())
        .then((data) => {
           if (!data.twitterId) {
                console.error("Invalid API response:", data);
                return;
            }
            setTwitterId(data.twitterId);
        })
      .catch((error) => console.error("Error fetching twitterId:", error));
    }, [wallet_address]);

   useEffect(() => {
        if (!wallet_address) return;

        fetch(`/api/get-points/${wallet_address}`)
        .then((res) => res.json())
        .then((data) => {
            setPoints(data.points || 0);
        })
        .catch((error) => console.error("Error fetching points:", error));
    }, [wallet_address]);

    useEffect(() => {
      if (!wallet_address) return;

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

    }, [wallet_address, setFollow, setJoin, setRepost, setLike]);

  const handleAction = async (actionType: string) => {
  if (!publicKey) {
    alert("Please connect your wallet first.");
    return;
  }

  const actionUrls: { [key: string]: string } = {
    follow: "https://x.com/flipsonic",
    join: "https://t.me/yesosss",
    like: "https://x.com/flipsonic/status/1891841157904072828",
    retweet: "https://x.com/flipsonic/status/1891841157904072828"
  };

  const twitterUrl = actionUrls[actionType] || actionUrls["like"];

  // Open the social media link
  window.open(twitterUrl, "_blank");
  alert(`Perform the ${actionType} action and return to claim rewards!`);

  try {
    const wallet_address = publicKey.toBase58();

    const response = await fetch("/api/action-performed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ wallet_address, actionType })
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
    } else {
      alert(`Failed: ${data.message}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Server error, try again later.");
  }
};
  return (
    <div className="flex justify-center bg-transparent flex-col items-center min-h-screen p-4">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-lg bg-opacity-90">
        {/* Show Twitter ID for debugging */}
        {twitterId ? <p>Twitter ID: {twitterId}</p> : null}

        <div className="flex flex-row justify-between items-center mb-4 border-b pb-2">
          {!twitterId && <SignIn />} {/* Show SignIn button if twitterId does not exist */}
          <p className="flex items-center gap-2">
            <Database /> $sFLIP Balance: - {points}
          </p>
        </div>

        <h1 className="text-center text-xl font-bold mb-4">Quest</h1>

        {/* Buttons are disabled if Twitter ID is missing */}
        <div className="flex flex-row justify-between items-center p-3 border rounded-lg mb-2 bg-opacity-80">
          <div className="flex flex-row items-center gap-2">
            <FaXTwitter />
            <p>Follow</p>
          </div>
          <Button className="px-4 py-2" onClick={() => handleAction("follow")} disabled={!twitterId || !!follow}>
            {follow ? "Claimed" : "Follow"}
          </Button>
        </div>

        <div className="flex flex-row justify-between items-center p-3 border rounded-lg mb-2 bg-opacity-80">
          <div className="flex flex-row items-center gap-2">
            <FaXTwitter />
            <p>Like</p>
          </div>
          <Button className="px-6 py-2" onClick={() => handleAction("like")} disabled={!twitterId || !!like}>
            {like ? "Claimed" : "Like"}
          </Button>
        </div>

        <div className="flex flex-row justify-between items-center p-3 border rounded-lg mb-2 bg-opacity-80">
          <div className="flex flex-row items-center gap-2">
            <FaXTwitter />
            <p>Repost</p>
          </div>
          <Button className="px-4 py-2" onClick={() => handleAction("repost")} disabled={!twitterId || !!repost}>
            {repost ? "Claimed" : "Repost"}
          </Button>
        </div>

        <div className="flex flex-row justify-between items-center p-3 border rounded-lg mb-2 bg-opacity-80">
          <div className="flex flex-row items-center gap-2">
            <FaXTwitter />
            <p>Join Telegram</p>
          </div>
          <Button className="px-6 py-2" onClick={() => handleAction("join")} disabled={!twitterId || !!join}>
            {join ? "Claimed" : "Join"}
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Take your reward immediately with flip tokens after each task completion.
        </p>
      </Card>
    </div>
  );
}
