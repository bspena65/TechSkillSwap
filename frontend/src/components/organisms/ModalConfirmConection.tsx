import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useProfileStore } from "../../state/useProfileStore";
import { FriendRequestStatus } from "../../interfaces/models/FriendRequestStatus";
import { useUIConfigStore } from "../../state/uiConfig";
import axiosInstance from "../../services/api";

interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
  updateFriendRequest?: (id: number, data: any) => Promise<void>;
  IDfriendRequest: number;
  userID: number;
}

interface FormValues {
  skill: string;
}

export const ModalConfirmConnection = ({
  isOpen,
  onClose,
  updateFriendRequest,
  IDfriendRequest,
  userID,
}: ModalProfileProps) => {
  const [showModal, setShowModal] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const { fetchUserSkills, userSkills } = useProfileStore();
  const { showNotification } = useUIConfigStore();
  const [nameUser, setNameUser] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchUserSkills(userID);
    }
  }, [isOpen]);

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

  // ToDO: Here there are multiple requests
  useEffect(() => {
    if (userID) {
      axiosInstance.get(`users/getById/${userID}`).then((response) => {
        setNameUser(
          `${response.data.user.firstName} ${response.data.user.lastName}`
        );
      });
    }
    return () => {
      setNameUser("");
    };
  }, [userID, isOpen]);

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
      status: FriendRequestStatus.ACCEPTED,
      skillReceiver: data.skill,
      message: "Solicitud aceptada exitosamente",
      responseAt: new Date().toISOString(),
    };

if (updateFriendRequest) {
  try {
    await updateFriendRequest(IDfriendRequest, rta);
    showNotification(
      "Notificación",
      "Se acepta exitosamente la solicitud de conexión."
    );
  } catch (error) {
    console.error("Error al aceptar la solicitud:", error);
    showNotification("Error", "No se pudo aceptar la solicitud.");
  } finally {
    onClose();
  }}
  };

  return (
    <>
      {showModal && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-40 z-10 animate-fast`}
          onClick={handleOverlayClick}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        >
          <div
            className={`bg-[#BFBFBF] border-2 border-[#2A49FF] py-4 px-6 rounded-2xl shadow-lg w-full max-w-2xl animate__animated animate-fast ${
              isClosing ? "animate__zoomOut" : "animate__zoomIn"
            }`}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="">
              <h2 className="text-center text-3xl font-bold mb-4">
                Confirmación de conexión
              </h2>
              <p className="mb-4 font-light text-xl">
                Estás a un paso de aceptar la solicitud de conexión.
              </p>
              <p className="mb-4 font-light text-xl">
                <b className="font-bold">{nameUser}</b> cuentas con las
                siguientes habilidades:
              </p>
              <p className="mb-4 font-light text-xl">
                Selecciona una de ellas y haz clic en{" "}
                <b className="font-bold">'Aceptar'</b>. Si prefieres no
                continuar, simplemente haz clic en{" "}
                <b className="font-bold">'Cerrar'</b>
              </p>

              {/* Flexbox container for the white box and buttons */}
              <div className="flex space-x-6 items-center mt-5">
                {/* White box containing the skills and checkboxes */}
                <div className="bg-[#f2f2f2] p-4 rounded-xl shadow-inner flex-1 border border-black max-h-[200px] overflow-auto">
                  <section className="space-y-3">
                    {userSkills.map((skill) => (
                      <label
                        key={skill.id}
                        className="flex items-center space-x-3 border border-black rounded-lg  px-2 py-1"
                      >
                        <input
                          type="radio"
                          value={skill.skill?.id}
                          {...register("skill", { required: true })}
                          className="appearance-none h-6 w-6 border-2 border-black rounded-[6px] checked:bg-[#2A49FF] transition duration-200"
                        />
                        <span className="text-black">
                          {skill.skill?.skillName}
                        </span>
                      </label>
                    ))}
                    {errors.skill && (
                      <p className="text-red-500 text-sm mt-1">
                        Por favor selecciona una habilidad
                      </p>
                    )}
                  </section>
                </div>

                {/* Buttons in a vertical column */}
                <div className="flex flex-col space-y-2">
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
                    Aceptar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
