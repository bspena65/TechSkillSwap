import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./state/authStore";
import useSocketStore from "./state/useSocketStore";
import { useEffect } from "react";
import { useUIConfigStore } from "./state/uiConfig";

library.add(fas);

function App() {
  const { isAuthenticated, user } = useAuthStore();
  const { showNotification } = useUIConfigStore();
  const { socket } = useSocketStore();

  useEffect(() => {
    // Unirse a la sala del usuario por su ID
    if (isAuthenticated && user?.id) {
      socket?.emit("joinRoom", user?.id.toString()); // Unirse a la sala con el user.id
    }

    // Limpiar la sala al salir
    return () => {
      if (user?.id) {
        socket?.emit("leaveRoom", user.id); // Abandonar la sala al desmontar el componente
      }
    };
  }, [user?.id]);

  // verificar si el usuario esta autenticado conectarse al socket
  useEffect(() => {
    if (isAuthenticated) {
      const { conectarSocket } = useSocketStore.getState();
      conectarSocket();
    }
  }, [isAuthenticated]);

  // Listen newFriendRequest
  useEffect(() => {
    socket?.on("newFriendRequest", (data) => {
      showNotification("Notificación", data.message);
    });
    return () => {
      socket?.off("newFriendRequest");
    };
  }, [socket]);

  return (
    <>
      <div className="App">
        <AppRoutes />
      </div>
    </>
  );
}

export default App;
