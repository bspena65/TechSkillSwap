import { useState } from "react";
import homeIcon from "../../assets/icons/home.svg";
import personIcon from "../../assets/icons/perfil.svg";
import searchIcon from "../../assets/icons/buscar.svg";
import messageIcon from "../../assets/icons/msg.svg";
import notificationIcon from "../../assets/icons/notification.svg";
import logoutIcon from "../../assets/icons/closesession.svg";
import Logo from "../../assets/LogoPng.png";
import { ModalCloseSession } from "./ModalCloseSession";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../state/authStore";

interface SidebarProps {
  width?: string;
  onClose?: () => void;
}

export const Sidebar = ({ width = "320px", onClose }: SidebarProps) => {
  const [isModalCloseSession, setIsModalCloseSession] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuthStore();

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center text-lg pl-[30px] py-4 ${
      isActive ? "gradient-background-azulfeo" : ""
    }`;

  const handleLogout = () => {
    setIsModalCloseSession(true);
  };

  const gotoAdmin = () => {
    navigate("/dash/admin");
  };

  const hanldeClose = () => {
    if (onClose && width == "full") {
      onClose();
    }
  };
  return (
    <nav
      className={`bg-[#5c5e62] text-white w-[${width}] ${
        width == "full" && "rounded-2xl"
      } h-full z-10 transition-transform duration-300 min-w-[260px]`} // Se oculta en pantallas pequeñas, se muestra en md
    >
      <ModalCloseSession
        isOpen={isModalCloseSession}
        onClose={() => setIsModalCloseSession(false)}
      />
      <div className="flex text-center justify-center items-center w-full">
        {/* Si le doy doble click al logo debera navegar a /dash/admin */}
        <img
          src={Logo}
          alt="Logo"
          className="cursor-pointer"
          onDoubleClick={gotoAdmin}
        />
      </div>
      <ul onClick={hanldeClose}>
        <li className=" border-b py-4 border-white text-center">
          <span className="text-xl font-medium rounded-lg px-2 text-black bg-[#D9D9D9] relative bottom-1 ">
            {" "}
            {user?.first_name} {user?.last_name}{" "} | {user?.id}|
          </span>
        </li>
        <li className=" border-b border-white">
          <NavLink to={"/dash/home"} className={linkClasses}>
            <img src={homeIcon} alt="Inicio" className="mr-2 w-6 h-6" />
            Inicio
          </NavLink>
        </li>
        <li className=" border-b border-white">
          <NavLink to={"/dash/profile"} className={linkClasses}>
            <img src={personIcon} alt="Perfil" className="mr-2 w-6 h-6" />
            Perfil
          </NavLink>
        </li>
        <li className=" border-b border-white">
          <NavLink to={"/dash/search"} className={linkClasses}>
            <img src={searchIcon} alt="Búsqueda" className="mr-2 w-6 h-6" />
            Búsqueda
          </NavLink>
        </li>
        <li className=" border-b border-white">
          <NavLink to={"/dash/messages"} className={linkClasses}>
            <img src={messageIcon} alt="Mensajes" className="mr-2 w-6 h-6" />
            Mensajes
          </NavLink>
        </li>
        <li className=" border-b border-white">
          <NavLink to={"/dash/notifications"} className={linkClasses}>
            <img
              src={notificationIcon}
              alt="Notificaciones"
              className="mr-2 w-6 h-6"
            />
            Notificaciones
          </NavLink>
        </li>
        <li
          className=" border-b border-white cursor-pointer"
          onClick={handleLogout}
        >
          <button className="flex items-center text-lg pl-[30px] py-4">
            <img
              src={logoutIcon}
              alt="Cerrar Sesión"
              className="mr-2 w-6 h-6"
            />
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </nav>
  );
};
