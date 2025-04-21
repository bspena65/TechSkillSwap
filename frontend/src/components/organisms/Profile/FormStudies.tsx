import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useProfileStore } from "../../../state/useProfileStore";
import { UserProfessionalStudy } from "../../../interfaces/User";
import { professions } from "../../../data/professions";
import { universidades } from "../../../data/universities";
import { levelStudies } from "../../../data/levelStudies";
import { states } from "../../../data/stateStudies";
import { DateTime } from "luxon"; // Para formatear las fechas

interface FormStudiesProps {
  onClose: () => void;
  studyId?: number;
  isEditing?: boolean;
}

export const FormStudies: React.FC<FormStudiesProps> = ({
  onClose,
  studyId,
  isEditing = false,
}) => {
  const { findStudyById, addStudy, updateStudy } = useProfileStore();

  // Obtener el estudio con la función del store
  const study = studyId ? findStudyById(studyId) : undefined;

  // Función para formatear la fecha con Luxon
  const formatDateInSpanish = (dateString: string): string => {
    const date = DateTime.fromISO(dateString);
    if (!date.isValid) return "FECHA NO VÁLIDA";
    return date.setLocale("es").toFormat("MMMM d 'del' yyyy");
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Partial<UserProfessionalStudy>>({
    defaultValues: {
      level_study: study?.level_study || levelStudies[0],
      state: study?.state || states[0],
      start_date: study?.start_date || "",
      end_date: study?.end_date || "",
      degree: study?.degree || professions[0],
      institution: study?.institution || universidades[0],
    },
  });

  // Observamos los valores de las fechas
  const startDateValue = useWatch({
    control,
    name: "start_date",
  });
  const endDateValue = useWatch({
    control,
    name: "end_date",
  });

  // Estados para almacenar las fechas formateadas
  const [formattedStartDate, setFormattedStartDate] = useState<string>("");
  const [formattedEndDate, setFormattedEndDate] = useState<string>("");

  // Función auxiliar para asegurarnos de que el valor sea un string
  const getStringDate = (dateValue: string | Date): string => {
    return typeof dateValue === "string"
      ? dateValue
      : dateValue.toISOString().split("T")[0]; // Convertimos Date a string en formato YYYY-MM-DD
  };

  // Actualizar las fechas formateadas cuando el usuario las cambie
  useEffect(() => {
    if (startDateValue) {
      setFormattedStartDate(formatDateInSpanish(getStringDate(startDateValue)));
    } else {
      setFormattedStartDate("");
    }
  }, [startDateValue]);

  useEffect(() => {
    if (endDateValue) {
      setFormattedEndDate(formatDateInSpanish(getStringDate(endDateValue)));
    } else {
      setFormattedEndDate("");
    }
  }, [endDateValue]);

  const onSubmit = async (data: Partial<UserProfessionalStudy>) => {
    if (isEditing && study?.study_id) {
      await updateStudy(study.study_id, data);
    } else {
      await addStudy(data);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Campo de Nivel de estudio */}
      <div className="mb-4">
        <label className="text-[#16191C] font-light text-[13px] my-1">
          Nivel de estudio
        </label>
        <select
          {...register("level_study", {
            required: "Selecciona un nivel de estudio",
          })}
          className="w-full p-2 rounded-lg bg-transparent border border-black"
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          {levelStudies.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        {errors.level_study && (
          <p className="text-red-500">{errors.level_study.message}</p>
        )}
      </div>

      {/* Campo de Estado */}
      <div className="mb-4">
        <label className="text-[#16191C] font-light text-[13px] my-1">
          Estado
        </label>
        <select
          {...register("state", {
            required: "Selecciona estado del estudio",
          })}
          className="w-full p-2 rounded-lg bg-transparent border border-black"
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        {errors.state && <p className="text-red-500">{errors.state.message}</p>}
      </div>

      {/* Fecha de inicio */}
      <div className="mb-4">
        <label className="text-[#16191C] font-light text-[13px] my-1">
          Fecha de inicio{" "}
          <span className="text-[10px] font-bold color-azulfeo capitalize">({formattedStartDate})</span>
        </label>
        <input
          type="date"
          {...register("start_date", {
            required: "Selecciona la fecha de inicio",
          })}
          className="w-full p-2 rounded-lg bg-transparent border border-black"
        />
        {errors.start_date && (
          <p className="text-red-500">{errors.start_date.message}</p>
        )}
      </div>

      {/* Fecha de fin */}
      <div className="mb-4">
        <label className="text-[#16191C] font-light text-[13px] my-1">
          Fecha de fin{" "}
          <span className="text-[10px] font-bold color-azulfeo capitalize">({formattedEndDate})</span>
        </label>
        <input
          type="date"
          {...register("end_date", {
            required: "Selecciona la fecha de fin",
          })}
          className="w-full p-2 rounded-lg bg-transparent border border-black"
        />
        {errors.end_date && (
          <p className="text-red-500">{errors.end_date.message}</p>
        )}
      </div>

      {/* Campo de Título otorgado */}
      <div className="mb-4">
        <label className="text-[#16191C] font-light text-[13px] my-1">
          Título otorgado
        </label>
        <select
          {...register("degree", {
            required: "Selecciona el título otorgado",
          })}
          className="w-full p-2 rounded-lg bg-transparent border border-black"
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          {professions.map((titulo) => (
            <option key={titulo} value={titulo}>
              {titulo}
            </option>
          ))}
        </select>
        {errors.degree && (
          <p className="text-red-500">{errors.degree.message}</p>
        )}
      </div>

      {/* Campo de Institución */}
      <div className="mb-4">
        <label className="text-[#16191C] font-light text-[13px] my-1">
          Institución
        </label>
        <select
          {...register("institution", {
            required: "Selecciona una institución",
          })}
          className="w-full p-2 rounded-lg bg-transparent border border-black"
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          {universidades.map((universidad) => (
            <option key={universidad} value={universidad}>
              {universidad}
            </option>
          ))}
        </select>
        {errors.institution && (
          <p className="text-red-500">{errors.institution.message}</p>
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
