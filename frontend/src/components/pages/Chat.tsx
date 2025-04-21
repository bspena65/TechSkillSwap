import LogoChats from "../../assets/icons/msgBlack.svg";
import CalendarIcon from "../../assets/icons/calendar.svg";
import SendIcon from "../../assets/icons/send.svg";
import Chatbubbles from "../../assets/icons/chatbubbles-sharp.svg";
import { Link, useParams } from "react-router-dom";
import { useAuthStore } from "../../state/authStore";
import { Message, useChatStore } from "../../state/useChatStore";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useSocketStore from "../../state/useSocketStore";
import { ModalCreateMeeting } from "../organisms/ModalCreateMeeting";
import axiosInstance from "../../services/api";
import { DateTime } from "luxon"; // Para formatear fechas
import { ModalRatingUseChat } from "../organisms/ModalRatingUseChat";

interface FormData {
  message: string;
}

export default function Chat() {
  const { id: chatID } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { messages, fetchMessagesByChatId, saveMessage } = useChatStore();
  const { socket } = useSocketStore();
  const [isOpenModalCreateMeeting, setIsOpenModalCreateMeeting] =
    useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chatDetails, setChatDetails] = useState<any>(null);
  const [showTooltip, setShowTooltip] = useState(false); // Tooltip para el título
  const [isOpenRatingModal, setIsOpenRatingModal] = useState(false);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Obtener los detalles del chat y setear el estado
  useEffect(() => {
    const getChatByID = async () => {
      const response = await axiosInstance.get(`/chats/getChatByID/${chatID}`);
      setChatDetails(response.data.chat); // Guardar los detalles del chat correctamente
    };
    getChatByID();
  }, [chatID]);

  // Desplazar hacia abajo cuando cambian los mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { register, handleSubmit, reset } = useForm<FormData>();

  // Cargar mensajes al montar el componente
  useEffect(() => {
    if (chatID) fetchMessagesByChatId(+chatID);
  }, [chatID]);

  // Unirse a la sala del chat y escuchar nuevos mensajes
  useEffect(() => {
    if (chatID && socket) {
      socket.emit("join-chat", { chatId: chatID, userId: user?.id });
      socket.on("new-message", () => {
        fetchMessagesByChatId(+chatID);
      });
    }

    // Limpiar el evento cuando el componente se desmonte
    return () => {
      socket?.off("new-message");
    };
  }, [chatID, socket]);

  // Función para manejar el envío del mensaje
  const onSubmit = (data: { message: string }) => {
    const message = {
      chatId: +chatID!,
      userId: user?.id,
      content: data.message,
    } as Message;
    saveMessage(message);
    reset(); // Limpiar el campo de texto
  };

  // Determinar si el usuario es el receptor
  const isReceiver = chatDetails?.receiver.id === user?.id;

  // Obtener la habilidad correcta
  const skill = isReceiver
    ? chatDetails?.skillReceiver?.skillName
    : chatDetails?.skillSender?.skillName;

  const oppositeSkill = isReceiver
    ? chatDetails?.skillSender?.skillName // Habilidad del remitente (otro)
    : chatDetails?.skillReceiver?.skillName;

  // Formatear la fecha de creación usando Luxon
  const formatDate = (dateString: string) => {
    return DateTime.fromISO(dateString)
      .setLocale("es")
      .toFormat("MMMM d, yyyy");
  };

  // Determinar si el nombre es del usuario actual y mostrar "(Tú)"
  const formatName = (
    person: { firstName: string; lastName: string },
    isCurrentUser: boolean
  ) => {
    return `${person.firstName} ${person.lastName} ${
      isCurrentUser ? "(Tú)" : ""
    }`;
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto px-4 animate__animated animate__fadeIn animate__faster overflow-hidden">
      {/* Encabezado */}
      <section className="flex flex-col items-center justify-center mb-4">
        <h1 className="text-4xl font-semibold text-center mb-4">
          Chats
          <img
            src={LogoChats}
            alt="logo msg"
            className="w-9 h-9 mx-4 inline-block"
          />
        </h1>
        <div className="bg-black h-[2px] w-[90%]"></div>
      </section>

      <ModalCreateMeeting
        isOpen={isOpenModalCreateMeeting}
        onClose={() => setIsOpenModalCreateMeeting(false)}
        chatId={+chatID!}
        requestMail={chatDetails?.receiver.email}
      />
      <ModalRatingUseChat
        isOpen={isOpenRatingModal}
        onClose={() => setIsOpenRatingModal(false)}
        chatID={+chatID!}
        userID={+user?.id!}
        ownerCalification={chatDetails?.receiver.id}
      />
      {/* Contenedor del chat */}
      <div className="flex flex-col justify-between h-[84%] overflow-hidden">
        {/* Encabezado del chat */}
        <div
          className="flex items-center justify-center p-2 border border-gray-950 rounded-t-lg relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <img
            src={Chatbubbles}
            alt="icono de chat"
            className="w-6 h-6 text-blue-600 mr-2"
          />
          <h2 className="text-xl font-semibold text-center">
            {skill} {/* Mostrar la habilidad correcta */}
          </h2>

          {/* Tooltip */}
          {showTooltip && chatDetails && (
            <div className="absolute top-12 bg-[#D9D9D9] border-2 border-[#2A49FF] p-2  rounded-lg shadow-lg">
              <p>
                <strong>Remitente:</strong>{" "}
                {formatName(
                  chatDetails.sender,
                  chatDetails.sender.id === user?.id
                )}
              </p>
              <p>
                <strong>Receptor:</strong>{" "}
                {formatName(
                  chatDetails.receiver,
                  chatDetails.receiver.id === user?.id
                )}
              </p>
              <p>
                <strong>Habilidad solicitada:</strong> {oppositeSkill}
              </p>
              <p>
                <strong>Fecha de creación:</strong>{" "}
                {formatDate(chatDetails.createdAt)}
              </p>
              <p>
                <strong>Estado:</strong> {chatDetails.status}
              </p>
            </div>
          )}
        </div>

        {/* Área de conversación */}
        <div className="flex-grow border border-gray-950 p-4 overflow-auto">
          <div className="flex flex-col space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message?.sender!.id! === user?.id && "justify-end"
                }`}
              >
                <div
                  className={`${
                    message?.sender!.id! === user?.id
                      ? "gradient-background-azulfeo text-white "
                      : "bg-gray-200 text-black "
                  }  px-4 py-2 rounded-lg max-w-xs`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
        </div>

        {/* Input de mensaje y botones */}
        <form
          className="flex items-center p-2 bg-[#D9D9D9] border border-gray-950 rounded-b-lg"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            autoCorrect="off"
            autoComplete="off"
            type="text"
            placeholder="Escribe un mensaje"
            className="flex-grow p-2 border border-gray-300 rounded-lg outline-none focus:bg-white focus:border-blue-500"
            {...register("message", { required: true })}
          />
          {/* Botón del calendario solo si el usuario no es el receptor */}
          {!isReceiver && (
            <button
              type="button"
              className="mx-2"
              onClick={() => setIsOpenModalCreateMeeting(true)}
            >
              <img src={CalendarIcon} alt="calendario" className="w-6 h-6" />
            </button>
          )}
          <button type="submit" className="p-2 text-white rounded-lg">
            <img src={SendIcon} alt="send" className="w-6 h-6" />
          </button>
        </form>
      </div>

      {/* Botón de Volver */}
      <div className="flex justify-end mt-4 gap-3">
        <button
          onClick={() => setIsOpenRatingModal(true)}
          className="px-4 py-2 gradient-background-azulfeo text-white rounded-lg"
        >
          Terminar Chat
        </button>
        <Link
          to={"/dash/messages"}
          className="px-4 py-2 gradient-background-azulfeo text-white rounded-lg"
        >
          Volver
        </Link>
      </div>
    </div>
  );
}
