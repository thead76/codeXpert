import React from "react";
import { Users, UserCheck, Star, Trash2, Edit } from "lucide-react";
import { motion } from "framer-motion";

const TeamCard = ({ team, isLeader }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1a103d]/80 backdrop-blur-sm border border-pink-500/30 rounded-2xl p-6 shadow-lg shadow-indigo-500/10"
    >
      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold font-orbitron">{team.name}</h2>
          <div className="flex items-center gap-2 text-sm text-yellow-400 mt-1">
            <Star size={16} className="fill-current" />
            <span>Leader: {team.leader.name}</span>
          </div>
        </div>
        {isLeader && (
          <div className="flex gap-2">
            <button className="p-2 hover:bg-pink-500/20 rounded-full transition">
              <Edit size={16} />
            </button>
            <button className="p-2 hover:bg-pink-500/20 rounded-full transition">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Members Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-300 flex items-center gap-2 mb-3">
          <Users size={18} />
          Team Members ({team.members.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {team.members.map((member, index) => (
            <div
              key={index}
              className="bg-[#2a1f52] px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              <UserCheck size={14} className="text-cyan-400" />
              <span>{member.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Assigned Projects / Tasks Section */}
      <div>
        <h3 className="font-semibold text-gray-300 mb-3">Assigned Projects</h3>
        <div className="space-y-3">
          {team.tasks.map((task, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span>{task.name}</span>
                <span className="font-semibold">{task.progress}%</span>
              </div>
              <div className="w-full bg-[#2a1f52] rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-pink-500 to-cyan-400 h-2.5 rounded-full"
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TeamCard;
