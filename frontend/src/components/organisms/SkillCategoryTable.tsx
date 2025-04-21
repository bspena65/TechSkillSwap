import { useEffect, useState } from "react";
import axiosInstance from "../../services/api";

export const SkillCategoriesTable = () => {
  const [skillCategories, setSkillCategories] = useState([]); // Almacena las categorías de habilidades
  const [page, setPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [loading, setLoading] = useState(false); // Controla el estado de carga
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla el estado del modal
  const [isUpdate, setIsUpdate] = useState(false); // Define si estamos en modo actualizar
  const [categoryToEdit, setCategoryToEdit] = useState<any>(null); // Categoría que se va a editar o eliminar
  const [categoryName, setCategoryName] = useState(""); // Nuevo nombre de la categoría
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Controla el modal de confirmación de eliminación

  const perPage = 5; // Cantidad de categorías por página

  // Función para obtener las categorías desde el backend
  const fetchSkillCategories = async (page: number) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/skill-categories?page=${page}&perPage=${perPage}`
      );

      setSkillCategories(data.data);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching skill categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar categorías al montar el componente y cuando cambie la página
  useEffect(() => {
    fetchSkillCategories(page);
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

  // Abrir modal para crear o actualizar una categoría
  const openModal = (category = null) => {
    setIsModalOpen(true);
    if (category) {
      setIsUpdate(true);
      setCategoryToEdit(category);
      // @ts-ignore
      setCategoryName(category.categoryName);
    } else {
      setIsUpdate(false);
      setCategoryToEdit(null);
      setCategoryName("");
    }
  };

  // Cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Crear o actualizar categoría
  const handleSubmit = async () => {
    if (isUpdate) {
      // Actualizar categoría
      try {
        await axiosInstance.put(`/skill-categories/${categoryToEdit.id}`, {
          categoryName,
        });
        fetchSkillCategories(page);
        closeModal();
      } catch (error) {
        console.error("Error updating skill category:", error);
      }
    } else {
      // Crear nueva categoría
      try {
        await axiosInstance.post("/skill-categories", { categoryName });
        fetchSkillCategories(page);
        closeModal();
      } catch (error) {
        console.error("Error creating skill category:", error);
      }
    }
  };

  // Abrir modal de confirmación para eliminar una categoría
  const openDeleteModal = (category: any) => {
    setDeleteModalOpen(true);
    setCategoryToEdit(category);
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/skill-categories/${categoryToEdit.id}`);
      fetchSkillCategories(page);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting skill category:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4"> Categoría de Habilidades</h1>
      <button
        className="px-4 py-2 gradient-background-azulfeo text-white rounded mb-4"
        onClick={() => openModal()}
      >
        Agregar Nueva Categoría de Habilidades
      </button>

      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">
                Nombre Categoría de Habilidades
              </th>
              <th className="py-2 px-4 border-b">___</th>
            </tr>
          </thead>
          <tbody>
            {skillCategories.map((category: any) => (
              <tr key={category.id}>
                <td className="py-2 px-4 border-b">{category.id}</td>
                <td className="py-2 px-4 border-b">{category.categoryName}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                    onClick={() => openModal(category)}
                  >
                    Editar
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => openDeleteModal(category)}
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
              {isUpdate ? "Editar Categoria" : "Agregar Categoría"}
            </h2>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full mb-4"
              placeholder=""
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
                {isUpdate ? "Actulizar" : "Crear"}
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
            <p> ¿ Estas seguro de borrar la categoría  ?</p>
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
