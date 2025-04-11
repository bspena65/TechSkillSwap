import React, { useEffect, useRef, useState } from "react";
import { useUIConfigStore } from "../../state/uiConfig";
import { useNavigate } from "react-router-dom"; // Importa useNavigate de React Router
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import NotificationSound from "../../assets/audio/alert.wav"; // Importa el archivo de sonido

interface NotificacionProps {
  duration?: number; // Duración en milisegundos (opcional)
  navigateTo?: string; // Ruta opcional para redirigir
}

const Notificacion: React.FC<NotificacionProps> = ({
  duration = 3000,
  navigateTo,
}) => {
  const { notification, hideNotification } = useUIConfigStore((state) => ({
    notification: state.notification,
    hideNotification: state.hideNotification,
  }));

  const { isVisible, title, subtitle, type } = notification;
  const [progressWidth, setProgressWidth] = useState(100); // Estado para controlar la barra de progreso

  const audioRef = useRef<HTMLAudioElement | null>(null); // Crear ref para el audio
  const navigate = useNavigate(); // Hook para navegación

  useEffect(() => {
    if (isVisible) {
      // Reproducir sonido
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error("Error al reproducir el sonido:", error);
        });
      }

      // Resetear la barra de progreso cuando la notificación se muestra
      setProgressWidth(100);

      // Establecer un temporizador para hacer que la notificación desaparezca después del tiempo especificado
      const timeout = setTimeout(() => {
        hideNotification(); // Ocultar notificación después de la duración
      }, duration);

      // Calcular el intervalo para reducir la barra de progreso
      const intervalDuration = duration / 100; // Duración dividida entre 100 pasos para la barra

      // Barra de progreso se va reduciendo con CSS animado
      const interval = setInterval(() => {
        setProgressWidth((prevWidth) => prevWidth - 1); // Reducir la barra cada intervalo
      }, intervalDuration); // Ajustar el intervalo según la duración

      // Limpiar el temporizador y el intervalo cuando el componente se desmonta
      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  }, [isVisible, hideNotification, duration]);

  if (!isVisible) {
    return null; // No mostrar la notificación si no está visible
  }

  return (
    <div
      className={`flex flex-col justify-between 
    items-center z-10 bg-[#999999] border-[6px]  
    border-[#2a4bff] rounded-2xl px-4 pt-3 pb-1 shadow-lg w-[400px] 
    fixed top-4 right-4 animate__animated  animate__slideInDown animate__faster`}
    >
      <div className="flex justify-between items-center w-full">
        {type === "error" && (
          <div className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center">
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="text-gray-200"
            />
          </div>
        )}

        <div>
          <p className="font-bold text-black">{title}</p>
          <p className="text-sm text-black">{subtitle}</p>
        </div>
        <button
          onClick={hideNotification}
          className="text-black ml-4 focus:outline-none"
          aria-label="Cerrar notificación"
        >
          ✕
        </button>
      </div>

      {/* Botón "Ver" solo si existe navigateTo */}
      {navigateTo && (
        <button
          onClick={() => navigate(navigateTo)}
          className="mt-2 text-blue-500 underline"
          aria-label="Ver"
        >
          Ver
        </button>
      )}

      {/* Barra de progreso */}
      <div className="w-full bg-gray-200 h-[0.9px] mt-1">
        <div
          className="gradient-background-azulfeo h-[0.8px]"
          style={{ width: `${progressWidth}%` }} // Controla la barra con el estado
        ></div>
      </div>

      {/* Elemento de audio */}
      <audio ref={audioRef} src={NotificationSound} />
    </div>
  );
};

export default Notificacion;
