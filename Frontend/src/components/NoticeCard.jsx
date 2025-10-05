import React from "react";
import { motion } from "framer-motion";
import { User, Clock } from "lucide-react";

const NoticeCard = ({ notice }) => {
  const priorityClasses = {
    High: "bg-red-500/20 text-red-300 border-red-500/50",
    Medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
    Low: "bg-gray-500/20 text-gray-300 border-gray-500/50",
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1a103d]/80 backdrop-blur-sm border border-pink-500/30 rounded-2xl shadow-lg shadow-indigo-500/10 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-2xl font-bold font-orbitron">{notice.title}</h2>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border ${
              priorityClasses[notice.priority]
            }`}
          >
            {notice.priority}
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-400 mb-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <User size={14} />
            <span>{notice.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} />
            <span>{formatDate(notice.date)}</span>
          </div>
        </div>

        <p className="text-gray-300 leading-relaxed">{notice.content}</p>
      </div>
    </motion.div>
  );
};

export default NoticeCard;
