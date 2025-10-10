import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RoleDropdown from "./RoleDropdown";

const AuthModal = ({ type, isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    login,
    sendOtp,
    verifyOtpAndRegister,
    handleGoogleLogin,
    forgotPassword,
    resetPassword,
  } = useAuth();

  const [isLogin, setIsLogin] = useState(type === "login");
  const [step, setStep] = useState("form");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    role: "member",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLogin(type === "login");
      setStep("form");
      setError("");
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        otp: "",
        role: "member",
      });
    }
  }, [isOpen, type]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await sendOtp(form.email);
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyOtpAndRegister(
        form.name,
        form.email,
        form.password,
        form.otp,
        form.role
      );
      onClose();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      onClose();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(form.email);
      setStep("resetPassword");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(form.email, form.otp, form.password);
      setIsLogin(true);
      setStep("form");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const renderForm = () => {
    if (step === "forgotPassword") {
      return (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <p className="text-center text-gray-300">
            Enter your email to receive a password reset OTP.
          </p>
          <div className="flex items-center gap-2 bg-[#2a1f52] px-4 py-3 rounded-lg">
            <Mail className="text-pink-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="bg-transparent outline-none flex-1"
              value={form.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 py-3 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
          <p className="text-center text-gray-400 text-sm">
            Remembered your password?{" "}
            <span
              onClick={() => {
                setStep("form");
                setIsLogin(true);
              }}
              className="text-pink-400 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      );
    }

    if (step === "resetPassword") {
      return (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <p className="text-center text-gray-300">
            An OTP has been sent to <strong>{form.email}</strong>.
          </p>
          <div className="flex items-center gap-2 bg-[#2a1f52] px-4 py-3 rounded-lg">
            <Lock className="text-pink-400" size={20} />
            <input
              type="text"
              name="otp"
              placeholder="Enter 6-Digit OTP"
              className="bg-transparent outline-none flex-1 text-center tracking-[8px]"
              value={form.otp}
              onChange={handleInputChange}
              maxLength={6}
              required
            />
          </div>
          <div className="flex items-center gap-2 bg-[#2a1f52] px-4 py-3 rounded-lg relative">
            <Lock className="text-pink-400" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              className="bg-transparent outline-none flex-1"
              value={form.password}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="flex items-center gap-2 bg-[#2a1f52] px-4 py-3 rounded-lg relative">
            <Lock className="text-pink-400" size={20} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm New Password"
              className="bg-transparent outline-none flex-1"
              value={form.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 py-3 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      );
    }

    return (
      <>
        <div>
          <form
            onSubmit={isLogin ? handleLogin : handleSendOtp}
            className="space-y-4"
          >
            {!isLogin && (
              <div className="flex items-center gap-2 bg-[#2a1f52] px-4 py-3 rounded-lg">
                <User className="text-pink-400" size={20} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="bg-transparent outline-none flex-1"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
            {!isLogin && (
              <RoleDropdown
                value={form.role}
                onChange={(role) => setForm({ ...form, role })}
              />
            )}
            <div className="flex items-center gap-2 bg-[#2a1f52] px-4 py-3 rounded-lg">
              <Mail className="text-pink-400" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="bg-transparent outline-none flex-1"
                value={form.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex items-center gap-2 bg-[#2a1f52] px-4 py-3 rounded-lg relative">
              <Lock className="text-pink-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="bg-transparent outline-none flex-1"
                value={form.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {!isLogin && (
              <div className="flex items-center gap-2 bg-[#2a1f52] px-4 py-3 rounded-lg relative">
                <Lock className="text-pink-400" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="bg-transparent outline-none flex-1"
                  value={form.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 py-3 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Send OTP"}
            </button>
          </form>
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-600" />
            <span className="px-2 text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-600" />
          </div>
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-500 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition"
          >
            <FcGoogle size={22} />{" "}
            {isLogin ? "Log in with Google" : "Sign up with Google"}
          </button>
          <p className="text-gray-400 text-sm text-center mt-4">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <span
                  className="text-pink-400 cursor-pointer hover:underline"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  Sign Up
                </span>
                <br />
                <span
                  className="text-pink-400 cursor-pointer hover:underline"
                  onClick={() => setStep("forgotPassword")}
                >
                  Forgot Password?
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  className="text-pink-400 cursor-pointer hover:underline"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  Login
                </span>
              </>
            )}
          </p>
        </div>
      </>
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* --- FONT STYLE ADDED HERE --- */}
        <div
          className="bg-[#1a103d] p-8 rounded-2xl shadow-2xl w-full max-w-md text-white relative border border-pink-500"
          onClick={(e) => e.stopPropagation()}
          style={{ fontFamily: "Georgia, serif" }}
        >
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold mb-6 text-center">
            {step === "forgotPassword"
              ? "Forgot Password"
              : step === "resetPassword"
              ? "Reset Password"
              : isLogin
              ? "Welcome Back"
              : "Create Account"}
          </h2>
          {error && (
            <div className="bg-red-900 border border-red-500 text-red-200 text-center p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {!isLogin && step === "otp" ? (
            <form onSubmit={handleVerifyAndRegister} className="space-y-4">
              <p className="text-center text-gray-300">
                An OTP has been sent to <strong>{form.email}</strong>. Please
                enter it below.
              </p>
              <div className="flex items-center gap-2 bg-[#2a1f52] px-4 py-3 rounded-lg">
                <Lock className="text-pink-400" size={20} />
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter 6-Digit OTP"
                  className="bg-transparent outline-none flex-1 text-center tracking-[8px]"
                  value={form.otp}
                  onChange={handleInputChange}
                  maxLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 py-3 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Create Account"}
              </button>
              <p className="text-center text-gray-400 text-sm">
                Didn't receive it?{" "}
                <span
                  onClick={() => setStep("form")}
                  className="text-pink-400 cursor-pointer hover:underline"
                >
                  Go back and try again
                </span>
              </p>
            </form>
          ) : (
            renderForm()
          )}
        </div>
      </motion.div>
    </>
  );
};

export default AuthModal;
