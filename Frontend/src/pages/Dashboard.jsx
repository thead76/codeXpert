import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { PlusCircle, Users, Activity, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import CreateTeamModal from "../components/CreateTeamModal";

const Dashboard = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data } = await axios.get("/teams");
        setTeams(data);
      } catch (error) {
        console.error("Failed to fetch teams", error);
      }
    };
    if (user) fetchTeams();
  }, [user]);

  const handleTeamCreated = (newTeam) => {
    setTeams((prevTeams) => [...prevTeams, newTeam]);
  };

  // Dummy data for projects and tasks
  const dummyProjects = [
    { name: "Project Alpha", progress: 75 },
    { name: "Project Beta", progress: 40 },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-[#0f0425] text-white pt-10">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold font-orbitron">
              Welcome, {user?.name || "User"}!
            </h1>
            {user?.role === "leader" && (
              <button
                onClick={() => setIsCreateTeamModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-indigo-500 py-2 px-5 rounded-lg font-semibold hover:scale-105 transition-transform shadow-lg shadow-pink-500/20"
              >
                <PlusCircle size={20} />
                Create Team
              </button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* My Teams Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            custom={0}
            className="md:col-span-2 bg-[#1a103d]/50 border border-pink-500/30 rounded-2xl p-6 shadow-2xl"
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <Users className="text-pink-400" /> My Teams
            </h2>
            {teams.length > 0 ? (
              <div className="space-y-4">
                {teams.map((team) => (
                  <div
                    key={team._id}
                    className="bg-[#2a1f52] p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-bold text-lg">{team.name}</h3>
                      <p className="text-sm text-gray-400">
                        Leader: {team.leader.name}
                      </p>
                    </div>
                    <div className="text-sm text-gray-400">
                      {team.members.length} Members
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">
                You are not part of any teams yet.
              </p>
            )}
          </motion.div>

          {/* Assigned Projects Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            custom={1}
            className="bg-[#1a103d]/50 border border-pink-500/30 rounded-2xl p-6 shadow-2xl"
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <Activity className="text-pink-400" /> Assigned Projects
            </h2>
            <div className="space-y-4">
              {dummyProjects.map((proj) => (
                <div key={proj.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{proj.name}</span>
                    <span className="text-sm text-pink-400">
                      {proj.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-[#2a1f52] rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-indigo-500 h-2.5 rounded-full"
                      style={{ width: `${proj.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <CreateTeamModal
        isOpen={isCreateTeamModalOpen}
        onClose={() => setIsCreateTeamModalOpen(false)}
        onTeamCreated={handleTeamCreated}
      />
    </div>
  );
};

export default Dashboard;
