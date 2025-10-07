import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ClipboardList } from "lucide-react";
import axios from "axios";
import CustomDropdown from "./CustomDropdown"; // CustomDropdown component ko import karein

const AssignTaskModal = ({ isOpen, onClose, team }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("Medium"); // Priority ke liye state add karein
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Dropdown ke liye options
  const priorityOptions = [
    { value: "High", label: "High Priority" },
    { value: "Medium", label: "Medium Priority" },
    { value: "Low", label: "Low Priority" },
  ];

  // Team members ko dropdown ke format mein convert karein
  const memberOptions = team?.members.map((member) => ({
    value: member._id,
    label: member.name,
  }));

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setPriority("Medium"); // Priority state ko reset karein
    setError("");
    setLoading(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("/tasks", {
        title,
        description,
        assignedTo,
        priority, // API call mein priority bhejein
        teamId: team._id,
      });
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign task");
    } finally {
      setLoading(false);
    }
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
            className="bg-[#1a103d] p-8 rounded-2xl w-full max-w-lg text-white border border-cyan-500/50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <ClipboardList className="text-cyan-400" size={28} />
                <h2 className="text-2xl font-bold font-orbitron">
                  Assign New Task
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {error && (
              <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Task Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Deploy to production"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 p-3 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Description
                </label>
                <textarea
                  placeholder="Detailed description of the task..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 p-3 rounded-lg h-28 outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              {/* Priority Dropdown */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Priority
                </label>
                <CustomDropdown
                  options={priorityOptions}
                  value={priority}
                  onChange={(value) => setPriority(value)}
                />
              </div>

              {/* Assign To Dropdown */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Assign To
                </label>
                <CustomDropdown
                  options={memberOptions}
                  value={assignedTo}
                  onChange={(value) => setAssignedTo(value)}
                  placeholder="Select a team member"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !assignedTo} // Disable karein agar member select nahi hai
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-3 rounded-full font-semibold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Assigning..." : "Assign Task"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AssignTaskModal;