import LogoMsg from "../../assets/icons/msgBlack.svg";
import Chatbubbles from "../../assets/icons/chatbubbles-sharp.svg";
import { useAuthStore } from "../../state/authStore";
import { Chat, useChatStore } from "../../state/useChatStore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import ReactStars from "react-stars";
import { ModalRatingUseChat } from "../organisms/ModalRatingUseChat";

// Formatear la fecha en español usando Luxon
const formatDateInSpanish = (dateString: string): string => {
  const date = DateTime.fromISO(dateString);
  if (!date.isValid) return "FECHA NO VÁLIDA";
  return date.setLocale("es").toFormat("MMMM d 'del' yyyy");
};

export const Messages = () => {
  const { chats, fetchChatsByUserId, error, loading } = useChatStore();
  const { user } = useAuthStore();

  // Estado para controlar el tooltip del icono Chatbubbles
  const [showTooltipChatbubble, setShowTooltipChatbubble] = useState<{
    [key: number]: boolean;
  }>({});
  // Estado para controlar el tooltip de las estrellas
  const [showTooltipStars, setShowTooltipStars] = useState<{
    [key: number]: boolean;
  }>({});

  const [isOpenRatingModal, setIsOpenRatingModal] = useState(false);
  const [IdsParaRating, setIdParaRating] = useState({
    chatId: 0,
    userId: 0,
  });

  useEffect(() => {
    fetchChatsByUserId(user?.id!);
  }, []);

  // Verificar si yo soy el que envió la solicitud
  const isSender = (chat: Chat) => {
    return chat.friendRequest?.sender.id === user?.id;
  };

  // Obtener el nombre completo del remitente y receptor
  const getChatParticipants = (chat: Chat) => {
    const senderName = isSender(chat)
      ? "YO"
      : `${chat.friendRequest?.sender.firstName} ${chat.friendRequest?.sender.lastName}`;
    const receiverName = isSender(chat)
      ? `${chat.friendRequest?.receiver.firstName} ${chat.friendRequest?.receiver.lastName}`
      : "YO";
    return { senderName, receiverName };
  };

  // Mostrar/ocultar tooltip del icono Chatbubbles
  const handleMouseEnterChatbubble = (chatId: number) => {
    setShowTooltipChatbubble((prev) => ({ ...prev, [chatId]: true }));
  };

  const handleMouseLeaveChatbubble = (chatId: number) => {
    setShowTooltipChatbubble((prev) => ({ ...prev, [chatId]: false }));
  };

  // Mostrar/ocultar tooltip de las estrellas
  const handleMouseEnterStars = (chatId: number) => {
    setShowTooltipStars((prev) => ({ ...prev, [chatId]: true }));
  };

  const handleMouseLeaveStars = (chatId: number) => {
    setShowTooltipStars((prev) => ({ ...prev, [chatId]: false }));
  };

  if (loading) {
    return <p>Cargando...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-2 animate__animated animate__fadeIn animate__faster">
      <section className="flex flex-col items-center justify-center mb-4">
        <h1 className="text-4xl font-semibold text-center mb-4">
          Chats
          <img
            src={LogoMsg}
            alt="logo msg"
            className="w-9 h-9 mx-4 inline-block"
          />
        </h1>
        <div className="bg-black h-[2px] w-[90%]"> </div>
      </section>

      <section>
        {chats.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <div className="bg-[#D9D9D9] w-full px-2 py-1 cursor-pointer rounded-md mb-4 border border-black">
              <h2 className="text-xl font-semibold text-center">
                No tienes Chats
              </h2>
            </div>
          </div>
        )}

        {chats.length > 0 &&
          chats.map((chat) => {
            const { senderName, receiverName } = getChatParticipants(chat);
            const skill = isSender(chat)
              ? chat.friendRequest?.skillSender.skillName
              : chat.friendRequest?.skillReceiver.skillName;

            const oppositeSkill = !isSender(chat)
              ? chat.friendRequest?.skillSender.skillName
              : chat.friendRequest?.skillReceiver.skillName;

            return (
              <div
                key={chat.id}
                className="flex flex-row items-center justify-between w-full mb-4 bg-[#D9D9D9] px-4 py-1 border border-black rounded-md"
              >
                <section className="flex flex-row items-center justify-center">
                  <div
                    className="relative flex items-center mt-2"
                    onMouseEnter={() => handleMouseEnterChatbubble(chat.id)}
                    onMouseLeave={() => handleMouseLeaveChatbubble(chat.id)}
                  >
                    <img
                      src={Chatbubbles}
                      alt="Chatbubbles"
                      className="w-9 h-9 cursor-pointer"
                    />

                    {/* Tooltip solo visible al pasar el mouse sobre el icono */}
                    {showTooltipChatbubble[chat.id] && (
                      <div className="absolute w-[250px] top-0 left-12 bg-[#bfbfbf] border-2 border-[#2A49FF] text-black text-sm p-2 rounded-md shadow-md z-10">
                        <p>
                          <strong>Remitente:</strong> {senderName}
                        </p>
                        <p>
                          <strong>Receptor:</strong> {receiverName}
                        </p>
                        <p>
                          <strong>Habilidad solicitada:</strong> {oppositeSkill}
                        </p>
                        <p>
                          <strong>Fecha de creación:</strong> {/* @ts-ignore */}
                          {formatDateInSpanish(chat.createdAt)}
                        </p>
                        <p>
                          <strong>Estado:</strong> {chat.status}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Mensaje que cambia según si soy el remitente o receptor */}
                  <h2 className="text-2xl font-semibold ml-4">{skill}</h2>
                </section>

                {/* Botón para abrir el chat o mostrar las estrellas con tooltip */}
                <div className="flex">
                  {chat.ratings.every((rating) => !rating.rating) ? (
                    <Link
                      to={`/dash/chat/${chat.id}`}
                      className="px-4 py-2 gradient-background-azulfeo text-white rounded-lg"
                    >
                      Ir al Chat
                    </Link>
                  ) : (
                    <>
                      {chat.ratings.map((rating, index) => {
                        // Si soy yo quien ha dado la calificación
                        if (rating.userId === user?.id) {
                          return (
                            <div key={index}>
                              <ModalRatingUseChat
                                isOpen={isOpenRatingModal}
                                onClose={() => setIsOpenRatingModal(false)}
                                chatID={IdsParaRating.chatId}
                                userID={IdsParaRating.userId}
                                ownerCalification={
                                  chat.friendRequest?.sender.id
                                }
                              />

                              {rating.rating ? (
                                <div
                                  className="relative flex justify-center items-center cursor-pointer"
                                  onMouseEnter={() =>
                                    handleMouseEnterStars(chat.id)
                                  }
                                  onMouseLeave={() =>
                                    handleMouseLeaveStars(chat.id)
                                  }
                                >
                                  ({+rating.rating.rate})
                                  <ReactStars
                                    count={5}
                                    className="cursor-pointer"
                                    value={+rating.rating.rate}
                                    size={24}
                                    edit={false} // Solo lectura
                                  />
                                  {/* Tooltip para el mensaje de calificación de las estrellas */}
                                  {showTooltipStars[chat.id] && (
                                    <div className="absolute top-10 left-0 bg-[#bfbfbf] border-2 border-[#2A49FF] text-black text-sm p-2 rounded-md shadow-md z-10">
                                      <p>
                                        <strong>Tú Calificaión:</strong>{" "}
                                        {rating.rating.message}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                // Si no he calificado, mostrar que está pendiente
                                <button
                                  onClick={() => {
                                    setIsOpenRatingModal(true);
                                    setIdParaRating({
                                      chatId: chat.id,
                                      userId: user?.id!,
                                    });
                                  }}
                                  className="px-4 py-2 gradient-background-azulfeo text-white rounded-lg"
                                >
                                  Calificar Chat
                                </button>
                              )}
                            </div>
                          );
                        }
                        return null;
                      })}
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </section>
    </div>
  );
};
