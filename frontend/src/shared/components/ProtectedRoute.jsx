import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuthContext();

  if (loading) return <div>Loading...</div>;
  if (!user || (requiredRole && user.role !== requiredRole)) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;