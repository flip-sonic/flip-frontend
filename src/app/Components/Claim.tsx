"use client";
import { Database, Send } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import InviteFriends from "./Invite";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";


const ClaimComponent = () => {
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
    <div className="py-10">
      <div className="flex justify-center items-center min-h-screen bg-cover bg-center">
        <div className="bg-[#00042380] bg-opacity-50 p-6 rounded-2xl w-full max-w-sm text-white shadow-lg">
          {/* background: #00042380; */}

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button
              className="bg-[#A0A0FF] bg-opacity-30 text-[#A0A0FF] px-4 py-2 rounded-full font-semibold text-sm"
              onClick={() => !twitterId && signIn("twitter")}
            >
              {!twitterId ? "Connect" : "Connected"}
            </button>
            <div className="bg-[#000423] text-[#A0A0FF] px-4 py-2 rounded-full text-sm font-medium flex gap-x-2">
              <Database size={20} className="text-[#A0A0FF]" /> $sFLIP Balance: - {points}
            </div>
          </div>

          {/* Quests */}
          <h2 className="text-lg font-semibold mb-2">Quests</h2>
          <div className="space-y-2">
            {[
              { icon: <FaXTwitter size={20} />, action:"follow", text: "Follow", state: follow },
              { icon: <FaXTwitter size={20} />, action:"like", text: "Like", state: like },
              { icon: <FaXTwitter size={20} />, action:"retweet", text: "Repost", state: retweet },
              { icon: <Send size={20} />, action:"join", text: "Join Telegram", state: join },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-[#00042380] bg-opacity-70 p-3 rounded-[15px]"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.text}</span>
                </div>

                <button
                  className="bg-[#1B1D61] px-3 py-1 rounded-[10px] text-white text-sm"
                  onClick={() => handleAction(item.action)}
                  disabled={!twitterId || !!item.state}
                >
                  {item.state ? "Claimed" : "Get"}
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="text-sm text-center text-gray-400 mt-4">
            Take your reward immediately with flip tokens after each task
            completion.
          </p>
        </div>

        <div className="flex justify-center items-center min-h-screen bg-cover bg-center"></div>
      </div>
      <InviteFriends/>
    </div>
  );
};

export default ClaimComponent;
