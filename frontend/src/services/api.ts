import axios from "axios";
import { useUIConfigStore } from "../state/uiConfig";
import { URLBACKEND } from "../config/variables";

// Configuración básica de Axios
const axiosInstance = axios.create({
  baseURL: URLBACKEND + "/api", // Configura la base URL para todas las peticiones
  headers: {
    "Content-Type": "application/json", // Define el tipo de contenido por defecto
  },
});

// Interceptor para agregar el token a cada solicitud
axiosInstance.interceptors.request.use(
  (config) => {
    const authStorage = JSON.parse(
      localStorage.getItem("auth-storage") || "{}"
    );

    // Verificar si existe el token y agregarlo a los encabezados de la solicitud
    if (authStorage.state && authStorage.state.token) {
      config.headers["Authorization"] = `Bearer ${authStorage.state.token}`;
    }

    return config;
  },
  (error) => {
    // Manejo de errores antes de enviar la solicitud
    return Promise.reject(error);
  }
);

// Interceptor para manejar las respuestas
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Usar el store de Zustand para mostrar la notificación
    const { showNotification } = useUIConfigStore.getState();

    // Verificar si no hay token proporcionado
    if (
      error.response &&
      error.response.data.message === "Acceso denegado. Token no proporcionado."
    ) {
      // Mostrar notificación de token no proporcionado
      showNotification("Token no proporcionado", "Por favor inicia sesión.");

      // Borrar el token del localStorage
      localStorage.removeItem("auth-storage");

      // Redirigir a la página principal "/" después de un pequeño delay
      setTimeout(() => {
        window.location.href = "/";
      }, 2000); // 2 segundos de espera antes de redirigir
    }

    // Verificar si el token es inválido
    if (error.response && error.response.data.message === "Token no válido.") {
      // Mostrar notificación de token inválido
      showNotification("Token inválido", "Por favor vuelve a iniciar sesión.");

      // Borrar el token del localStorage
      localStorage.removeItem("auth-storage");

      // Redirigir a la página principal "/" después de un pequeño delay
      setTimeout(() => {
        window.location.href = "/";
      }, 2000); // 2 segundos de espera antes de redirigir
    }

    // Manejo de otros errores
    return Promise.reject(error);
  }
);

export default axiosInstance;
