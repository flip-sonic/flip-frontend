import { X, Bolt, Twitter, Database, MessageCircle, Send } from "lucide-react";

const ClaimComponent = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center">
      <div className="bg-[#00042380] bg-opacity-50 p-6 rounded-2xl w-full max-w-sm text-white shadow-lg">
      {/* background: #00042380; */}

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button className="bg-indigo-500 px-4 py-2 rounded-full font-semibold text-white text-sm">Claim Reward</button>
          <div className="bg-[#000423] text-[#A0A0FF] px-4 py-2 rounded-full text-sm font-medium flex gap-x-2">
            <Database size={20} className="text-[#A0A0FF]"/> $sFLIP Balance: 1530 

          </div>
        </div>

        {/* Quests */}
        <h2 className="text-lg font-semibold mb-2">Quests</h2>
        <div className="space-y-2">
          {[
            { icon: <X size={20} />, text: "Follow" },
            { icon: <X size={20} />, text: "Like" },
            { icon: <X size={20} />, text: "Repost" },
            { icon: <Send size={20} />, text: "Join Telegram" },
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center bg-[#00042380] bg-opacity-70 p-3 rounded-full">
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.text}</span>
              </div>
              <button className="bg-indigo-500 px-3 py-1 rounded-full text-white text-sm">Get</button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-sm text-center text-gray-400 mt-4">
          Take your reward immediately with flip tokens after each task completion.
        </p>

        <div className="bg-[#00042380] bg-opacity-80 p-3 mt-4 rounded-full flex justify-between items-center">
          <span className="text-sm">Invite friends</span>
          <button className="bg-indigo-500 px-3 py-1 rounded-full text-white text-sm">Copy link</button>
        </div>
      </div>
    </div>
  );
};

export default ClaimComponent;
