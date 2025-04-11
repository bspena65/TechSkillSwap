import { useEffect, useState } from "react";
import Footer from "../organisms/Footer";
import { Outlet } from "react-router-dom";
import { useUIConfigStore } from "../../state/uiConfig";
import { Sidebar } from "../organisms/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

// Modal para mostrar el Sidebar en pantallas pequeñas
const ModalSidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white w-[80%] h-[90%]  rounded-2xl shadow-lg">
        <button
          className="absolute top-2 right-2 text-white px-2 py-1 rounded-lg gradient-background-azulfeo text-lg font-bold"
          onClick={onClose}
        >
          X
        </button>
        <Sidebar width="full" onClose={onClose} />
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const { isDisabledFooter } = useUIConfigStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controla el modal del Sidebar

  useEffect(() => {
    // Quitar el scroll del body
    document.body.style.overflow = "hidden";

    return () => {
      // Habilitar el scroll del body
      document.body.style.overflow = "auto";
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-transparent overflow-hidden">
      {/* Botón flotante solo visible en pantallas pequeñas */}
      <button
        className="fixed top-0 m-1 border-2 border-[#2A49FF] p-1 right-2 bg-white rounded-xl text-black  z-50 block lg:hidden"
        onClick={toggleSidebar}
      >
        <FontAwesomeIcon icon={faBars} size="2x" />
      </button>

      {/* Modal que contiene el Sidebar */}
      <ModalSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      {/* Sección del contenido */}
      <section
        className={`w-full flex flex-row h-[100vh] transition-all duration-300`}
      >
        {/* Sidebar visible en pantallas medianas o grandes */}
        <div className="hidden lg:block ">
          <Sidebar />
        </div>

        <div className="pt-7 w-[100%] bg-white overflow-auto">
          <Outlet />
        </div>
      </section>

      {isDisabledFooter && <Footer />}
    </div>
  );
};
