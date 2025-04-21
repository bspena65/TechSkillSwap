import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../state/authStore";

interface PublicRouteProps {
  children: JSX.Element;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Si el usuario ya está autenticado, redirige al dashboard
  return isAuthenticated ? <Navigate to="/dash/home" /> : children;
};

export default PublicRoute;
