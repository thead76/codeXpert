import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Megaphone } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import CustomDropdown from "./CustomDropdown";

const PostNoticeModal = ({ isOpen, onClose, onNoticePosted }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [teamId, setTeamId] = useState("");
  const [leaderTeams, setLeaderTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  // Leader ki teams ko fetch karein dropdown ke liye
  useEffect(() => {
    if (isOpen && user.role === "leader") {
      const fetchLeaderTeams = async () => {
        try {
          const { data } = await axios.get("/teams");
          // Sirf woh teams jinke aap leader hain
          const teams = data.filter((team) => team.leader._id === user._id);
          setLeaderTeams(teams.map((t) => ({ value: t._id, label: t.name })));
        } catch (error) {
          toast.error("Could not fetch your teams.");
        }
      };
      fetchLeaderTeams();
    }
  }, [isOpen, user]);

  const handleClose = () => {
    setTitle("");
    setContent("");
    setCategory("General");
    setTeamId("");
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const promise = axios.post("/notices", {
      title,
      content,
      category,
      teamId,
    });

    toast.promise(promise, {
      loading: "Posting notice...",
      success: (res) => {
        onNoticePosted(res.data);
        handleClose();
        return "Notice posted successfully!";
      },
      error: (err) => err.response?.data?.message || "Failed to post notice.",
    });
  };

  const categoryOptions = [
    { value: "General", label: "General" },
    { value: "Important", label: "Important" },
    { value: "Update", label: "Update" },
    { value: "Meeting", label: "Meeting" },
  ];

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
            className="bg-[#1a103d] p-8 rounded-2xl w-full max-w-2xl text-white border border-cyan-500/50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <Megaphone className="text-cyan-400" size={28} />
              <h2 className="text-2xl font-bold font-orbitron">
                Post a New Notice
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomDropdown
                  options={leaderTeams}
                  value={teamId}
                  onChange={setTeamId}
                  placeholder="Select a Team"
                />
                <CustomDropdown
                  options={categoryOptions}
                  value={category}
                  onChange={setCategory}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Notice Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 p-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="Write your notice content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-white/5 p-3 rounded-lg h-32 resize-none outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 rounded-lg text-gray-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !teamId}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 font-semibold disabled:opacity-50"
                >
                  <Send size={18} className="inline-block mr-2" /> Post Notice
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostNoticeModal;
