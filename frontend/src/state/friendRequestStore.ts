import { create } from "zustand";
import axiosInstance from "../services/api";
import { FriendRequest } from "../interfaces/models/FriendRequest";
import { useUIConfigStore } from "./uiConfig";

interface FriendRequestData {
  status: string;
  message: string;
  responseAt: string;
}
interface FriendRequestState {
  friendRequests: FriendRequest[];
  myfriendRequestsSent: FriendRequest[];
  loading: boolean;
  error: string | null;
  fetchFriendRequests: (page?: number, perPage?: number) => Promise<void>;
  fetchFriendRequestsByReceiverId: (
    receiverId: number,
    page?: number,
    perPage?: number
  ) => Promise<void>;
  fetchFriendRequestsBySenderId: (
    receiverId: number,
    page?: number,
    perPage?: number
  ) => Promise<void>;

  createFriendRequest: (request: Partial<FriendRequest>) => Promise<void>;
  updateFriendRequest: (
    id: number,
    requestData: Partial<FriendRequestData>
  ) => Promise<void>;
  deleteFriendRequest: (id: number) => Promise<void>;
  findRequestById: (id: number) => FriendRequest | undefined;
}

export const useFriendRequestStore = create<FriendRequestState>((set, get) => ({
  friendRequests: [],
  myfriendRequestsSent: [],
  loading: false,
  error: null,

  // Fetch all friend requests with pagination (optional)
  fetchFriendRequests: async (page = 1, perPage = 10) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/friendrequest", {
        params: { page, perPage },
      });

      set({
        friendRequests: response.data.data,
        loading: false,
      });
    } catch (error) {
      set({ error: "Error fetching friend requests", loading: false });
    }
  },

  // Fetch friend requests by receiverId with pagination (optional)
  fetchFriendRequestsByReceiverId: async (
    receiverId: number,
    page = 1,
    perPage = 10
  ) => {
    set({ loading: true });
    const { showNotification } = useUIConfigStore.getState();
    try {
      const response = await axiosInstance.get(
        `/friendrequest/receiver/${receiverId}`,
        {
          params: { page, perPage },
        }
      );
      set({
        friendRequests: response.data.data,
        loading: false,
      });

      // showNotification("Notificación", "Solicitudes de conexión cargadas.");
    } catch (error) {
      set({
        error: "Error fetching friend requests by receiverId",
        loading: false,
      });
      showNotification(
        "Error",
        "Error al cargar las solicitudes recibidas",
        "error"
      );
    }
  },

  fetchFriendRequestsBySenderId: async (
    senderId: number,
    page = 1,
    perPage = 10
  ) => {
    set({ loading: true });
    const { showNotification } = useUIConfigStore.getState();
    try {
      const response = await axiosInstance.get(
        `/friendrequest/sender/${senderId}`,
        {
          params: { page, perPage },
        }
      );
      set({
        myfriendRequestsSent: response.data.data,
        loading: false,
      });

      // showNotification("Notificación", "Solicitudes de conexión cargadas.");
    } catch (error) {
      set({
        error: "Error fetching friend requests by Sender ID",
        loading: false,
      });
      showNotification(
        "Error",
        "Error al cargar las mis solicitudes de conexión.",
        "error"
      );
    }
  },
  // Create a new friend request
  createFriendRequest: async (request: Partial<FriendRequest>) => {
    set({ loading: true });
    const { showNotification } = useUIConfigStore.getState();
    try {
      const response = await axiosInstance.post("/friendrequest", request);
      set((state) => ({
        friendRequests: [...state.friendRequests, response.data],
        loading: false,
      }));

      showNotification("Notificación", "Solicitud de conexión enviada.");
    } catch (error) {
      set({ error: "Error creating friend request", loading: false });
      showNotification(
        "Error",
        "Error al enviar la solicitud de conexión.",
        "error"
      );
    }
  },

  // Update an existing friend request
  updateFriendRequest: async (
    id: number,
    requestData: Partial<FriendRequestData>
  ) => {
    set({ loading: true });
    const { showNotification } = useUIConfigStore.getState();
    try {
      const newConection = await axiosInstance.put(
        `/friendrequest/${id}`,
        requestData
      );

      set((state) => ({
        friendRequests: state.friendRequests.map((req) =>
          req.id === id ? newConection.data : req
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Error updating friend request", loading: false });
      showNotification(
        "Error",
        "Error al actualizar la solicitud de conexión.",
        "error"
      );
    }
  },

  // Delete a friend request
  deleteFriendRequest: async (id: number) => {
    set({ loading: true });
    const { showNotification } = useUIConfigStore.getState();
    try {
      await axiosInstance.delete(`/friendrequest/${id}`);
      set((state) => ({
        friendRequests: state.friendRequests.filter((req) => req.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Error deleting friend request", loading: false });
      showNotification(
        "Error",
        "Error al eliminar la solicitud de conexión.",
        "error"
      );
    }
  },

  // Find a friend request by ID
  findRequestById: (id: number) => {
    const { friendRequests } = get();
    return friendRequests.find((request) => request.id === id);
  },
}));
