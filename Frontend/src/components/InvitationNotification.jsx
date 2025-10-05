import React from "react";
import { motion } from "framer-motion";
import { Bell, Check, X } from "lucide-react";

const InvitationNotification = ({ invitation, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-8 right-8 z-50 bg-[#1a103d] p-5 rounded-2xl shadow-2xl w-full max-w-sm text-white border border-cyan-500/50"
    >
      <div className="flex items-start gap-4">
        <div className="bg-cyan-500/20 p-2 rounded-full">
          <Bell className="text-cyan-400" size={24} />
        </div>
        <div>
          <h3 className="font-bold">Team Invitation</h3>
          <p className="text-sm text-gray-300 mt-1">
            <span className="font-semibold text-white">
              {invitation.leaderName}
            </span>{" "}
            invited you to join the team "{invitation.teamName}".
          </p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-1"
            >
              <Check size={16} /> Accept
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-1"
            >
              <X size={16} /> Decline
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InvitationNotification;
