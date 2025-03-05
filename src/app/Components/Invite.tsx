import { Copy, Users } from "lucide-react";

const InviteFriends = () => {
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
      <button className="bg-[#30334a] text-white px-4 py-1 rounded-full text-sm flex items-center gap-2">
        Copy <Copy size={16} />
      </button>
    </div>
  );
};

export default InviteFriends;
