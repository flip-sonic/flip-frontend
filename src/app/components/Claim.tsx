"use client";
import { Database, Send } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import InviteFriends from "./Invite";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { config } from "dotenv";
import { calculateTimeLeft, formatTime } from "./TimeHelper";
import toast from "react-hot-toast";

config();

const ClaimComponent = () => {
  const { publicKey } = useWallet();
    const [points, setPoints] = useState(0);
    const [follow, setFollow] = useState(false);
    const [join, setJoin] = useState(false);
    const [like, setLike] = useState(false);
    const [retweet, setRetweet] = useState(false);
    const [referer, setReferer] = useState('');
    const [twitterId, setTwitterId] = useState('');
    const [userId, setUserId] = useState('');
    const [walletSaved, setWalletSaved] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [stopTime, setStopTime] = useState<Date | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
  
    const wallet_address = publicKey ? publicKey.toBase58() : '';

    useEffect(() => {
      if (!wallet_address) {
        setPoints(0);
        setTwitterId('');
        setTimeLeft(0);
        setFollow(false);
        setLike(false);
        setJoin(false);
        setRetweet(false);
        setReferer('');
        setUserId('');
      }
    }, [wallet_address]);
  
    useEffect(() => {
      const referralId = localStorage.getItem("referralId");

      if (wallet_address && !walletSaved) {
  
        fetch("/api/save-wallet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ wallet_address, referred_by: referralId || null, }),
        })
          .then((response) => response.json())
          .then((data) => {
            toast.success(data.message);
            setPoints(data.userData.points);
            setReferer(data.userData.referralId);
            setTwitterId(data.userData.twitterId);
            setUserId(data.userData.id);
            setStartTime(data.startTime);
            setStopTime(data.stopTime);
            setWalletSaved(true);
            setTimeLeft(calculateTimeLeft(data.startTime, data.stopTime));
            localStorage.removeItem("referralId");
          })
          .catch((error) => toast.error("Error:", error));
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
          toast.error("Twitter used by another account or you didnt approve");
          return;
        }
        return response.json();
      })
      .then((data) => {
        toast.success(data.message);
        setTwitterId(data.twitterID);
      })
      .catch(() => {
          toast.error("Connect Twitter Again");
          return;
        })
      }
    }, [session, wallet_address]);

    useEffect(() => {
      if (!wallet_address) return;
      // if (!twitterId) return ;
      if (!userId) return;
  
      fetch(`/api/get-nextpoint/${userId}`)
          .then((res) => res.json())
          .then((data) => {
             if (!data) {
                  return;
              }
              setStartTime(data.startTime);
              setStopTime(data.stopTime);
              setTimeLeft(calculateTimeLeft(data.startTime, data.stopTime));
          })
        .catch(() => toast.error("Error fetching next claim time"));
      }, [wallet_address, userId, twitterId]);

      useEffect(() => {
        if (!startTime || !stopTime) return;

        const timer = setInterval(() => {
          const updatedTimeLeft: number = calculateTimeLeft(startTime, stopTime);
          
          if (updatedTimeLeft <= 0) {
            clearInterval(timer);
            setTimeLeft(0); 
          } else {
            setTimeLeft(updatedTimeLeft);
          }
        }, 1000);

        return () => clearInterval(timer);
      }, [startTime, stopTime]);
  
    ;
  
      useEffect(() => {
        if (!wallet_address) return;
        if (!userId) return;
  
          fetch(`/api/get-actions/${userId}`)
          .then((res) => res.json())
          .then((data) => {
             if (!data.activity) {
                  return;
              }
              setFollow(data.activity.some((action: { actionType: string }) => action.actionType === "follow"));
              setJoin(data.activity.some((action: { actionType: string }) => action.actionType === "join"));
              setRetweet(data.activity.some((action: { actionType: string }) => action.actionType === "retweet"));
              setLike(data.activity.some((action: { actionType: string }) => action.actionType === "like"));
          })
          .catch(() => toast.error("Error fetching points refresh"));
  
      }, [wallet_address, userId, setFollow, setJoin, setRetweet, setLike, twitterId]);

    const handleAction = async (actionType: "follow" | "join" | "like" | "retweet") => {
      if (!publicKey) {
        toast.error("Please connect your wallet first.");
        return;
      }
      
      const actionUrls = {
        follow: process.env.NEXT_PUBLIC_URL_FOLLOW,
        join: process.env.NEXT_PUBLIC_URL_JOIN,
        like: process.env.NEXT_PUBLIC_URL_LIKE,
        retweet: process.env.NEXT_PUBLIC_URL_RETWEET,
      };
      
      const twitterUrl = actionUrls[actionType] || actionUrls["like"];
      
      // Open the social media link
      if (typeof window !== "undefined") {
        window.open(twitterUrl, "_blank");
        toast.success(`Perform the ${actionType} action and return to claim rewards!`);
      }
      
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
          toast.success(data.message);
          setPoints(data.newPoints);
          
          switch (data.actionType) {
            case "follow":
              setFollow(true);
          break;
        case "join":
          setJoin(true);
          break;
        case "like":
          setLike(true);
          break;
        case "retweet":
          setRetweet(true);
          break;
        default:
          toast.error("Unknown action type:", data.actionType);
      }
    } else {
      toast.error(`Failed: ${data.message}`);
    }
  } catch {
    toast.error("Server error, try again later.");
  }
};

