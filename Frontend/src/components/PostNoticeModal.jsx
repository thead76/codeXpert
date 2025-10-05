import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Type, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const PostNoticeModal = ({ isOpen, onClose, onNoticePosted }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("Medium");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newNotice = {
      _id: `notice-${Date.now()}`,
      title,
      content,
      priority,
      author: user.name,
      date: new Date().toISOString(),
      category: "Updates", // Default category for new posts
    };
    onNoticePosted(newNotice);
    onClose();
    // Reset form
    setTitle("");
    setContent("");
    setPriority("Medium");
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
          className="bg-[#1a103d] p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-white relative border border-pink-500/50"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X size={24} />
          </button>
          <h2 className="text-3xl font-bold mb-6 text-center font-orbitron">
            Post a New Notice
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3 bg-[#2a1f52] px-4 py-3 rounded-lg">
              <Type className="text-pink-400" size={20} />
              <input
                type="text"
                placeholder="Notice Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent outline-none flex-1 text-lg font-semibold"
                required
              />
            </div>
            <div className="flex items-start gap-3 bg-[#2a1f52] px-4 py-3 rounded-lg">
              <FileText className="text-pink-400 mt-1" size={20} />
              <textarea
                placeholder="Enter the notice content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-transparent outline-none flex-1 h-40 resize-none"
                required
              />
            </div>
            <div>
              <label className="font-semibold mb-2 block">Priority</label>
              <div className="flex gap-3">
                {["High", "Medium", "Low"].map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      priority === p
                        ? "bg-pink-500 text-white"
                        : "bg-[#2a1f52] hover:bg-[#3a2f62]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              Publish Notice
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default PostNoticeModal;
