import { useEffect, useState } from "react";
import axiosInstance from "../../services/api";

export const SkillTable = () => {
  const [skills, setSkills] = useState([]); // Almacena las habilidades
  const [page, setPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [loading, setLoading] = useState(false); // Controla el estado de carga
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla el estado del modal
  const [isUpdate, setIsUpdate] = useState(false); // Define si estamos en modo actualizar
  const [skillToEdit, setSkillToEdit] = useState<any>(null); // Habilidad que se va a editar o eliminar
  const [skillName, setSkillName] = useState(""); // Nombre de la habilidad
  const [skillCategoryId, setSkillCategoryId] = useState<number | null>(null); // ID de la categoría de habilidad
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // Controla el modal de confirmación de eliminación
  const [categories, setCategories] = useState([]); // Almacena las categorías

  const perPage = 5; // Cantidad de habilidades por página

  // Función para obtener las habilidades desde el backend
  const fetchSkills = async (page: number) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/skills?page=${page}&perPage=${perPage}`
      );
      setSkills(data.data); // Asigna los skills a la tabla
      setPage(data.page); // Página actual
      setTotalPages(data.totalPages); // Total de páginas
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar habilidades y categorías al montar el componente y cuando cambie la página
  useEffect(() => {
    fetchSkills(page);
    fetchCategories(); // Obtener las categorías al cargar el componente
  }, [page]);

  // Función para obtener las categorías desde el backend
  const fetchCategories = async () => {
    try {
      const { data } = await axiosInstance.get("/skill-categories");
      setCategories(data.data); // Almacena las categorías
    } catch (error) {
      console.error("Error fetching skill categories:", error);
    }
  };

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

  // Abrir modal para crear o actualizar una habilidad
  const openModal = (skill = null) => {
    setIsModalOpen(true);
    if (skill) {
      setIsUpdate(true);
      setSkillToEdit(skill);
      // @ts-ignore
      setSkillName(skill.skillName); // Asigna el nombre del skill al modal
      // @ts-ignore
      setSkillCategoryId(skill.category.id); // Asigna la categoría existente al modal
    } else {
      setIsUpdate(false);
      setSkillToEdit(null);
      setSkillName("");
      setSkillCategoryId(null);
    }
  };

  // Cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Crear o actualizar habilidad
  const handleSubmit = async () => {
    // Si no se ha seleccionado ninguna categoría, asignar la primera categoría por defecto
    const selectedCategoryId = skillCategoryId ?? 1;

    if (!selectedCategoryId) {
      console.error("No categories available to assign to the skill.");
      return;
    }

    if (isUpdate) {
      // Actualizar habilidad
      try {
        await axiosInstance.put(`/skills/${skillToEdit.id}`, {
          skillName,
          category: { id: selectedCategoryId }, // Siempre enviar una categoría válida
        });
        fetchSkills(page);
        closeModal();
      } catch (error) {
        console.error("Error updating skill:", error);
      }
    } else {
      // Crear nueva habilidad
      try {
        await axiosInstance.post("/skills", {
          skillName,
          category: { id: selectedCategoryId }, // Siempre enviar una categoría válida
        });
        fetchSkills(page);
        closeModal();
      } catch (error) {
        console.error("Error creating skill:", error);
      }
    }
  };

  // Abrir modal de confirmación para eliminar una habilidad
  const openDeleteModal = (skill: any) => {
    setDeleteModalOpen(true);
    setSkillToEdit(skill);
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/skills/${skillToEdit.id}`);
      fetchSkills(page);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Skills</h1>
      <button
        className="px-4 py-2 gradient-background-azulfeo text-white rounded mb-4"
        onClick={() => openModal()}
      >
        Agregar Habilidad
      </button>

      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Nombre Habilidad </th>
              <th className="py-2 px-4 border-b">Categoría</th>
              <th className="py-2 px-4 border-b">____</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill: any) => (
              <tr key={skill.id}>
                <td className="py-2 px-4 border-b">{skill.id}</td>
                <td className="py-2 px-4 border-b">{skill.skillName}</td>
                <td className="py-2 px-4 border-b">
                  {skill.category.categoryName}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                    onClick={() => openModal(skill)}
                  >
                    Editar
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => openDeleteModal(skill)}
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
              {isUpdate ? "Editar Habilidad" : "Agragar Habilidad"}
            </h2>
            <input
              type="text"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full mb-4"
              placeholder="Skill Name"
            />
            <select
              className="border border-gray-300 p-2 rounded w-full mb-4"
              value={skillCategoryId ?? ""}
              onChange={(e) => setSkillCategoryId(Number(e.target.value))}
            >
              <option value="">Seleccionar Categoría</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
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
            <p>¿ Estas seguro de borrar la habilidad ?</p>
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
