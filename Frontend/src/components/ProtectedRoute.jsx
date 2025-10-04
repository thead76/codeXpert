import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  // We check for the token, as it's the definitive proof of being logged in.
  const { token } = useAuth();

  // If there's no token, redirect the user to the homepage.
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If a token exists, show the protected content.
  return children;
};

export default ProtectedRoute;
