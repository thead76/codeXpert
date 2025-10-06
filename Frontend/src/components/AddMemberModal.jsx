import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const AddMemberModal = ({ isOpen, onClose, teamId, onMemberAdded }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setEmail("");
    setLoading(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const promise = axios.post(`/teams/${teamId}/invite`, { email });

    toast.promise(promise, {
      loading: "Sending invitation...",
      success: (res) => {
        onMemberAdded();
        handleClose();
        return res.data.message || "Invitation sent!";
      },
      error: (err) =>
        err.response?.data?.message || "Failed to send invitation",
    });
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#1a103d] p-8 rounded-2xl w-full max-w-md text-white border border-green-500/50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <UserPlus className="text-green-400" size={28} />
                <h2 className="text-2xl font-bold font-orbitron">
                  Invite New Member
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Member's Email
                </label>
                <input
                  type="email"
                  placeholder="member@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 p-3 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 py-3 rounded-full font-semibold text-lg hover:scale-105 transition-transform"
              >
                {loading ? "Sending..." : "Send Invitation"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddMemberModal;
