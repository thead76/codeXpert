import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Mail,
  User,
  Phone,
  Github,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import RoleDropdown from "./RoleDropdown";
import PasswordInput from "./PasswordInput"; // Assuming you have a PasswordInput component for the eye icon

const UserProfileModal = ({ isOpen, onClose }) => {
  const { user, setUser, sendPasswordOtp, updatePassword } = useAuth();

  // State to switch between 'profile' details and 'password' update views
  const [view, setView] = useState("profile");

  // State for the main profile form
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    githubId: "",
    role: "",
  });

  // State for the password update form
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    otp: "",
  });
  const [passwordUpdateMethod, setPasswordUpdateMethod] = useState("password"); // 'password' or 'otp'

  // General state for messages, errors, and loading
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset all states when the modal is opened
  useEffect(() => {
    if (isOpen) {
      setView("profile");
      setMessage("");
      setError("");
      setPasswordData({ oldPassword: "", newPassword: "", otp: "" });
      setPasswordUpdateMethod("password");
      if (user) {
        setProfileData({
          name: user.name || "",
          phone: user.phone || "",
          githubId: user.githubId || "",
          role: user.role || "member",
        });
      }
    }
  }, [user, isOpen]);

  // Handlers for form input changes
  const handleProfileChange = (e) =>
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  const handleRoleChange = (role) => setProfileData({ ...profileData, role });

  // --- LOGIC FOR PROFILE UPDATE ---
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
      setUser(updatedUser); // Update the user in the global context
      setMessage("Profile updated successfully!");
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC FOR PASSWORD UPDATE ---
  const handleRequestOtp = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await sendPasswordOtp();
      setMessage("OTP sent to your email!");
      setPasswordUpdateMethod("otp"); // Switch to OTP input view
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const payload =
        passwordUpdateMethod === "otp"
          ? { otp: passwordData.otp, newPassword: passwordData.newPassword }
          : {
              oldPassword: passwordData.oldPassword,
              newPassword: passwordData.newPassword,
            };

      await updatePassword(payload);
      setMessage("Password updated successfully!");
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
    } finally {
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
          className="bg-[#1a103d] p-8 rounded-2xl shadow-2xl w-full max-w-lg text-white relative border border-pink-500/50"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X size={24} />
          </button>

          <h2 className="text-3xl font-bold mb-6 text-center font-orbitron">
            {view === "profile" ? "My Profile" : "Update Password"}
          </h2>

          {/* Display feedback messages */}
          {message && (
            <p className="text-center mb-4 text-green-400">{message}</p>
          )}
          {error && <p className="text-center mb-4 text-red-400">{error}</p>}

          {/* --- PROFILE VIEW --- */}
          {view === "profile" && (
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
              <div className="flex items-center gap-3 bg-[#2a1f52]/50 px-4 py-3 rounded-lg">
                <Mail className="text-gray-500" size={20} />
                <input
                  type="email"
                  value={user?.email || ""}
                  className="bg-transparent outline-none flex-1 text-gray-400 cursor-not-allowed"
                  readOnly
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
              <div className="border-t border-pink-500/20 pt-4 space-y-4">
                <button
                  type="button"
                  onClick={() => setView("password")}
                  className="w-full flex items-center justify-center gap-3 border border-gray-500 py-3 rounded-lg font-semibold hover:bg-[#2a1f52] transition"
                >
                  <KeyRound size={18} /> Update Password
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 py-3 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {/* --- PASSWORD UPDATE VIEW --- */}
          {view === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {passwordUpdateMethod === "password" ? (
                <div>
                  <div className="flex items-center gap-3 bg-[#2a1f52] px-4 py-3 rounded-lg">
                    <KeyRound className="text-pink-400" size={20} />
                    <PasswordInput
                      name="oldPassword"
                      placeholder="Current Password"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <p className="text-center text-sm text-gray-400 mt-3">
                    Forgot your password?{" "}
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      disabled={loading}
                      className="text-cyan-400 hover:underline disabled:opacity-50"
                    >
                      {loading && passwordUpdateMethod === "password"
                        ? "Sending..."
                        : "Get OTP on Mail"}
                    </button>
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-[#2a1f52] px-4 py-3 rounded-lg">
                  <ShieldCheck className="text-green-400" size={20} />
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP from Email"
                    value={passwordData.otp}
                    onChange={handlePasswordChange}
                    className="bg-transparent outline-none flex-1 text-center tracking-[4px]"
                    maxLength={6}
                  />
                </div>
              )}

              <div className="flex items-center gap-3 bg-[#2a1f52] px-4 py-3 rounded-lg">
                <KeyRound className="text-pink-400" size={20} />
                <PasswordInput
                  name="newPassword"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="border-t border-pink-500/20 pt-4 space-y-4">
                <button
                  type="button"
                  onClick={() => setView("profile")}
                  className="w-full flex items-center justify-center gap-3 border border-gray-500 py-3 rounded-lg font-semibold hover:bg-[#2a1f52] transition"
                >
                  Back to Profile
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 py-3 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default UserProfileModal;
