import create from "zustand";
import axios from "axios";

interface Meeting {
  id?: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  meet_link?: string;
  status: string;
  organizerId?: number;
  chatId?: number;
}

interface MeetingStore {
  meetings: Meeting[];
  meeting?: Meeting;
  loading: boolean;
  error?: string;

  // Actions
  createMeeting: (meetingData: Partial<Meeting>) => Promise<void>;
  getAllMeetings: () => Promise<void>;
  getMeetingById: (id: number) => Promise<void>;
  updateMeeting: (id: number, updatedData: Partial<Meeting>) => Promise<void>;
  deleteMeeting: (id: number) => Promise<void>;
  getMeetingsByUserId: (userId: number) => Promise<void>;
  getMeetingsByChatId: (chatId: number) => Promise<void>;
}

export const useMeetingStore = create<MeetingStore>((set) => ({
  meetings: [],
  meeting: undefined,
  loading: false,
  error: undefined,

  // Crear una nueva reunión
  createMeeting: async (meetingData: Partial<Meeting>) => {
    set({ loading: true, error: undefined });
    try {
      const response = await axios.post("/meetings", meetingData);
      set((state) => ({
        meetings: [...state.meetings, response.data],
        loading: false,
      }));
    } catch (error) {
      set({
        loading: false,
        error: "Error al crear la reunión",
      });
    }
  },

  // Obtener todas las reuniones
  getAllMeetings: async () => {
    set({ loading: true, error: undefined });
    try {
      const response = await axios.get("/meetings");
      set({ meetings: response.data, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: "Error al obtener las reuniones",
      });
    }
  },

  // Obtener una reunión por ID
  getMeetingById: async (id: number) => {
    set({ loading: true, error: undefined });
    try {
      const response = await axios.get(`/meetings/${id}`);
      set({ meeting: response.data, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: "Error al obtener la reunión",
      });
    }
  },

  // Actualizar una reunión por ID
  updateMeeting: async (id: number, updatedData: Partial<Meeting>) => {
    set({ loading: true, error: undefined });
    try {
      const response = await axios.put(`/meetings/${id}`, updatedData);
      set((state) => ({
        meetings: state.meetings.map((m) => (m.id === id ? response.data : m)),
        loading: false,
      }));
    } catch (error) {
      set({
        loading: false,
        error: "Error al actualizar la reunión",
      });
    }
  },

  // Eliminar una reunión por ID
  deleteMeeting: async (id: number) => {
    set({ loading: true, error: undefined });
    try {
      await axios.delete(`/meetings/${id}`);
      set((state) => ({
        meetings: state.meetings.filter((m) => m.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        loading: false,
        error: "Error al eliminar la reunión",
      });
    }
  },

  // Buscar reuniones por userId (organizador)
  getMeetingsByUserId: async (userId: number) => {
    set({ loading: true, error: undefined });
    try {
      const response = await axios.get(`/meetings/user/${userId}`);
      set({ meetings: response.data, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: "Error al obtener reuniones por usuario",
      });
    }
  },

  // Buscar reuniones por chatId
  getMeetingsByChatId: async (chatId: number) => {
    set({ loading: true, error: undefined });
    try {
      const response = await axios.get(`/meetings/chat/${chatId}`);
      set({ meetings: response.data, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: "Error al obtener reuniones por chat",
      });
    }
  },
}));
