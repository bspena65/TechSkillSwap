import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/api";
import { useAuthStore } from "../../state/authStore";

interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalRating = ({
  isOpen,
  onClose,
  children,
}: ModalProfileProps) => {
  const [showModal, setShowModal] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);


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
            className={`bg-[white] border-2 border-black p-6 m-4 rounded-2xl shadow-lg w-full max-w-2xl animate__animated animate-fast ${
              isClosing ? "animate__zoomOut" : "animate__zoomIn"
            }`}
          >
            <div className="m-4">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};
