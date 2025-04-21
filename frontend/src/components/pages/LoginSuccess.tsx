import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../state/authStore";
import axiosInstance from "../../services/api"; // Asegúrate de que axios esté correctamente configurado

const LoginSuccess: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    // Obtener el token de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Hacer una solicitud al backend para obtener los datos del usuario
      const fetchUser = async () => {
        try {
          const response = await axiosInstance.get("/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const user = response.data;

          // Autenticar al usuario en el estado
          login(user, token);

          // Redirigir al dashboard
          navigate("/dash/home");
        } catch (error) {
          console.error("Error fetching user:", error);
          // En caso de error, redirigir al login
          navigate("/auth/login");
        }
      };

      fetchUser();
    } else {
      // Si no hay token, redirigir al login
      navigate("/auth/login");
    }
  }, [navigate, login]);

  return <div>Autenticando...</div>;
};

export default LoginSuccess;
