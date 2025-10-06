import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  PlusCircle,
  Users,
  Loader,
  ShieldX,
  Zap,
  Users2,
  Target,
} from "lucide-react";
import CreateTeamModal from "../components/CreateTeamModal";
import { motion } from "framer-motion";

const MyTeam = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchTeams = async () => {
    try {
      const { data } = await axios.get("/teams");
      setTeams(data);
    } catch (error) {
      console.error("Failed to fetch teams", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleTeamCreated = (newTeam) => {
    setTeams((prevTeams) => [...prevTeams, newTeam]);
    fetchTeams();
  };

  const isLeader = user?.role === "leader";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center bg-gradient-to-br from-[#1a103d]/50 to-[#0f0425]/50 p-8 md:p-16 rounded-3xl border border-pink-500/30 backdrop-blur-sm"
    >
      <ShieldX size={64} className="mx-auto text-pink-400 mb-6" />
      <h2 className="text-3xl font-bold font-orbitron mb-4">
        Your Team Hub is Empty
      </h2>
      <p className="text-gray-400 max-w-xl mx-auto mb-8">
        {isLeader
          ? "You haven't created any teams yet. Assemble your crew to start collaborating, assigning tasks, and tracking progress all in one place."
          : "You are not part of any team. Once you are invited or create a team, it will appear here."}
      </p>
      {isLeader && (
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 mx-auto hover:scale-105 transition-transform duration-300 shadow-lg shadow-pink-500/20"
        >
          <PlusCircle size={22} />
          <span>Create Your First Team</span>
        </button>
      )}
    </motion.div>
  );

  return (
    <>
      <div className="min-h-[calc(100vh-80px)] w-full text-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-orbitron tracking-wide">
                My Teams
              </h1>
              <p className="text-gray-400 mt-2">
                Manage your teams, members, and projects.
              </p>
            </div>
            {isLeader && teams.length > 0 && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-5 py-3 rounded-full font-semibold flex items-center gap-2 hover:scale-105 transition-transform duration-300 shadow-lg"
              >
                <PlusCircle size={20} />
                <span>Create New Team</span>
              </button>
            )}
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="animate-spin text-cyan-400" size={48} />
            </div>
          ) : teams.length === 0 ? (
            <EmptyState />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {teams.map((team) => (
                <motion.div key={team._id} variants={cardVariants}>
                  <Link to={`/team/${team._id}`}>
                    <div className="bg-[#1a103d]/50 p-6 rounded-2xl h-full border border-pink-500/30 backdrop-blur-sm transition-all duration-300 hover:border-cyan-400 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10">
                      <div className="flex justify-between items-start">
                        <h2 className="text-2xl font-bold mb-3 truncate font-orbitron">
                          {team.name}
                        </h2>
                        <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full">
                          {team.members.length} Members
                        </span>
                      </div>

                      {/* --- DISPLAY THE DESCRIPTION --- */}
                      <p className="text-sm text-gray-400 min-h-[40px] line-clamp-2">
                        {team.description || "No description provided."}
                      </p>

                      <div className="text-xs text-gray-500 mt-4 border-t border-white/10 pt-4">
                        Leader: {team.leader.name}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {teams.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-16"
            >
              <h3 className="text-2xl font-bold text-center mb-8 font-orbitron">
                Why Use Teams?
              </h3>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <Zap size={32} className="mx-auto text-cyan-400 mb-4" />
                  <h4 className="font-semibold text-lg mb-2">
                    Streamline Workflow
                  </h4>
                  <p className="text-sm text-gray-400">
                    Assign tasks and track their status from "To Do" to
                    "Completed" with ease.
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <Users2 size={32} className="mx-auto text-pink-400 mb-4" />
                  <h4 className="font-semibold text-lg mb-2">
                    Centralized Collaboration
                  </h4>
                  <p className="text-sm text-gray-400">
                    Keep all your team members, discussions, and project files
                    in one place.
                  </p>
                </div>
                <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                  <Target size={32} className="mx-auto text-green-400 mb-4" />
                  <h4 className="font-semibold text-lg mb-2">
                    Monitor Progress
                  </h4>
                  <p className="text-sm text-gray-400">
                    Get a clear overview of team performance and project
                    milestones with our reporting tools.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTeamCreated={handleTeamCreated}
      />
    </>
  );
};

export default MyTeam;
