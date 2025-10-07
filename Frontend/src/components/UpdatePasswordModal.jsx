import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "./PasswordInput";

// --- Naya Component: Password Strength Meter ---
// Yeh component password ki strength ko visually dikhata hai.
const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length > 8) score++;
    if (pass.match(/[a-z]/)) score++;
    if (pass.match(/[A-Z]/)) score++;
    if (pass.match(/[0-9]/)) score++;
    if (pass.match(/[^A-Za-z0-9]/)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthLabels = [
    "Very Weak",
    "Weak",
    "Medium",
    "Strong",
    "Very Strong",
  ];
  const barColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
  ];
  const barWidth = `${(strength / 5) * 100}%`;

  return (
    <div className="mt-2">
      <div className="w-full bg-[#2a1f52] rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${
            barColors[strength - 1] || "bg-transparent"
          }`}
          style={{ width: barWidth }}
          initial={{ width: 0 }}
          animate={{ width: barWidth }}
          transition={{ duration: 0.5 }}
        ></motion.div>
      </div>
      <p className="text-xs text-gray-400 mt-1 text-right">
        Strength: {strengthLabels[strength - 1] || "Too Short"}
      </p>
    </div>
  );
};

const UpdatePasswordModal = ({ isOpen, onClose }) => {
  const { sendPasswordOtp, updatePassword } = useAuth();
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
  });
  const [method, setMethod] = useState("password");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal khulne par sab reset karein
  useEffect(() => {
    if (isOpen) {
      setMethod("password");
      setMessage("");
      setError("");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        otp: "",
      });
    }
  }, [isOpen]);

  const handleRequestOtp = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await sendPasswordOtp();
      setMessage("OTP sent successfully to your email!");
      setMethod("otp");
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const payload =
        method === "otp"
          ? { otp: passwordData.otp, newPassword: passwordData.newPassword }
          : {
              oldPassword: passwordData.oldPassword,
              newPassword: passwordData.newPassword,
            };

      await updatePassword(payload);
      setMessage("Password updated successfully! Closing soon...");
      setTimeout(() => onClose(), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled =
    !passwordData.newPassword ||
    passwordData.newPassword !== passwordData.confirmPassword ||
    loading;

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
          className="bg-[#1a103d] p-8 rounded-2xl shadow-2xl w-full max-w-md text-white relative border border-pink-500/50"
          onClick={(e) => e.stopPropagation()}
          style={{ fontFamily: "Georgia, serif" }}
        >
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X size={24} />
          </button>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold font-orbitron">Security</h2>
            <p className="text-gray-400 mt-1">Update your password</p>
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

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {method === "password" ? (
              <div>
                <PasswordInput
                  name="oldPassword"
                  placeholder="Current Password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                />
                <p className="text-center text-xs text-gray-400 mt-2">
                  Forgot password?{" "}
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={loading}
                    className="text-cyan-400 hover:underline disabled:opacity-50 font-semibold"
                  >
                    {loading ? "Sending..." : "Use OTP instead"}
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
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, otp: e.target.value })
                  }
                  className="bg-transparent outline-none flex-1 text-center tracking-[4px]"
                  maxLength={6}
                />
              </div>
            )}

            <hr className="border-white/10" />

            <div>
              <PasswordInput
                name="newPassword"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
              />
              <PasswordStrengthMeter password={passwordData.newPassword} />
            </div>

            <PasswordInput
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
            />

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 py-3 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default UpdatePasswordModal;
