import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../state/authStore";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, token } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    token: state.token,
  }));

  // Si el usuario no está autenticado, redirige a la página de login
  return isAuthenticated && token ? children : <Navigate to="/auth/login" />;
};

export default PrivateRoute;
