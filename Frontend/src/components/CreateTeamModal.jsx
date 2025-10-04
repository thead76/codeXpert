import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Users } from "lucide-react";
import axios from "axios";

const CreateTeamModal = ({ isOpen, onClose, onTeamCreated }) => {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/teams", { name: teamName });
      onTeamCreated(data); // Pass the new team data back to the dashboard
      setTeamName("");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create team.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="bg-[#1a103d] p-8 rounded-2xl shadow-2xl w-full max-w-md text-white relative border border-pink-500/50"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X size={24} />
          </button>
          <h2 className="text-3xl font-bold mb-6 text-center font-orbitron">
            Create a New Team
          </h2>
          {error && <p className="text-center text-red-400 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 bg-[#2a1f52] px-4 py-3 rounded-lg">
              <Users className="text-pink-400" size={20} />
              <input
                type="text"
                placeholder="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="bg-transparent outline-none flex-1"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 py-3 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Team"}
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default CreateTeamModal;
