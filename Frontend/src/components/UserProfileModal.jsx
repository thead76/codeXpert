import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  User,
  Phone,
  Github,
  CheckCircle,
  AlertTriangle,
  Save,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import RoleDropdown from "./RoleDropdown";

const UserProfileModal = ({ isOpen, onClose }) => {
  const { user, setUser, logout } = useAuth();
  const [view, setView] = useState("profile"); // 'profile' ya 'danger'

  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    githubId: "",
    role: "",
  });
  const [initialData, setInitialData] = useState({});
  const [hasChanged, setHasChanged] = useState(false);

  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      const data = {
        name: user.name || "",
        phone: user.phone || "",
        githubId: user.githubId || "",
        role: user.role || "member",
      };
      setProfileData(data);
      setInitialData(data);
      setHasChanged(false);
      setMessage("");
      setError("");
      setView("profile");
      setDeleteConfirmEmail("");
    }
  }, [user, isOpen]);

  useEffect(() => {
    setHasChanged(JSON.stringify(profileData) !== JSON.stringify(initialData));
  }, [profileData, initialData]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };
  const handleRoleChange = (role) => {
    setProfileData({ ...profileData, role });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const { data: updatedUser } = await axios.put(
        "/users/profile",
        profileData
      );
      setUser(updatedUser); // Global user state ko update karein
      setMessage("Profile updated successfully!");
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await axios.delete("/users/profile");
      setMessage("Account deleted successfully. You will be logged out.");
      setTimeout(() => {
        logout(); // User ko logout karein
        onClose();
      }, 2500);
    } catch (err) {
      setError("Failed to delete account. Please try again.");
      setLoading(false);
    }
  };

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
          className="bg-[#1a103d] rounded-2xl shadow-2xl w-full max-w-3xl text-white border border-pink-500/50 flex flex-col md:flex-row overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Side - Profile Summary */}
          <div className="w-full md:w-1/3 bg-[#0f0425]/50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold font-orbitron shadow-lg">
              <User size={48} />
            </div>
            <h3 className="text-2xl font-bold font-orbitron mt-4 text-center">
              {profileData.name}
            </h3>
            <p className="text-sm text-gray-400 break-all text-center">
              {user?.email}
            </p>
            <span className="mt-4 px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300">
              {profileData.role.charAt(0).toUpperCase() +
                profileData.role.slice(1)}
            </span>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-2/3 p-8 flex flex-col">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <X size={24} />
            </button>
            <h2 className="text-3xl font-bold mb-2 font-orbitron">
              Account Settings
            </h2>

            <div className="flex border-b border-white/10 mb-6">
              <button
                onClick={() => setView("profile")}
                className={`px-4 py-2 font-semibold transition ${
                  view === "profile"
                    ? "text-pink-400 border-b-2 border-pink-400"
                    : "text-gray-400"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setView("danger")}
                className={`px-4 py-2 font-semibold transition ${
                  view === "danger"
                    ? "text-red-400 border-b-2 border-red-400"
                    : "text-gray-400"
                }`}
              >
                Danger Zone
              </button>
            </div>

            {message && (
              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/50 text-green-300 text-sm p-3 rounded-lg mb-4">
                <CheckCircle size={18} />
                <span>{message}</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/50 text-red-300 text-sm p-3 rounded-lg mb-4">
                <AlertTriangle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="flex-grow">
              {view === "profile" ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="flex items-center gap-3 bg-[#2a1f52] px-4 py-3 rounded-lg">
                    <User className="text-pink-400" size={20} />
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="bg-transparent outline-none flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-[#2a1f52] px-4 py-3 rounded-lg">
                    <Phone className="text-pink-400" size={20} />
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone Number"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="bg-transparent outline-none flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-[#2a1f52] px-4 py-3 rounded-lg">
                    <Github className="text-pink-400" size={20} />
                    <input
                      type="text"
                      name="githubId"
                      placeholder="GitHub Username"
                      value={profileData.githubId}
                      onChange={handleProfileChange}
                      className="bg-transparent outline-none flex-1"
                    />
                  </div>
                  <RoleDropdown
                    value={profileData.role}
                    onChange={handleRoleChange}
                  />
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={!hasChanged || loading}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-indigo-500 py-3 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                      <Save size={18} />
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="border border-red-500/50 bg-red-500/10 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-red-300">
                    Delete Account
                  </h3>
                  <p className="text-gray-400 mt-2 text-sm">
                    This action is permanent and cannot be undone. All your
                    data, teams, and projects will be permanently deleted.
                  </p>
                  <p className="text-gray-300 mt-4 mb-2 text-sm font-semibold">
                    To confirm, please type your email address:{" "}
                    <span className="text-red-300 font-bold">
                      {user?.email}
                    </span>
                  </p>
                  <input
                    type="email"
                    value={deleteConfirmEmail}
                    onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                    className="w-full bg-[#2a1f52] px-4 py-3 rounded-lg border border-red-500/50 focus:ring-red-500 focus:border-red-500 outline-none"
                  />
                  <div className="pt-4">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmEmail !== user?.email || loading}
                      className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={18} />
                      {loading
                        ? "Deleting..."
                        : "Delete My Account Permanently"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default UserProfileModal;
