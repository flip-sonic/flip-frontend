"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { Copy, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { config } from "dotenv";
import toast from "react-hot-toast";
config();

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const InviteFriends = () => {
  const { publicKey } = useWallet();
  const [referralId, setReferralId] = useState('');

  const wallet_address = publicKey ? publicKey.toBase58() : '';

  useEffect(() => {
    if (!wallet_address) return;
    
    fetch(`/api/get-referralId/${wallet_address}`)
      .then((res) => res.json())
        .then((data) => {
          if (!data.referralId) {
            return;
          }
          setReferralId(data.referralId);
        })
      .catch(() => toast.error("Twitter Id not found"));
  }, [wallet_address]);

  const handleCopyUrl = () => {
    if (!referralId) return;

    const referralLink = `${baseUrl}/invite/${referralId}`;

    navigator.clipboard.writeText(referralLink)
    .then(() => {
      toast.success("Referral link copied");
    })
    .catch(() => {
      toast.error("Failed to copy link");
    });
  }

  return (
    <div className="flex items-center justify-between bg-[##A0A0FF4D] px-4 py-2 rounded-[15px] border border-[#30334a] w-full max-w-sm mx-auto">
      <div className="flex items-center gap-3">
        <div className="bg-[#30334a] p-2 rounded-full">
          <Users size={18} className="text-white/80" />
        </div>
        <div className="text-center">
          <p className="text-white font-medium text-left">Invite friends</p>
          <p className="text-xs text-blue-400 text-left">
            Get more $$FLIP tokens by being active with extra tasks.
          </p>
        </div>
      </div>
      <button className="bg-[#30334a] text-white px-4 py-1 rounded-full text-sm flex items-center gap-2" onClick={handleCopyUrl}>
        Copy <Copy size={16} />
      </button>
    </div>
  );
};

export default InviteFriends;
