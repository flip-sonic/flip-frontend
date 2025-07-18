import { Copy, Users } from "lucide-react";
import { config } from "dotenv";
import toast from "react-hot-toast";

config();

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const InviteFriends = ({ referralId }: { referralId: string }) => {

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
  // p-4 flex items-center justify-center mx-auto
  return (
    <div className="flex items-center justify-between bg-[#00042380] bg-opacity-50 p-4 rounded-[15px] border border-[#30334a] w-full max-w-sm mx-auto">
      <div className="flex items-center gap-3">
        <div className="bg-[#A0A0FF4D] p-2 rounded-full">
          <Users size={18} className="text-white/80" />
        </div>
        <div className="text-center">
          <p className="text-white font-medium text-left">Invite friends</p>
          <p className="text-gray-400 text-left text-[0.60rem]">
            Get more $sFLIP tokens by being active with extra tasks.
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