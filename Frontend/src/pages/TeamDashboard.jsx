import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  Users,
  PlusCircle,
  Trash2,
  Shield,
  Loader,
  AlertTriangle,
  Clock,
  UserCheck,
  Trash,
} from "lucide-react";
import AssignTaskModal from "../components/AssignTaskModal";
import AddMemberModal from "../components/AddMemberModal";
import ConfirmationModal from "../components/ConfirmationModal";
import toast from "react-hot-toast";

const TeamDashboard = () => {
  const { teamId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [allPersonnel, setAllPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAssignTaskModalOpen, setAssignTaskModalOpen] = useState(false);
  const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [isConfirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);

  const fetchTeamDetails = async () => {
    try {
      setError("");
      const { data } = await axios.get(`/teams/${teamId}`);
      setTeam(data);
      const members = data.members.map((m) => ({ ...m, status: "Accepted" }));
      const invitedUsers = data.invitations
        .filter((inv) => !members.some((m) => m._id === inv.invitedUser._id))
        .map((inv) => ({ ...inv.invitedUser, status: inv.status }));
      setAllPersonnel([...members, ...invitedUsers]);
    } catch (err) {
      console.error("Failed to fetch team data", err);
      setError(
        "Failed to load team data. The team may not exist or you may not have permission to view it."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  const handleRemoveMemberClick = (member) => {
    setMemberToRemove(member);
    setConfirmRemoveOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!memberToRemove) return;
    const promise = axios.delete(
      `/teams/${teamId}/members/${memberToRemove._id}`
    );
    toast.promise(promise, {
      loading: `Removing ${memberToRemove.name}...`,
      success: () => {
        fetchTeamDetails();
        return `${memberToRemove.name} has been removed.`;
      },
      error: (err) => err.response?.data?.message || "Could not remove member.",
    });
    setConfirmRemoveOpen(false);
    setMemberToRemove(null);
  };

  const handleConfirmDeleteTeam = async () => {
    const promise = axios.delete(`/teams/${teamId}`);
    toast.promise(promise, {
      loading: `Deleting team "${team.name}"...`,
      success: () => {
        navigate("/my-team");
        return "Team deleted successfully!";
      },
      error: (err) =>
        err.response?.data?.message || "Could not delete the team.",
    });
    setConfirmDeleteOpen(false);
  };

  const isLeader = user?._id === team?.leader?._id;
  const acceptedMembers = allPersonnel.filter((p) => p.status === "Accepted");

  const StatusBadge = ({ status }) => {
    if (status === "Accepted")
      return (
        <span className="text-xs bg-green-500/50 text-green-300 px-2 py-1 rounded-full flex items-center gap-1">
          <UserCheck size={14} /> Accepted
        </span>
      );
    if (status === "pending")
      return (
        <span className="text-xs bg-yellow-500/50 text-yellow-300 px-2 py-1 rounded-full flex items-center gap-1">
          <Clock size={14} /> Pending
        </span>
      );
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <Loader className="animate-spin text-cyan-400" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-80px)] text-center text-white">
        <AlertTriangle className="text-red-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold mb-2">An Error Occurred</h2>
        <p className="text-gray-400">{error}</p>
        <button
          onClick={() => navigate("/my-team")}
          className="mt-6 bg-pink-500 px-4 py-2 rounded-lg"
        >
          Back to My Teams
        </button>
      </div>
    );
  }

  if (!team) return null;

  return (
    <>
      <div className="container mx-auto p-4 md:p-8 text-white">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-orbitron">
            {team.name}
          </h1>
          <p className="text-lg text-gray-400 mt-2">
            Managed by{" "}
            <span className="font-semibold text-cyan-400">
              {team.leader.name}
            </span>
          </p>
        </div>

        {isLeader && (
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => setAssignTaskModalOpen(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-5 py-3 rounded-full font-semibold flex items-center gap-2 hover:scale-105 transition-transform duration-300"
            >
              <PlusCircle size={20} /> Assign Task
            </button>
            <button
              onClick={() => setAddMemberModalOpen(true)}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-5 py-3 rounded-full font-semibold flex items-center gap-2 hover:scale-105 transition-transform duration-300"
            >
              <Users size={20} /> Invite Member
            </button>
            <button
              onClick={() => setConfirmDeleteOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-full font-semibold flex items-center gap-2 ml-auto transition-colors"
            >
              <Trash size={20} /> Delete Team
            </button>
          </div>
        )}

        <div className="bg-[#1a103d]/50 p-6 rounded-2xl border border-pink-500/30">
          <h2 className="text-2xl font-semibold mb-4">
            Team Roster ({allPersonnel.length})
          </h2>
          <ul className="space-y-3">
            {allPersonnel.map((person) => (
              <li
                key={person._id}
                className="flex justify-between items-center bg-white/5 p-3 rounded-lg transition-colors hover:bg-white/10"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      person.avatar ||
                      `https://ui-avatars.com/api/?name=${person.name}&background=random`
                    }
                    alt={person.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <span className="font-semibold">{person.name}</span>
                    {person._id === user._id && (
                      <span className="ml-2 text-xs bg-cyan-500/50 text-cyan-300 px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                    {person._id === team.leader._id && (
                      <Shield
                        size={16}
                        className="inline-block ml-2 text-yellow-400"
                        title="Team Leader"
                      />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={person.status} />
                  {isLeader &&
                    person._id !== team.leader._id &&
                    person.status === "Accepted" && (
                      <button
                        onClick={() => handleRemoveMemberClick(person)}
                        className="text-red-500 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-500/10"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isLeader && (
        <>
          <AssignTaskModal
            isOpen={isAssignTaskModalOpen}
            onClose={() => setAssignTaskModalOpen(false)}
            team={{ ...team, members: acceptedMembers }}
          />
          <AddMemberModal
            isOpen={isAddMemberModalOpen}
            onClose={() => setAddMemberModalOpen(false)}
            teamId={teamId}
            onMemberAdded={fetchTeamDetails}
          />
          <ConfirmationModal
            isOpen={isConfirmRemoveOpen}
            onClose={() => setConfirmRemoveOpen(false)}
            onConfirm={handleConfirmRemove}
            title="Confirm Removal"
            message={`Are you sure you want to remove ${memberToRemove?.name} from the team?`}
          />
          <ConfirmationModal
            isOpen={isConfirmDeleteOpen}
            onClose={() => setConfirmDeleteOpen(false)}
            onConfirm={handleConfirmDeleteTeam}
            title="Confirm Team Deletion"
            message={`Are you sure you want to permanently delete the team "${team?.name}"? This action cannot be undone.`}
          />
        </>
      )}
    </>
  );
};

export default TeamDashboard;
