import React, { useEffect, useState } from "react";
import { LanguagesTable } from "../organisms/LanguagesTable";
import { SkillCategoriesTable } from "../organisms/SkillCategoryTable";
import { SkillTable } from "../organisms/SkillTable";
import { useUIConfigStore } from "../../state/uiConfig";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../services/api";

// Componente Admin que maneja las Tabs
export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "languages" | "skills" | "uiconfig" | "skillcategory" | "request"
  >("uiconfig"); // Tab activo por defecto es "uiconfig"

  const { isDisabledFooter, toggleDisabledFooter } = useUIConfigStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Función para obtener el query param 'tab' de la URL
  const getTabFromQuery = () => {
    const searchParams = new URLSearchParams(location.search);
    // Si no existe el query param 'tab', retorna 'uiconfig' por defecto
    if (!searchParams.has("tab")) navigate(`?tab=uiconfig`, { replace: true });
    return (
      (searchParams.get("tab") as
        | "languages"
        | "skills"
        | "uiconfig"
        | "skillcategory"
        | "request") || "uiconfig"
    );
  };

  // Actualiza el tab activo basado en el query param
  useEffect(() => {
    const tabFromQuery = getTabFromQuery();
    setActiveTab(tabFromQuery);
  }, [location.search]);

  // Función para cambiar el tab y actualizar el query param
  const changeTab = (
    tab: "languages" | "skills" | "uiconfig" | "skillcategory" | "request"
  ) => {
    setActiveTab(tab);
    navigate(`?tab=${tab}`, { replace: true }); // Actualiza la URL con el nuevo query param
  };

  const deleteAllRequestMessages = async () => {
    await axiosInstance
      .get("/admin/deleleAllDataRequest/")
      .then((res) => {
        console.info(res);
        alert("Se han borrado todas las solicitudes");
      })
      .catch((error) => {
        console.info(error);
        alert("Error al borrar las solicitudes");
      });
  };
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Administración</h1>

      {/* Tabs */}
      <div className="flex border-b-2 border-b-blue-500 mb-6">
        <button
          className={`px-4 py-2 rounded-sm ${
            activeTab === "languages"
              ? "gradient-background-azulfeo text-white"
              : "bg-gray-200"
          }`}
          onClick={() => changeTab("languages")}
        >
          Lenguajes
        </button>
        <button
          className={`px-4 py-2 rounded-sm ${
            activeTab === "skills"
              ? "gradient-background-azulfeo text-white"
              : "bg-gray-200"
          }`}
          onClick={() => changeTab("skills")}
        >
          Habilidades
        </button>

        <button
          className={`px-4 py-2 rounded-sm ${
            activeTab === "skillcategory"
              ? "gradient-background-azulfeo text-white"
              : "bg-gray-200"
          }`}
          onClick={() => changeTab("skillcategory")}
        >
          Categorias de Habilidades
        </button>
        <button
          className={`px-4 py-2 rounded-sm ${
            activeTab === "uiconfig"
              ? "gradient-background-azulfeo text-white"
              : "bg-gray-200"
          }`}
          onClick={() => changeTab("uiconfig")}
        >
          UI Configuración
        </button>
        <button
          className={`px-4 py-2 rounded-sm ${
            activeTab === "request"
              ? "gradient-background-azulfeo text-white"
              : "bg-gray-200"
          }`}
          onClick={() => changeTab("request")}
        >
          Solicitudes
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === "languages" && <LanguagesTable />}
        {activeTab === "skillcategory" && <SkillCategoriesTable />}
        {activeTab === "skills" && <SkillTable />}
        {activeTab === "uiconfig" && (
          <div className="flex items-center space-x-4">
            <span>Mostrar Footer:</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDisabledFooter}
                onChange={toggleDisabledFooter}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full peer-checked:bg-white"></div>
            </label>
          </div>
        )}
        {activeTab === "request" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Solicitudes</h2>
            {/* Aquí puedes agregar el contenido de la nueva pestaña "Request" */}
            <p>
              Borrar todas las solicitudes de la DB , esto incluira chats,
              mensajes, ratings y chatparticipants{" "}
            </p>
            <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={deleteAllRequestMessages}>
              Borrar todas las solicitudes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
