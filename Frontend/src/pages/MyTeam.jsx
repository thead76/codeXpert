import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { PlusCircle, Users, Loader } from "lucide-react"; // Import Loader icon
import TeamCard from "../components/TeamCard";
import CreateTeamModal from "../components/CreateTeamModal";
import InvitationNotification from "../components/InvitationNotification";

// --- DUMMY DATA ---
const dummyLeaderTeams = [
  {
    _id: "team1",
    name: "Project Phoenix",
    leader: { name: "Aditya Kumar" },
    members: [{ name: "Rohan" }, { name: "Priya" }, { name: "Amit" }],
    tasks: [
      { name: "UI/UX Design", progress: 80 },
      { name: "Backend API", progress: 65 },
      { name: "Database Migration", progress: 95 },
    ],
  },
  {
    _id: "team2",
    name: "Quantum Leap",
    leader: { name: "Aditya Kumar" },
    members: [{ name: "Sneha" }, { name: "Vikram" }],
    tasks: [
      { name: "Algorithm Research", progress: 40 },
      { name: "Frontend Development", progress: 55 },
    ],
  },
];

const dummyMemberTeams = [
  {
    _id: "team3",
    name: "Project Nova",
    leader: { name: "Anjali Sharma" },
    members: [{ name: "Aditya Kumar (You)" }, { name: "Karan" }],
    tasks: [
      { name: "Client-side Routing", progress: 75 },
      { name: "State Management", progress: 90 },
    ],
  },
];

const dummyInvitation = {
  teamName: "Cyber Sentinels",
  leaderName: "Riya Singh",
};
// --- END DUMMY DATA ---

const MyTeam = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [invitation, setInvitation] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // --- NEW: Loading state ---

  useEffect(() => {
    // Simulate a delay for fetching data to see the loading state
    const timer = setTimeout(() => {
      if (user) {
        if (user.role === "leader") {
          setTeams(dummyLeaderTeams);
        } else {
          setTeams(dummyMemberTeams);
          setInvitation(dummyInvitation);
        }
        setIsLoading(false); // --- Stop loading once user data is processed
      }
    }, 500); // 0.5 second delay

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [user]);

  const handleTeamCreated = (newTeam) => {
    setTeams([
      ...teams,
      { ...newTeam, leader: { name: user.name }, tasks: [] },
    ]);
  };

  // --- NEW: Render a loading state ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96 text-white">
        <Loader className="animate-spin mr-3" size={32} />
        <span className="text-xl">Loading your teams...</span>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto px-4 md:px-8 py-8 text-white"
      style={{ fontFamily: "Orbitron, sans-serif" }}
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold font-orbitron">My Team</h1>
          <p className="text-gray-400 mt-1">
            Manage your teams, members, and projects.
          </p>
        </div>
        {user?.role === "leader" && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-indigo-500 py-3 px-6 rounded-lg font-semibold hover:scale-105 transition-transform shadow-lg shadow-pink-500/20"
          >
            <PlusCircle size={20} />
            Create New Team
          </button>
        )}
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {teams.map((team) => (
          <TeamCard
            key={team._id}
            team={team}
            isLeader={user?.role === "leader"}
          />
        ))}
      </div>
      {teams.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Users size={48} className="mx-auto mb-4" />
          <p>You are not part of any teams yet.</p>
        </div>
      )}

      {/* Modals and Notifications */}
      <CreateTeamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTeamCreated={handleTeamCreated}
      />
      {invitation && (
        <InvitationNotification
          invitation={invitation}
          onClose={() => setInvitation(null)}
        />
      )}
    </div>
  );
};

export default MyTeam;
