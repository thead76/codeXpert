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

  // Set the base URL for all API requests using the environment variable
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        // Set the auth header for all subsequent requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          // Fetch the full user profile from the backend
          const { data } = await axios.get("/users/profile");
          setUser(data);
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
    setToken(data.token);
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

  const sendPasswordOtp = async () => {
    await axios.post("/users/profile/send-password-otp");
  };

  const updatePassword = async (passwordData) => {
    await axios.put("/users/profile/update-password", passwordData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const handleGoogleLogin = () => {
    // Construct the correct Google Login URL
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const forgotPassword = async (email) => {
    await axios.post("/auth/forgot-password", { email });
  };

  const resetPassword = async (email, otp, password) => {
    await axios.post("/auth/reset-password", { email, otp, password });
  };

  const value = {
    user,
    setUser,
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
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
