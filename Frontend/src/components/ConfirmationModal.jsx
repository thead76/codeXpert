import React from "react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
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
          className="bg-[#1a103d] p-8 rounded-2xl shadow-2xl w-full max-w-sm text-white relative border border-pink-500/50"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold mb-4 text-center font-orbitron">
            {title}
          </h2>
          <p className="text-gray-300 text-center mb-8">{message}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-8 py-2 rounded-lg font-semibold border border-gray-500 hover:bg-[#2a1f52] transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-8 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-700 transition flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ConfirmationModal;
