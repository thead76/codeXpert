import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RoleDropdown from "./RoleDropdown";

const AuthModal = ({ type, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [authType, setAuthType] = useState(type || "login"); // "login" | "signup"
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [serverOtp, setServerOtp] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAuthType(type || "login");
      setStep("form");
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        otp: "",
      });
      setPopupMessage("");
    }
  }, [isOpen, type]);

  // Fake send OTP
  const sendOtp = async (email) =>
    new Promise((resolve) => {
      setTimeout(() => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("📩 OTP sent to", email, ":", otp);
        resolve(otp);
      }, 800);
    });

  // Signup
  const handleSignup = async () => {
    if (!form.email || !form.password || form.password !== form.confirmPassword) {
      setPopupType("error");
      setPopupMessage("⚠️ Fill all fields & confirm password properly!");
      return;
    }
    setLoading(true);
    const otp = await sendOtp(form.email);
    setServerOtp(otp);
    setLoading(false);
    setStep("otp");
  };

  // Verify OTP
  const handleVerifyOtp = () => {
    if (form.otp === serverOtp) {
      setPopupType("success");
      setPopupMessage("🎉 OTP Verified! Account created successfully.");
      // ✅ mark logged in, then go to dashboard
      login({ email: form.email, name: form.name });
      setTimeout(() => {
        onClose?.();
        navigate("/dashboard", { replace: true });
      }, 400);
    } else {
      setPopupType("error");
      setPopupMessage("❌ Invalid OTP, try again!");
    }
  };

  // Login
  const handleLogin = () => {
    // Demo check; replace with backend later
    const ok =
      (form.email === "admin@codexpert.com" && form.password === "Admin@11") ||
      (form.email && form.password);

    if (ok) {
      setPopupType("success");
      setPopupMessage("✅ Welcome!");
      // ✅ mark logged in, then go to dashboard
      login({ email: form.email });
      setTimeout(() => {
        onClose?.();
        navigate("/dashboard", { replace: true });
      }, 400);
    } else {
      setPopupType("error");
      setPopupMessage("❌ Wrong email or password!");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="bg-[#1a103d] p-8 rounded-2xl shadow-2xl w-full max-w-md text-white relative border border-pink-500"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X size={24} />
          </button>

          {/* Switch */}
          <AnimatePresence mode="wait">
            {authType === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{
                  duration: 0.4, // exit duration (slower disappear)
                  ease: "easeInOut",
                  when: "beforeChildren", // makes sure it respects sequence
                }}
              >
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Welcome Back
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 bg-[#2a1f52] px-4 py-3 rounded-lg">
                    <Mail className="text-pink-400" size={20} />
                    <input
                      type="email"
                      placeholder="Email"
                      className="bg-transparent outline-none flex-1"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2 bg-[#2a1f52] px-4 py-3 rounded-lg relative">
                    <Lock className="text-pink-400" size={20} />
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Password"
                      className="bg-transparent outline-none flex-1"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 text-gray-400 hover:text-white"
                    >
                      {showLoginPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
                  >
                    Login
                  </button>

                  <div className="flex items-center my-4">
                    <div className="flex-1 h-px bg-gray-600" />
                    <span className="px-2 text-gray-400">OR</span>
                    <div className="flex-1 h-px bg-gray-600" />
                  </div>

                  <button className="w-full flex items-center justify-center gap-3 border border-gray-500 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition">
                    <FcGoogle size={22} /> Log in with Google
                  </button>

                  <p className="text-gray-400 text-sm text-center mt-4">
                    Don’t have an account?{" "}
                    <span
                      className="text-pink-400 cursor-pointer hover:underline"
                      onClick={() => setAuthType("signup")}
                    >
                      Sign Up
                    </span>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
              >
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Create Account
                </h2>
                {step === "form" ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 bg-[#2a1f52] px-4 py-3 rounded-lg">
                      <User className="text-pink-400" size={20} />
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="bg-transparent outline-none flex-1"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    </div>

                    <RoleDropdown
                      value={form.role}
                      onChange={(role) => setForm({ ...form, role })}
                    />

                    <div className="flex items-center gap-2 bg-[#2a1f52] px-4 py-3 rounded-lg">
                      <Mail className="text-pink-400" size={20} />
                      <input
                        type="email"
                        placeholder="Email"
                        className="bg-transparent outline-none flex-1"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                    </div>

                    <div className="flex items-center gap-2 bg-[#2a1f52] px-4 py-3 rounded-lg relative">
                      <Lock className="text-pink-400" size={20} />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="bg-transparent outline-none flex-1"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-gray-400 hover:text-white"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 bg-[#2a1f52] px-4 py-3 rounded-lg relative">
                      <Lock className="text-pink-400" size={20} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="bg-transparent outline-none flex-1"
                        value={form.confirmPassword}
                        onChange={(e) =>
                          setForm({ ...form, confirmPassword: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 text-gray-400 hover:text-white"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={handleSignup}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 py-3 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50"
                    >
                      {loading ? "Sending OTP..." : "Send OTP"}
                    </button>

                    <div className="flex items-center my-4">
                      <div className="flex-1 h-px bg-gray-600" />
                      <span className="px-2 text-gray-400">OR</span>
                      <div className="flex-1 h-px bg-gray-600" />
                    </div>

                    <button className="w-full flex items-center justify-center gap-3 border border-gray-500 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition">
                      <FcGoogle size={22} /> Sign up with Google
                    </button>

                    <p className="text-gray-400 text-sm text-center mt-4">
                      Already have an account?{" "}
                      <span
                        className="text-pink-400 cursor-pointer hover:underline"
                        onClick={() => setAuthType("login")}
                      >
                        Login
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-300 text-center">
                      Enter the 6-digit OTP sent to your email
                    </p>
                    <div className="flex items-center gap-2 bg-[#2a1f52] px-4 py-3 rounded-lg">
                      <Lock className="text-pink-400" size={20} />
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        className="bg-transparent outline-none flex-1 text-center tracking-[6px] font-bold text-xl"
                        value={form.otp}
                        onChange={(e) =>
                          setForm({ ...form, otp: e.target.value })
                        }
                        maxLength={6}
                      />
                    </div>
                    <button
                      onClick={handleVerifyOtp}
                      className="w-full bg-gradient-to-r from-pink-500 to-indigo-500 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
                    >
                      Verify OTP
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Popup */}
      <AnimatePresence>
        {popupMessage && (
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60"
            onClick={() => setPopupMessage("")}
          >
            <div
              className={`p-6 rounded-2xl shadow-2xl max-w-md w-[92%] text-center border ${
                popupType === "error"
                  ? "bg-[#1a103d] border-pink-500 text-white"
                  : "bg-green-900 border-green-400 text-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                className={`text-2xl font-bold mb-3 ${
                  popupType === "error" ? "text-pink-400" : "text-green-300"
                }`}
              >
                {popupType === "error" ? "🚫 Oops!" : "✅ Success!"}
              </h2>
              <p className="text-gray-300 mb-6">{popupMessage}</p>
              <button
                onClick={() => setPopupMessage("")}
                className={`px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform ${
                  popupType === "error"
                    ? "bg-gradient-to-r from-pink-500 to-indigo-500"
                    : "bg-gradient-to-r from-green-500 to-emerald-500"
                }`}
              >
                Got it 👍
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AuthModal;
