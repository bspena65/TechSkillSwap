import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { URLBACKEND } from "../config/variables";

interface SocketState {
  socket: Socket | null;
  online: boolean;
  conectarSocket: () => void;
  desconectarSocket: () => void;
}

const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  online: false,

  // Método para conectar el socket
  conectarSocket: () => {
    const authStorage = JSON.parse(
      localStorage.getItem("auth-storage") || "{}"
    );
    const token = authStorage?.state?.token;

    const socket = io(URLBACKEND, {
      transports: ["websocket"],
      forceNew: true,
      autoConnect: true,
      query: {
        "x-token": token,
      },
    });

    socket.on("connect", () => {
      set({ online: true, socket });
      console.info("Socket connected");
    });

    socket.on("disconnect", () => {
      set({ online: false });
      console.info("Socket disconnected");
    });
  },

  // Método para desconectar el socket
  desconectarSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ online: false, socket: null });
      console.info("Socket disconnected manually");
    }
  },
}));

export default useSocketStore;
