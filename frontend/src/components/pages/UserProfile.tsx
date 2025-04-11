import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import axiosInstance from "../../services/api";
import { UserSkill } from "./ProfileTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { User } from "../../interfaces/User";
import UserLogoDefault from "../../assets/User.png";
import Infomenu from "../../assets/icons/infomenu.svg";
import { getImageLanguagedevrepo } from "../../utils/getImageLanguagedevrepo";
import { ModalProfile } from "../organisms/ModalProfile";

import { useAuthStore } from "../../state/authStore";
import { useFriendRequestStore } from "../../state/friendRequestStore";
import { formatDateInSpanish } from "../../helpers/formatDateSpanish";
import { FriendsRequestUser } from "../../interfaces/dtos/FriendsRequestUser";
import { FriendRequestStatus } from "../../interfaces/models/FriendRequestStatus";
import useSocketStore from "../../state/useSocketStore";

export const UserProfile: React.FC = () => {
  const { id } = useParams(); // Extract id from URL
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { createFriendRequest } = useFriendRequestStore();
  const { user } = useAuthStore();
  const [isOpenModalInfo, setIsOpenModalInfo] = useState<boolean>(false);
  const [activeSkill, setActiveSkill] = useState<UserSkill>();
  const [friendRequest, setFriendRequest] = useState<FriendsRequestUser[]>();
  const { socket } = useSocketStore();

  // Fetch user profile data with async/await and error handling
  const fetchUserProfile = async () => {
    try {
      if (id) {
        const response = await axiosInstance.get(
          `/users/getByIdAndSender/${id}?senderId=${user?.id}`
        );
        setUserProfile(response.data.user);
        setFriendRequest(response.data.friendsRequest);
        setError(null); // Reset any previous errors
      }
    } catch (err) {
      setError("Error fetching user data.");
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  // Listen newFriendRequest
  useEffect(() => {
    socket?.on("newFriendRequest", () => {
      fetchUserProfile();
    });
    return () => {
      socket?.off("newFriendRequest");
    };
  }, [socket]);

  const handleConnect = async (idReceiver: number, skillSender: number) => {
    if (userProfile) {
      try {
        await createFriendRequest({
          skillSender: {
            id: skillSender,
          },
          sender: {
            id: user?.id!,
          },
          receiver: {
            id: idReceiver,
          },
          status: FriendRequestStatus.PENDING, // Update status to "pending"
          message: " - ",
        });
        // Reload user profile data after connection
        fetchUserProfile();
      } catch (error) {
        console.error("Error creating friend request:", error);
      }
    }
  };

  // Function to get the request status message
  const getRequestStatusMessage = (status: string) => {
    switch (status) {
      case FriendRequestStatus.PENDING:
        return "Solicitud enviada";
      case FriendRequestStatus.ACCEPTED:
        return "Solicitud aceptada";
      case FriendRequestStatus.REJECTED:
        return "Solicitud rechazada";
      case FriendRequestStatus.COMPLETED:
        return "Solicitud completada";
      default:
        return "Conectar";
    }
  };

  // Function to get the background color based on the status
  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case FriendRequestStatus.PENDING:
        return "border-l-4 border-yellow-400 text-black";
      case FriendRequestStatus.ACCEPTED:
        return "border-l-4 border-green-500 text-black";
      case FriendRequestStatus.REJECTED:
        return "border-l-4 border-red-400  text-black";
      case FriendRequestStatus.COMPLETED:
        return "border-l-4 border-blue-500 text-white";
      default:
        return "bg-gray-200 text-black"; // Default for "Conectar"
    }
  };

  // Check if there's any pending, accepted, rejected, or completed request for this user
  const getFriendRequestStatus = (skillId: number) => {
    const request = friendRequest?.find(
      (req) =>
        req.skillSender?.id === skillId && req.receiver?.id === userProfile?.id
    );
    return request?.status;
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!userProfile) {
    return <div>No user data available</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 animate__animated animate__fadeIn animate__faster">
      {/* Btn return back */}
      <div className="sticky top-0 z-10 mb-2">
        {" "}
        {/* Make the button sticky */}
        <button
          onClick={() => window.history.back()}
          className="gradient-background-azulfeo text-white px-4 py-2 rounded-lg"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Volver
        </button>
      </div>

      {/* Profile Header */}
      <div className="flex items-center border border-[#1E2126] rounded-sm p-6 mb-2 relative">
        <div className="w-[225px] h-[231px] flex-shrink-0 mr-6 flex flex-row">
          <img
            src={userProfile.profilePictureUrl || UserLogoDefault}
            alt={`${userProfile.firstName} ${userProfile.lastName}`}
            className="w-full h-full object-cover rounded-full"
          />
          <div className="border-l border-black h-[90%] mx-6"></div>
        </div>
        <div className="flex-1 ml-5">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl">{`${userProfile.firstName} ${userProfile.lastName}`}</h1>
              <p className="text-gray-500">
                {userProfile.labelProfile
                  ? userProfile.labelProfile
                  : "Sin Label"}
              </p>
              <p className="text-gray-500">
                {userProfile.location ? userProfile.location : "Sin Ubicación"}
              </p>
              <div className="flex items-center mt-2">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                    ★
                  </span>
                  <span className="text-yellow-500 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                    ★
                  </span>
                  <span className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                    ★
                  </span>
                  <span className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                    ★
                  </span>
                  <span className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                    ★
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acerca de Section */}
      <div className="border border-[#1E2126] rounded-sm p-4 mb-2">
        <h2 className="text-xl font-semibold">Acerca de...</h2>
        <p className="mt-2">
          {userProfile.bio ? userProfile.bio : " Sin información disponible."}
        </p>
      </div>

      {/* Estudios Profesionales Section */}
      <div className="border border-[#1E2126] rounded-sm p-4 mb-2">
        <section className="flex justify-between">
          <h2 className="text-xl font-semibold mb-4">Estudios Profesionales</h2>
        </section>

        <ul className="space-y-4 mt-8">
          {userProfile.userProfessionalStudies &&
          userProfile.userProfessionalStudies.length > 0 ? (
            userProfile.userProfessionalStudies.map((study, index) => (
              <li key={index} className="border-l-2 pl-2 border-black">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {study.degree}
                    </h3>
                    <p className="text-xs font-medium text-blue-600">
                      {/* @ts-ignore */}
                      {formatDateInSpanish(study.start_date)} -{" "}
                      {/* @ts-ignore */}
                      {formatDateInSpanish(study.end_date)}
                    </p>
                    <p className="text-gray-500">{study.institution}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {study.description}
                    </p>
                  </div>
                  <div className="ml-4 text-right"></div>
                </div>
              </li>
            ))
          ) : (
            <li className="border-l-2 pl-2 border-black">
              Este usuario no tiene estudios registrados
            </li>
          )}
        </ul>
      </div>

      {/* Lenguajes de Programación Section */}
      <div className="border border-[#1E2126] rounded-sm  p-4 mb-2">
        <section className="flex justify-between">
          <h2 className="text-xl font-semibold mb-4">Lenguajes del Usuario</h2>
        </section>

        <div className="flex flex-row flex-wrap gap-3">
          {userProfile.userLanguages && userProfile.userLanguages.length > 0 ? (
            userProfile.userLanguages.map((language, index) => (
              <div
                key={index}
                title={`${language.yearsOfExperience} Años de experiencia en ${language.language?.languageName}`}
                className="flex flex-row justify-between items-start w-auto  cursor-pointer "
              >
                <div className="flex flex-col  items-center">
                  <div className="w-10 h-10">
                    <img
                      src={getImageLanguagedevrepo(
                        language.language?.languageName!
                      )}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://raw.githubusercontent.com/devicons/devicon/master/icons/akka/akka-original.svg";
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 px-2">
                    {language.language?.languageName}
                  </h3>
                  <div className="text-[12px] rounded-2xl border border-blue-800 text-black p-1 px-2 inline-flex  mt-1">
                    {language.yearsOfExperience} años
                  </div>
                </div>
              </div>
            ))
          ) : (
            <li className="list-none p-0 m-0 ml-1">
              No hay Lenguajes disponibles
            </li>
          )}
        </div>
      </div>

      {/* Skill Section */}
      <div className="border border-[#1E2126] rounded-sm  p-4 mb-2">
        <section className="flex justify-between">
          <h2 className="text-xl font-semibold mb-4">
            Habilidades del Usuario
          </h2>
        </section>

        <ul className="space-y-4 ">
          {userProfile.userSkills && userProfile.userSkills.length > 0 ? (
            userProfile.userSkills.map(({ skill }, index) => {
              // @ts-ignore
              const requestStatus = getFriendRequestStatus(skill.id);
              return (
                <li
                  key={index}
                  className="bg-white border border-black p-1 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800 pl-3">
                      {skill?.skillName}
                    </h3>
                    <div className="flex items-center gap-2">
                      {/* Show appropriate button based on the friend request status */}
                      {requestStatus ? (
                        <section className="flex justify-center items-center">
                          <div
                            className={` bg-[#d9d9d9] flex justify-center items-center text-[16px] w-[220px] h-auto text-center rounded-xl px-2 py-1 ${getStatusBackgroundColor(
                              requestStatus
                            )}`}
                          >
                            {getRequestStatusMessage(requestStatus)}

                            {requestStatus === "rejected" && (
                              <span className="ml-2 relative group cursor-pointer">
                                <FontAwesomeIcon
                                  icon={faQuestionCircle}
                                  className="text-black relative top-[2px] w-6 h-6"
                                />
                                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-32 bg-gray-800 text-white text-sm rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                  {
                                    friendRequest?.find(
                                      (req) =>
                                        req.skillSender?.id === skill?.id &&
                                        req.receiver?.id === userProfile.id
                                    )?.message
                                  }
                                </span>
                              </span>
                            )}
                          </div>
                        </section>
                      ) : (
                        <button
                          onClick={() =>
                            handleConnect(userProfile.id!, skill?.id!)
                          }
                          className="gradient-background-azulfeo text-[16px] w-[220px] h-[33px] text-white rounded-xl px-2 py-0"
                        >
                          Conectar
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsOpenModalInfo(true);
                          setActiveSkill(skill as UserSkill);
                        }}
                      >
                        <img src={Infomenu} alt="info" className="w-10 h-10" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <li>No hay habilidades disponibles</li>
          )}
        </ul>
      </div>
      {isOpenModalInfo && (
        <ModalProfile
          title={"Información Habilidad"}
          isOpen={isOpenModalInfo}
          onClose={() => setIsOpenModalInfo(false)}
        >
          <div className="flex flex-col">
            <h3 className="text-2xl font-semibold">
              {activeSkill?.skill?.skillName}
            </h3>
            <p className="text-gray-500">
              {activeSkill?.description
                ? activeSkill?.description
                : "Sin Descripcion"}
            </p>
            <p className="text-gray-500">
              Años de experiencia: {activeSkill?.yearsOfExperience}
            </p>
          </div>
        </ModalProfile>
      )}
    </div>
  );
};

export default UserProfile;
