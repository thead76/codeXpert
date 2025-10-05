import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { token } = useAuth();

  // If there is a token (user is logged in), render the child route using <Outlet />.
  // The <Outlet /> component from react-router-dom is the placeholder for
  // whatever nested route is matched (e.g., /dashboard or /my-team).
  if (token) {
    return <Outlet />;
  }

  // If there is no token, redirect the user to the homepage.
  return <Navigate to="/" replace />;
};

export default ProtectedRoute;
