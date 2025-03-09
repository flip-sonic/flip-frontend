import { Bolt, Twitter, Database, MessageCircle, Send } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import InviteFriends from "./Invite";
const ClaimComponent = () => {
  return (
    <div className="py-10">
      <div className="flex justify-center items-center min-h-screen bg-cover bg-center">
        <div className="bg-[#00042380] bg-opacity-50 p-6 rounded-2xl w-full max-w-xs text-white shadow-lg">
          {/* background: #00042380; */}

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button className="bg-[#A0A0FF] bg-opacity-30 text-[#A0A0FF] px-4 py-2 rounded-full font-semibold text-sm">
              Connect
            </button>
            <div className="bg-[#000423] text-[#A0A0FF] px-4 py-2 rounded-full text-sm font-medium flex gap-x-2">
              <Database size={20} className="text-[#A0A0FF]" /> $sFLIP Balance:
              -
            </div>
          </div>

          {/* Quests */}
          <h2 className="text-lg font-semibold mb-2">Quests</h2>
          <div className="space-y-2">
            {[
              { icon: <FaXTwitter size={20} />, text: "Follow" },
              { icon: <FaXTwitter size={20} />, text: "Like" },
              { icon: <FaXTwitter size={20} />, text: "Repost" },
              { icon: <Send size={20} />, text: "Join Telegram" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-[#00042380] bg-opacity-70 p-3 rounded-[15px]"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.text}</span>
                </div>

                <button className="bg-[#1B1D61] px-3 py-1 rounded-[10px] text-white text-sm">
                  Get
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
      <InviteFriends />
    </div>
  );
};

export default ClaimComponent;
