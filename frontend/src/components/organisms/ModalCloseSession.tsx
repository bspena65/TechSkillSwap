import React, { useState, useEffect } from "react";
import AlertCircle from "../../assets/icons/alert-circle-outline.svg";
import { useAuthStore } from "../../state/authStore";
import { useNavigate } from "react-router-dom";

interface ModalCloseSessionProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalCloseSession = ({
  isOpen,
  onClose,
}: ModalCloseSessionProps) => {
  const [showModal, setShowModal] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const { logout } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      setIsClosing(false);
    } else {
      setIsClosing(true);
      setTimeout(() => setShowModal(false), 200); // Close animation duration
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeWithAnimation();
    }
  };

  const closeWithAnimation = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 200); // Close animation duration
  };

  const handleConfirm = () => {
    logout();
    navigate("/");
  };

  // Close modal on "Escape" key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeWithAnimation();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      {showModal && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-40 z-10 animate-fast ${
            isClosing ? "animate__fadeOut" : "animate__fadeIn"
          }`}
          onClick={handleOverlayClick}
        >
          <div
            className={`bg-[#D9D9D9] flex items-center flex-col border-2 border-black px-4 py-3 rounded-2xl shadow-lg w-full max-w-lg animate__animated animate-fast ${
              isClosing ? "animate__zoomOut" : "animate__zoomIn"
            }`}
          >
            <img
              src={AlertCircle}
              alt="Inicio"
              className="mr-2 w-[140px] h-[140px]"
            />
            <h2 className="text-[36px] text-black">Cierre de Sesión</h2>
            <p className="text-[20px] text-center" style={{ color: "#16191C" }}>
              Si deseas salir haz clic en Aceptar o en Cancelar para continuar
              trabajando
            </p>

            {/* Botones */}
            <div className="flex justify-center my-4">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 bg-black text-white px-4 py-2 rounded-lg min-w-[180px] text-[20px]"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                type="submit"
                className="gradient-background-azulfeo text-white px-4 py-2 rounded-lg min-w-[180px] text-[20px]"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
