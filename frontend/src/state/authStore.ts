import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserResponse } from "../interfaces/User";
import useSocketStore from "./useSocketStore"; // Import the socket store

interface AuthState {
  isAuthenticated: boolean;
  user: UserResponse | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (user, token) => {
        const { conectarSocket } = useSocketStore.getState();
        conectarSocket();
        set({ isAuthenticated: true, user, token });
      },
      logout: () => {
        const { desconectarSocket } = useSocketStore.getState();
        desconectarSocket();
        set({ isAuthenticated: false, user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) =>
          localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
