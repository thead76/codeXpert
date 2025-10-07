import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckSquare, MessageSquare } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const ReviewTaskModal = ({ isOpen, onClose, task, onTaskReviewed }) => {
  const [reviewNotes, setReviewNotes] = useState("");

  useEffect(() => {
    // Jab bhi naya task aaye, purane notes clear kar dein
    if (task) {
      setReviewNotes(task.reviewNotes || "");
    }
  }, [task]);

  const handleClose = () => {
    setReviewNotes("");
    onClose();
  };

  const handleReview = async (status) => {
    const promise = axios.put(`/tasks/${task._id}/review`, {
      status,
      reviewNotes,
    });

    toast.promise(promise, {
      loading: "Submitting review...",
      success: () => {
        onTaskReviewed(); // Kanban board ko refresh karein
        handleClose();
        return `Task has been ${
          status === "Completed" ? "Approved" : "Re-assigned"
        }.`;
      },
      error: (err) => err.response?.data?.message || "Failed to submit review.",
    });
  };

  if (!task) return null;

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
            className="bg-[#1a103d] p-6 md:p-8 rounded-2xl w-full max-w-lg text-white border border-cyan-500/50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <CheckSquare className="text-cyan-400" size={28} />
                <h2 className="text-2xl font-bold font-orbitron">
                  Review Task
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-white/5 p-4 rounded-lg mb-6">
              <h3 className="font-bold text-lg text-white">{task.title}</h3>
              <p className="text-sm text-gray-300 mt-1">{task.description}</p>
              <p className="text-xs text-gray-400 mt-3">
                Assigned to:{" "}
                <span className="font-semibold">{task.assignedTo.name}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300 flex items-center gap-2">
                <MessageSquare size={16} />
                Feedback / Re-assignment Notes
              </label>
              <textarea
                placeholder="If re-assigning, provide clear instructions here..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full bg-white/5 p-3 rounded-lg h-24 resize-none outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={() => handleReview("To Do")}
                className="flex-1 bg-yellow-600/80 hover:bg-yellow-600 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                Re-assign Task
              </button>
              <button
                onClick={() => handleReview("Completed")}
                className="flex-1 bg-green-600/80 hover:bg-green-600 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                Approve & Complete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewTaskModal;
