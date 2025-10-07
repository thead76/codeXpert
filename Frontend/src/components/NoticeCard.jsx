import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Trash2, Clock, Users } from "lucide-react";

const NoticeCard = ({ notice, onDeleteClick }) => {
  // <-- Prop mein 'onDeleteClick' lein
  const { user } = useAuth();
  const isAuthor = user._id === notice.postedBy._id;

  const categoryStyles = {
    General: "bg-blue-500",
    Important: "bg-red-500",
    Update: "bg-green-500",
    Meeting: "bg-yellow-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="relative pl-8 py-4 border-l-2 border-pink-500/30"
    >
      {/* Timeline Dot */}
      <div
        className={`absolute -left-2 top-5 w-4 h-4 rounded-full ${
          categoryStyles[notice.category]
        }`}
      ></div>

      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full bg-white/10`}
          >
            {notice.team.name}
          </span>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              categoryStyles[notice.category]
            } text-white`}
          >
            {notice.category}
          </span>
        </div>
        {/* --- YAHAN BADLAAV KIYA GAYA HAI --- */}
        {isAuthor && (
          <button
            onClick={() => onDeleteClick(notice)}
            className="text-gray-400 hover:text-red-400"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <h3 className="text-xl font-bold font-orbitron text-white mt-3 mb-2">
        {notice.title}
      </h3>
      <p className="text-gray-300 text-sm mb-4">{notice.content}</p>

      <div className="flex justify-between items-center text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <img
            src={
              notice.postedBy.avatar ||
              `https://ui-avatars.com/api/?name=${notice.postedBy.name}`
            }
            alt={notice.postedBy.name}
            className="w-6 h-6 rounded-full"
          />
          <span>{notice.postedBy.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={14} />
          <span>
            {new Date(notice.createdAt).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default NoticeCard;
