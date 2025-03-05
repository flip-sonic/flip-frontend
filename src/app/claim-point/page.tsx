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
  const [retweet, setRetweet] = useState('');
  const [twitterId, setTwitterId] = useState('');
  const [walletSaved, setWalletSaved] = useState(false);
  const { data: session } = useSession();

  const wallet_address = publicKey ? publicKey.toBase58() : '';

  useEffect(() => {
    if (wallet_address && !walletSaved) {

      fetch("/api/save-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wallet_address }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          setWalletSaved(true);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [wallet_address, walletSaved]);

  useEffect(() => {
    if (!wallet_address) return;
    if (session?.user?.twitterId)  {

      fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_address,
          twitterId: session.user.twitterId,
          twitterName: session.user.name,
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
            setRetweet(data.activity.filter((action: { actionType: string }) => action.actionType === "retweet").length);
            setLike(data.activity.filter((action: { actionType: string }) => action.actionType === "like").length);
        })
        .catch((error) => console.error("Error fetching points:", error));

    }, [wallet_address, setFollow, setJoin, setRetweet, setLike]);

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