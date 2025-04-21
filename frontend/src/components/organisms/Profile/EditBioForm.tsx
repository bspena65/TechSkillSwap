import React from "react";
import { useForm } from "react-hook-form";
import { useProfileStore } from "../../../state/useProfileStore";

interface EditBioFormProps {
  onClose: () => void;
}

export const EditBioForm: React.FC<EditBioFormProps> = ({ onClose }) => {
  const { userProfile, updateBio } = useProfileStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bio: userProfile?.bio || "",
    },
  });

  const onSubmit = async (data: any) => {
    await updateBio(data.bio);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Campo de Nombre */}
      <div className="mb-4">
        <div className="text-[#16191C] font-light text-[13px] my-1">
          Acerca de
        </div>
        <textarea
          rows={6}
          {...register("bio", { required: "La biografia es obligatorio" })}
          className="w-full p-2 rounded-lg bg-transparent border border-black"
        ></textarea>
        {errors.bio && (
          <p className="text-red-400 text-sm">{errors.bio.message}</p>
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
