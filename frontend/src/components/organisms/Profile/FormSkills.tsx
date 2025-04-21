import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useProfileStore } from "../../../state/useProfileStore";
import { UserSkill, Skill } from "../../../interfaces/User";

interface FormSkillsProps {
  onClose: () => void;
  skillId?: number;
  isEditing?: boolean;
}

// const proficiencyLevels = ["Básico", "Intermedio", "Avanzado"];

export const FormSkills: React.FC<FormSkillsProps> = ({
  onClose,
  skillId,
  isEditing = false,
}) => {
  const { availableSkills, userProfile, addSkill, updateSkill, findSkillById } =
    useProfileStore();

  // Obtener la skill si se está editando
  const skill = skillId ? findSkillById(skillId) : undefined;

  useEffect(() => {
    // Si necesitas cargar las habilidades disponibles desde el store
    // fetchAvailableSkills(); // descomenta esto si es necesario
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<UserSkill>>({
    defaultValues: {
      skill: skill?.skill || { id: 0, skillName: "" },
      yearsOfExperience: skill?.yearsOfExperience || 0,
      description: skill?.description || "",
    },
  });

  const onSubmit = async (data: Partial<UserSkill>) => {
    const selectedSkill = availableSkills.find(
      (s: Skill) => s.skillName === data.skill?.skillName
    );

    const payload = {
      skill: selectedSkill, // Añadir el id y el nombre correcto
      description: data.description,
      yearsOfExperience: data.yearsOfExperience,
      user: { id: userProfile?.id },
    };

    if (isEditing && skill?.id) {
      await updateSkill(skill.id, payload);
    } else {
      await addSkill(payload);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      {/* Selección de Skill */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Selecciona un Skill
        </label>
        <select
          {...register("skill.skillName", {
            required: "Selecciona una habilidad",
          })}
          className="mt-1 block w-full border bg-transparent border-black p-2 rounded-md"
        >
          <option value="">Selecciona una opción</option>
          {availableSkills.map((skill: Skill) => (
            <option key={skill.id} value={skill.skillName}>
              {skill.skillName}
            </option>
          ))}
        </select>
        {errors.skill?.skillName && (
          <p className="text-red-500">{errors.skill.skillName.message}</p>
        )}
      </div>

      {/* Descripción */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          {...register("description")}
          rows={6}
          className="mt-1 block w-full border bg-transparent border-black p-2 rounded-md"
          placeholder="Escribe una descripción"
        />
      </div>

      {/* Años de experiencia */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Años de experiencia
        </label>
        <input
          type="number"
          {...register("yearsOfExperience", {
            required: "Los años de experiencia son obligatorios",
            min: { value: 0, message: "Debe ser un número positivo" },
            max: { value: 70, message: "Máximo 70 años" },
          })}
          className="mt-1 block w-full border border-black bg-transparent p-2 rounded-md"
          placeholder="Ej. 2, 5, 10"
        />
        {errors.yearsOfExperience && (
          <p className="text-red-500">{errors.yearsOfExperience.message}</p>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={onClose}
          className="mr-2 bg-black text-white px-4 py-2 rounded-lg min-w-[180px]"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="gradient-background-azulfeo text-white px-4 py-2 rounded-lg min-w-[180px]"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};
