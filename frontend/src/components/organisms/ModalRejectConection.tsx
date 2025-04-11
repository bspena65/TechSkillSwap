import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { useUIConfigStore } from "../../state/uiConfig";
import { FriendRequestStatus } from "../../interfaces/models/FriendRequestStatus";

interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
  updateFriendRequest?: (id: number, data: any) => Promise<void>;
  IDfriendRequest: number;
}

const dataReject = [
  "Reputación del usuario",
  "Objetivos de aprendizaje diferentes",
  "Falta de disponibilidad de tiempo",
  "No me interesa las habilidades ofrecidas",
];
interface FormValues {
  reasonRejected: string;
}

export const ModalRejectConection = ({
  isOpen,
  onClose,
  updateFriendRequest,
  IDfriendRequest,
}: ModalProfileProps) => {
  const [showModal, setShowModal] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const { showNotification } = useUIConfigStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      setIsClosing(false);
    } else {
      setIsClosing(true);
      setTimeout(() => setShowModal(false), 200);
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeWithAnimation();
    }
  };

  const closeWithAnimation = () => {
    setIsClosing(true);
    onClose();
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

  const onSubmit = async (data: FormValues) => {
    const rta = {
      status: FriendRequestStatus.REJECTED,
      message: data.reasonRejected,
      responseAt: new Date().toISOString(),
    };

    updateFriendRequest &&
      (await updateFriendRequest(IDfriendRequest, rta).then(() => {
        showNotification(
          "Notificación",
          "Se rechaza exitosamente la solicitud de conexión."
        );
        onClose();
      }));
  };

  const modalContent = (
    <>
      {showModal && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-40 z-10 animate-fast ${
            isClosing ? "animate__fadeOut" : "animate__fadeIn"
          }`}
          onClick={handleOverlayClick}
        >
          <div
            className={`bg-[#bfbfbf] border-2 border-[#2A49FF] p-6 rounded-2xl shadow-lg w-full max-w-md animate__animated animate-fast ${
              isClosing ? "animate__zoomOut" : "animate__zoomIn"
            }`}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="">
              <h2 className="text-center text-3xl font-bold mb-4">
                Rechazo de conexión
              </h2>

              <div className="bg-transparent p-4  shadow-inner flex-1  max-h-[200px] overflow-auto">
                <section className="space-y-2">
                  {dataReject.map((reasonRejected, id) => (
                    <label
                      key={id}
                      className="flex items-center space-x-3 border bg-white border-black rounded-lg  px-2 py-1"
                    >
                      <input
                        type="radio"
                        value={reasonRejected}
                        {...register("reasonRejected", { required: true })}
                        className="appearance-none h-6 w-6 border-2 border-black rounded-[6px] checked:bg-[#2A49FF] transition duration-200"
                      />
                      <span className="text-black">{reasonRejected}</span>
                    </label>
                  ))}
                  {errors.reasonRejected && (
                    <p className="text-red-500 text-sm mt-1">
                      Por favor selecciona una habilidad
                    </p>
                  )}
                </section>
              </div>
              {/* Buttons in a vertical column */}
              <div className="flex flex-row gap-2 justify-center mt-5">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-black text-white px-4 py-2 rounded-lg min-w-[150px]"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#2A49FF] to-[#000AFF] text-white px-4 py-2 rounded-lg min-w-[150px]"
                >
                  Rechazar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  // Usamos ReactDOM.createPortal para renderizar en el div con ID "modalPortal"
  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("modalPortal") as HTMLElement
  );
};
