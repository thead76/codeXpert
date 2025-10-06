import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Set the base URL for all API requests
  axios.defaults.baseURL = "http://localhost:8888/api/v1";

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        // Set the auth header for all subsequent requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          // Fetch the full user profile from the new backend endpoint
          const { data } = await axios.get("/users/profile");
          setUser(data); // Store the real user object (name, email, role, etc.)
        } catch (error) {
          console.error(
            "Failed to fetch user profile, token might be invalid.",
            error
          );
          // If the token is invalid, log the user out
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      } else {
        // Ensure no auth header is present if there's no token
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await axios.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token); // This will trigger the useEffect to fetch the profile
  };

  const sendOtp = async (email) => {
    await axios.post("/auth/send-otp", { email });
  };

  const verifyOtpAndRegister = async (name, email, password, otp, role) => {
    const { data } = await axios.post("/auth/verify-otp", {
      name,
      email,
      password,
      otp,
      role,
    });
    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  // --- NEW FUNCTION: Send OTP for password reset ---
  const sendPasswordOtp = async () => {
    // No email is needed because the backend knows who the user is from the token
    await axios.post("/users/profile/send-password-otp");
  };

  // --- NEW FUNCTION: Update the user's password ---
  const updatePassword = async (passwordData) => {
    // passwordData will be an object like { oldPassword, newPassword } or { otp, newPassword }
    await axios.put("/users/profile/update-password", passwordData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8888/api/v1/auth/google";
  };

  // --- NEW ---
  const forgotPassword = async (email) => {
    await axios.post("/auth/forgot-password", { email });
  };

  // --- NEW ---
  const resetPassword = async (email, otp, password) => {
    await axios.post("/auth/reset-password", { email, otp, password });
  };

  const value = {
    user,
    setUser, // Expose setUser to allow components like the profile modal to update the context
    token,
    setToken,
    loading,
    login,
    sendOtp,
    verifyOtpAndRegister,
    logout,
    handleGoogleLogin,
    sendPasswordOtp,
    updatePassword,
    forgotPassword, // <-- Expose the new function
    resetPassword, // <-- Expose the new function
  };

  // Render children only when the initial loading is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
