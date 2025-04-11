import { create } from "zustand";

// Tipado para el estado del store
interface UIConfigState {
  isDisabledFooter: boolean;
  getIsDisabledFooter: () => boolean;
  toggleDisabledFooter: () => void;
  setDisabledFooter: (value: boolean) => void;
  clearDisabledFooter: () => void;

  // Notificación
  notification: {
    isVisible: boolean;
    title: string;
    subtitle: string;
    type?: 'normal' | 'error';
  };
  showNotification: (title: string, subtitle: string, type?:'normal' | 'error') => void;
  hideNotification: () => void;
}

// Función para obtener el estado de localStorage
const getLocalStorage = (key: string, initialValue: boolean): boolean => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(error);
    return initialValue;
  }
};

// Función para guardar el estado en localStorage
const setLocalStorage = (key: string, value: boolean): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};

export const useUIConfigStore = create<UIConfigState>((set) => ({
  // Estado inicial del footer
  isDisabledFooter: getLocalStorage("isDisabledFooter", false),

  // Métodos para el footer
  getIsDisabledFooter: () => getLocalStorage("isDisabledFooter", false),
  toggleDisabledFooter: () =>
    set((state) => {
      const newValue = !state.isDisabledFooter;
      setLocalStorage("isDisabledFooter", newValue);
      return { isDisabledFooter: newValue };
    }),
  setDisabledFooter: (value: boolean) =>
    set(() => {
      setLocalStorage("isDisabledFooter", value);
      return { isDisabledFooter: value };
    }),
  clearDisabledFooter: () =>
    set(() => {
      window.localStorage.removeItem("isDisabledFooter");
      return { isDisabledFooter: false };
    }),

  // Estado inicial para la notificación
  notification: {
    isVisible: false,
    title: "",
    subtitle: "",
  },

  // Mostrar notificación
  showNotification: (title: string, subtitle: string, type = "normal") =>
    set(() => ({
      notification: {
        isVisible: true,
        title,
        subtitle,
        type
      },
    })),

  // Ocultar notificación
  hideNotification: () =>
    set(() => ({
      notification: {
        isVisible: false,
        title: "",
        subtitle: ""
      },
    })),
}));
