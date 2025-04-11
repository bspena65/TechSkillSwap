import { useEffect, useState } from "react";
import axiosInstance from "../../services/api";

export const LanguagesTable = () => {
  const [languages, setLanguages] = useState([]); // Almacena los lenguajes
  const [page, setPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [loading, setLoading] = useState(false); // Controla el estado de carga
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla el estado del modal
  const [isUpdate, setIsUpdate] = useState(false); // Define si estamos en modo actualizar
  const [languageToEdit, setLanguageToEdit] = useState<any>(null); // Lenguaje que se va a editar o eliminar
  const [languageName, setLanguageName] = useState(""); // Nuevo nombre del lenguaje
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Controla el modal de confirmación de eliminación

  const perPage = 5; // Cantidad de lenguajes por página

  // Función para obtener los lenguajes desde el backend
  const fetchLanguages = async (page: number) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/languages/list/${page}?perPage=${perPage}`
      );

      setLanguages(data.data);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching languages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar lenguajes al montar el componente y cuando cambie la página
  useEffect(() => {
    fetchLanguages(page);
  }, [page]);

  // Funciones para cambiar de página
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // Abrir modal para crear o actualizar un lenguaje
  const openModal = (language = null) => {
    setIsModalOpen(true);
    if (language) {
      setIsUpdate(true);
      setLanguageToEdit(language);
      // @ts-ignore
      setLanguageName(language.languageName);
    } else {
      setIsUpdate(false);
      setLanguageToEdit(null);
      setLanguageName("");
    }
  };

  // Cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Crear o actualizar lenguaje
  const handleSubmit = async () => {
    if (isUpdate) {
      // Actualizar lenguaje
      try {
        await axiosInstance.put(`/languages/${languageToEdit.id}`, {
          languageName,
        });
        fetchLanguages(page);
        closeModal();
      } catch (error) {
        console.error("Error updating language:", error);
      }
    } else {
      // Crear nuevo lenguaje
      try {
        await axiosInstance.post("/languages", { languageName });
        fetchLanguages(page);
        closeModal();
      } catch (error) {
        console.error("Error creating language:", error);
      }
    }
  };

  // Abrir modal de confirmación para eliminar un lenguaje
  const openDeleteModal = (language: any) => {
    setDeleteModalOpen(true);
    setLanguageToEdit(language);
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/languages/${languageToEdit.id}`);
      fetchLanguages(page);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting language:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Languages</h1>
      <button
        className="px-4 py-2 gradient-background-azulfeo text-white rounded mb-4"
        onClick={() => openModal()}
      >
        Agregar Lenjuage
      </button>

      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Nombre de Languaje</th>
              <th className="py-2 px-4 border-b">__</th>
            </tr>
          </thead>
          <tbody>
            {languages.map((language: any) => (
              <tr key={language.id}>
                <td className="py-2 px-4 border-b">{language.id}</td>
                <td className="py-2 px-4 border-b">{language.languageName}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                    onClick={() => openModal(language)}
                  >
                    Editar
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => openDeleteModal(language)}
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-between mt-4">
        <button
          className={`px-4 py-2 bg-gray-300 rounded ${
            page === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span className="text-lg">
          Página {page} de {totalPages}
        </span>
        <button
          className={`px-4 py-2 bg-gray-300 rounded ${
            page === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          Siguiente
        </button>
      </div>

      {/* Modal para Crear/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {isUpdate ? "Editar Languaje" : "Agregar Languaje"}
            </h2>
            <input
              type="text"
              value={languageName}
              onChange={(e) => setLanguageName(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full mb-4"
              placeholder="Rust"
            />
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded mr-2"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 gradient-background-azulfeo text-white rounded"
                onClick={handleSubmit}
              >
                {isUpdate ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Confirmar Eliminación */}
      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirmar Borrado</h2>
            <p>¿ Estas seguro de borrar el Lenguaje ?</p>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-black rounded mr-2"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={confirmDelete}
              >
                Borrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
