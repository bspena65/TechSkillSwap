import { useEffect, useState } from "react";
import LogoNotification from "../../assets/icons/notificationBlack.svg";
import msgBlack from "../../assets/icons/msgBlack.svg";
import infoCircle from "../../assets/icons/infoCircle.svg";
import { useFriendRequestStore } from "../../state/friendRequestStore";
import { useAuthStore } from "../../state/authStore";
import { Link } from "react-router-dom";
import useSocketStore from "../../state/useSocketStore";
import { FriendRequestStatus } from "../../interfaces/models/FriendRequestStatus";
import { ModalConfirmConnection } from "../organisms/ModalConfirmConection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { ModalRejectConection } from "../organisms/ModalRejectConection";

export const Notifications = () => {
  const { user } = useAuthStore();
  const { socket } = useSocketStore();

  const [isModalConfirmConectionOpen, setIsModalConfirmConectionOpen] =
    useState(false);

  const [isModalRejectConetionOpen, setIsModalRejectConetionOpen] =
    useState(false);

  const [selectedFriendRequestId, setSelectedFriendRequestId] = useState<
    number | null
  >(null);

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const {
    fetchFriendRequestsByReceiverId,
    fetchFriendRequestsBySenderId,
    friendRequests,
    myfriendRequestsSent,
    updateFriendRequest,
  } = useFriendRequestStore();

  useEffect(() => {
    fetchFriendRequestsByReceiverId(user?.id!);
    fetchFriendRequestsBySenderId(user?.id!);
  }, []);

  // Listen newFriendRequest
  useEffect(() => {
    socket?.on("newFriendRequest", () => {
      fetchFriendRequestsByReceiverId(user?.id!);
      fetchFriendRequestsBySenderId(user?.id!);
    });
    return () => {
      socket?.off("newFriendRequest");
    };
  }, [socket]);

  const returnStatus = (status: string) => {
    switch (status) {
      case FriendRequestStatus.PENDING:
        return "Solicitud pendiente";
      case FriendRequestStatus.ACCEPTED:
        return "Solicitud aceptada";
      case FriendRequestStatus.REJECTED:
        return "Solicitud rechazada";
      case FriendRequestStatus.COMPLETED:
        return "Solicitud Completada";
      default:
        return "Solicitud pendiente";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-2 animate__animated animate__fadeIn animate__faster">
      <section className="flex flex-col items-center justify-center mb-4">
        <h1 className="text-4xl font-semibold text-center mb-4">
          Notificaciones
          <img
            src={LogoNotification}
            alt="logo msg"
            className="w-9 h-9 mx-4 inline-block"
          />
        </h1>
        <div className="bg-black h-[2px] w-[90%]"></div>
      </section>

      <h1 className="text-2xl my-4 font-medium">Solitudes Recibidas</h1>
      {friendRequests && friendRequests.length === 0 && (
        <section>
          <div className="flex flex-col items-center justify-center">
            <div className="bg-[#D9D9D9] w-full p-4 rounded-md mb-4 border border-black">
              <h2 className="text-xl font-semibold text-center">
                No tienes notificaciones pendientes
              </h2>
            </div>
          </div>
        </section>
      )}

      {friendRequests &&
        friendRequests.length > 0 &&
        friendRequests.map((friendRequest) => (
          <section key={friendRequest.id}>
            <h1>{returnStatus(friendRequest.status)}</h1>
            <div className="flex items-center justify-between bg-[#D9D9D9] w-full px-4 py-2 rounded-md mb-4 border border-black">
              <div className="flex items-center">
                <Link to={`/dash/user/${friendRequest.sender.id}`}>
                  <img src={infoCircle} alt="Icon" className="w-9 h-9 mr-2" />
                </Link>
                <span className="text-2xl font-light">
                  {friendRequest?.skillSender?.skillName}
                </span>
              </div>

              <ModalConfirmConnection
                isOpen={isModalConfirmConectionOpen}
                onClose={() => setIsModalConfirmConectionOpen(false)}
                updateFriendRequest={updateFriendRequest}
                IDfriendRequest={selectedFriendRequestId!}
                userID={selectedUserId!}
              />

              <ModalRejectConection
                isOpen={isModalRejectConetionOpen}
                onClose={() => setIsModalRejectConetionOpen(false)}
                updateFriendRequest={updateFriendRequest}
                IDfriendRequest={selectedFriendRequestId!}
              />

              <div className="flex space-x-2">
                {friendRequest.status === "pending" ? (
                  <>
                    <button
                      className="gradient-background-azulfeo text-white px-4 py-2 rounded-md"
                      onClick={() => {
                        setSelectedFriendRequestId(friendRequest.id);
                        setSelectedUserId(friendRequest.sender.id);
                        setIsModalConfirmConectionOpen(true);
                      }}
                    >
                      Aceptar
                    </button>
                    <button
                      className="bg-black text-white px-4 py-2 rounded-md"
                      // onClick={() => rejectNotification(friendRequest)}
                      onClick={() => {
                        setSelectedFriendRequestId(friendRequest.id);
                        setIsModalRejectConetionOpen(true);
                      }}
                    >
                      Rechazar
                    </button>
                  </>
                ) : friendRequest.status === "accepted" ? (
                  <>
                    <div className="bg-[#ababae] text-black px-6 py-1 rounded-lg border-l-4 border-green-500">
                      Solicitud Aceptada
                    </div>
                    <Link to={`/dash/chat/${friendRequest.chat?.id}`}>
                      <img src={msgBlack} className="w-9 h-9" alt="msg" />
                    </Link>
                  </>
                ) : (
                  <div className="relative flex">
                    <div className="bg-[#ababae] text-black px-6 py-1  rounded-lg flex items-center border-l-4 border-red-500">
                      Solicitud Rechazada
                    </div>
                    <span className="ml-2 relative group cursor-pointer">
                      <FontAwesomeIcon
                        icon={faQuestionCircle}
                        className="text-black w-8 h-8"
                      />
                      <span className="absolute left-[-4px] transform -translate-x-1/2 bottom-full mb-2 w-32 bg-gray-800 text-white text-sm rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        {friendRequest.message}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>
        ))}

      <h1 className="text-2xl my-4 font-medium">Solitudes Enviadas </h1>
      {myfriendRequestsSent && myfriendRequestsSent.length === 0 && (
        <section>
          <div className="flex flex-col items-center justify-center">
            <div className="bg-[#D9D9D9] w-full p-4 rounded-md mb-4 border border-black">
              <h2 className="text-xl font-semibold text-center">
                No tienes solicitudes enviadas
              </h2>
            </div>
          </div>
        </section>
      )}

      {myfriendRequestsSent &&
        myfriendRequestsSent.length > 0 &&
        myfriendRequestsSent.map((friendRequest) => (
          <section key={friendRequest.id}>
            <h1>{returnStatus(friendRequest.status)}</h1>
            <div className="flex items-center justify-between bg-[#D9D9D9] w-full px-4 py-2 rounded-md mb-4 border border-black">
              <div className="flex items-center">
                <Link to={`/dash/user/${friendRequest.sender.id}`}>
                  <img src={infoCircle} alt="Icon" className="w-9 h-9 mr-2" />
                </Link>
                <span className="text-2xl font-light">
                  {friendRequest?.skillSender?.skillName}
                </span>
              </div>
              <div className="flex space-x-2">
                {friendRequest.status === "pending" ? (
                  <>
                    <button className="border-l-4 border-blue-500 bg-[#ababae] text-black px-9 py-1 rounded-lg">
                      Solicitud Enviada
                    </button>
                  </>
                ) : friendRequest.status === "accepted" ? (
                  <>
                    <button className="border-l-4 border-green-500 bg-[#ababae] text-black px-6 py-1 rounded-lg">
                      Solicitud Aceptada
                    </button>
                    <button>
                      <Link to={`/dash/chat/${friendRequest.chat?.id}`}>
                        <img src={msgBlack} className="w-9 h-9" alt="msg" />
                      </Link>
                    </button>
                  </>
                ) : (
                  <section className="flex">
                    <div className="border-l-4 border-red-400 bg-[#ababae] text-black px-6 py-1 rounded-lg">
                      Solicitud Rechazada
                    </div>
                    <span className="ml-2 relative group cursor-pointer">
                      <FontAwesomeIcon
                        icon={faQuestionCircle}
                        className="text-black w-8 h-8"
                      />
                      <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-32 bg-gray-800 text-white text-sm rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        {friendRequest.message}
                      </span>
                    </span>
                  </section>
                )}
              </div>
            </div>
          </section>
        ))}
    </div>
  );
};