const handleGetReward = async () => {
  if (!wallet_address) {
    toast.error("Please connect your wallet first.");
    return;
  }

  try {
    // loading state here
    setLoading(true);

    const response = await fetch("/api/claim-point", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ wallet_address })
    });

    const data = await response.json();

    if (response.ok) {
      toast.success(data.message);
      setPoints(data.points);
      setStartTime(data.startTime);
      setStopTime(data.stopTime);
      setTimeLeft(calculateTimeLeft(data.startTime, data.stopTime));
    } else {
      toast.error(data.message || "Failed to claim reward. Please try again.");
    }
  } catch {
    toast.error("An unexpected error occurred. Please try again later.");
  } finally {
    setLoading(false);
  }
};


return (
    <div className="py-10">
      <div className="p-4 flex items-center justify-center mx-auto">

        <div className="bg-[#00042380] bg-opacity-50 p-6 rounded-2xl w-full max-w-sm text-white shadow-lg">
          {/* background: #00042380; */}

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button
              className="bg-[#A0A0FF] bg-opacity-30 text-[#A0A0FF] px-4 py-2 rounded-full font-semibold text-sm"
              onClick={() => publicKey && !twitterId && signIn("twitter")}
            >
              {!twitterId ? ( "Connect X") : timeLeft > 0 ? (
                formatTime(timeLeft)
              ) : (
              <span onClick={() => handleGetReward()} className="cursor-pointer">{loading ? "wait" : "Claim Reward"}</span>
              )}
            </button>
            <div className="bg-[#000423] text-[#A0A0FF] px-4 py-2 rounded-full text-sm font-medium flex gap-x-2">
              <Database size={20} className="text-[#A0A0FF]" /> $sFLIP Balance: - {points}
            </div>
          </div>

          {/* Quests */}
          <h2 className="text-lg font-semibold mb-2">Quests</h2>
          <div className="space-y-2">
            {[
              { icon: <FaXTwitter size={20} />, action: "follow" as const, text: "Follow", state: follow },
              { icon: <FaXTwitter size={20} />, action: "like" as const, text: "Like", state: like },
              { icon: <FaXTwitter size={20} />, action: "retweet" as const, text: "Repost", state: retweet },
              { icon: <Send size={20} />, action: "join" as const, text: "Join Telegram", state: join },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-[#00042380] bg-opacity-70 p-3 rounded-[15px]"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
{/* bg-[#A0A0FF] bg-opacity-30 text-[#A0A0FF] px-4 py-2 rounded-full font-semibold text-sm */}
                <button
                  className={`w-[100px] px-3 py-1 rounded-[10px] text-sm text-center 
                    ${!publicKey
                      ? "bg-gray-500 text-gray-300 opacity-50 cursor-not-allowed"
                      : !twitterId
                      ? "bg-[#6464ff] text-white opacity-50 cursor-not-allowed"
                      : item.state
                      ? "bg-gray-500 text-gray-300 opacity-50 cursor-not-allowed"
                      : "bg-[#6464ff] text-white"}`}
                      onClick={() => item.state || !twitterId ? null : handleAction(item.action)}
                      disabled={!publicKey || !twitterId || !!item.state}
                >
                  {item.state 
                  ? <span>👍 Done</span> 
                  : publicKey && twitterId 
                  ? <span>Claim</span> 
                  : <span>Get</span>
                  }
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

      </div>
      <InviteFriends referralId={referer} />
      {/* <div className="mb-[100px]"><br /></div> */}
    </div>
  );
};

export default ClaimComponent;