import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Mail, ShieldPlus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const CreateTeamModal = ({ isOpen, onClose, onTeamCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState(""); // <-- New state for description
  const [memberEmails, setMemberEmails] = useState([""]);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setName("");
    setDescription(""); // <-- Reset description on close
    setMemberEmails([""]);
    setLoading(false);
    onClose();
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...memberEmails];
    newEmails[index] = value;
    setMemberEmails(newEmails);
  };

  const addEmailField = () => {
    setMemberEmails([...memberEmails, ""]);
  };

  const removeEmailField = (index) => {
    const newEmails = memberEmails.filter((_, i) => i !== index);
    setMemberEmails(newEmails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const promise = axios.post("/teams", {
      name,
      description, // <-- Pass description to the API
      memberEmails: memberEmails.filter((email) => email.trim() !== ""),
    });

    toast.promise(promise, {
      loading: "Creating team...",
      success: (res) => {
        onTeamCreated(res.data);
        handleClose();
        return "Team created successfully!";
      },
      error: (err) => err.response?.data?.message || "Failed to create team",
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
            className="bg-[#1a103d] p-8 rounded-2xl w-full max-w-lg text-white border border-pink-500/50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <ShieldPlus className="text-cyan-400" size={28} />
                <h2 className="text-2xl font-bold font-orbitron">
                  Create New Team
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
                  Team Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Project Phoenix"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 p-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                />
              </div>

              {/* --- NEW DESCRIPTION FIELD --- */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Team Description (Optional)
                </label>
                <textarea
                  placeholder="What is the purpose of this team?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 p-3 rounded-lg h-24 resize-none outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Invite Members by Email
                </label>
                <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                  {memberEmails.map((email, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Mail className="text-pink-400 flex-shrink-0" size={20} />
                      <input
                        type="email"
                        placeholder="member@example.com"
                        value={email}
                        onChange={(e) =>
                          handleEmailChange(index, e.target.value)
                        }
                        className="w-full bg-white/5 p-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                      {memberEmails.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEmailField(index)}
                          className="text-red-500 hover:text-red-400 p-1"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={addEmailField}
                className="w-full flex items-center justify-center gap-2 text-cyan-400 hover:bg-cyan-500/10 py-2 rounded-lg"
              >
                <UserPlus size={18} /> Add Another Member
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 py-3 rounded-full font-semibold text-lg hover:scale-105 transition-transform"
              >
                {loading ? "Creating..." : "Create & Send Invites"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateTeamModal;
