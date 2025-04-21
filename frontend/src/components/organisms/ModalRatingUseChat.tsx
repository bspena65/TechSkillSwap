import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import ReactStars from "react-stars";
import axiosInstance from "../../services/api";

interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
  chatID: number; // ID del usuario o entidad a calificar
  userID: number; // ID del usuario o entidad a calificar
  ownerCalification?: number; // Calificación del dueño del chat
}

interface FormValues {
  rating: number;
  comment: string;
}

export const ModalRatingUseChat = ({
  isOpen,
  onClose,
  chatID,
  userID,
  ownerCalification,
}: ModalProfileProps) => {
  const [showModal, setShowModal] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      rating: 0.5, // Establecer valor inicial a 0.5
    },
  });

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

  const validateRating = (value: number) => {
    if (value && value >= 1) {
      return true;
    }
    return "Debes seleccionar al menos una estrella";
  };

  const onSubmit = async (data: FormValues) => {
    const isRatingValid = await trigger("rating");

    if (!isRatingValid) return;

    const rta = {
      rate: data.rating,
      message: data.comment,
      chatID: chatID,
      userID: userID,
      ownerCalificate: { id: ownerCalification },
      calificator: { id: userID },
    };

    console.log("Calificación a enviar:", rta);

    try {
      // Realiza la solicitud POST utilizando la instancia de axios configurada
      await axiosInstance.post("/rating", rta);

      // Resetear el formulario después de enviarlo
      reset({ rating: 1, comment: "" });
      closeWithAnimation();
    } catch (error) {
      console.error("Error al crear la calificación:", error);
    } finally {
      window.location.href = "/dash/messages";
    }
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
              <h2 className="text-center text-3xl font-bold mb-2">
                Calificar usuario
              </h2>

              <div className="bg-transparent px-4 shadow-inner flex-1 max-h-[320px] overflow-auto">
                {/* Estrellas de calificación */}
                <div className="flex justify-center mb-4">
                  <ReactStars
                    count={5}
                    size={36}
                    half={true}
                    value={getValues("rating")}
                    onChange={(value) => {
                      setValue("rating", value);
                      trigger("rating");
                    }}
                    color2={"#ffd700"}
                  />
                </div>
                <input
                  type="hidden"
                  {...register("rating", {
                    validate: validateRating,
                  })}
                />
                {errors.rating && (
                  <p className="text-red-500 text-center">
                    {errors.rating.message}
                  </p>
                )}

                {/* Comentario */}
                <textarea
                  {...register("comment", {
                    required: "El comentario es obligatorio",
                  })}
                  placeholder="Escribe un comentario..."
                  className="w-full p-2 border border-black rounded-lg bg-transparent"
                  rows={4}
                ></textarea>
                {errors.comment && (
                  <p className="text-red-500">{errors.comment.message}</p>
                )}
              </div>

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
                  Calificar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("modalPortal") as HTMLElement
  );
};
