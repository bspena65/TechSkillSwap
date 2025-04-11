import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Home } from "../components/pages/Home";
import { Login } from "../components/pages/Login";
import { Register } from "../components/pages/Register";
import { Dashboard } from "../components/pages/Dashboard";
import { Users } from "../components/pages/Users";
import { Admin } from "../components/pages/Admin";
import PublicRoute from "./PublicRoute"; // Importamos PublicRoute
import PrivateRoute from "./PrivateRoutes";
import LoginSuccess from "../components/pages/LoginSuccess";
import { HomeDash } from "../components/pages/HomeDash";
import { Profile } from "../components/pages/Profile";
import { Search } from "../components/pages/Search";
import { Messages } from "../components/pages/Messages";
import { Notifications } from "../components/pages/Notifications";
import UserProfile from "../components/pages/UserProfile";
import Notificacion from "../components/atoms/Notificacion";
import Chat from "../components/pages/Chat";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Notificacion />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Rutas públicas */}
        <Route
          path="/auth/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/auth/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        
        {/* // Ruta para redireccionar al usuario después de iniciar sesión con éxito */}
        <Route path="/auth/login/success" element={<LoginSuccess />} />

        {/* Rutas protegidas */}
        <Route
          path="/dash/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="home" element={<HomeDash />} />
          <Route path="users" element={<Users />} />
          <Route path="user/:id" element={<UserProfile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="search" element={<Search />} />
          <Route path="messages" element={<Messages />} />
          <Route path="chat/:id" element={<Chat />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="admin" element={<Admin />} />

          {/* Redireccionar cualquier otra ruta a /dash/home */}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
