import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ImageMain from "../../assets/logoBgDark.png"; // Ruta a tu imagen
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/api";
import LogoGoogle from "../../assets/icons/logo-google.svg";
import LogoGithub from "../../assets/icons/logo-github.svg";
import { URLBACKEND } from "../../config/variables";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

const RegisterTemplate: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormValues>({
    mode: "onChange", // Valida mientras el usuario escribe
  });

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para el mensaje de error

  const onSubmit = async (data: FormValues) => {
    // Limpiar el mensaje de error antes de enviar la solicitud
    setErrorMessage(null);

    // Solo mandamos los datos que el backend necesita
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    };

    try {
      // Enviar el payload al backend utilizando axiosInstance
      const response = await axiosInstance.post("/auth/register", payload);

      if (response.status === 201) {
        // Registro exitoso: Redirigir al login o al dashboard
        navigate("/auth/login");
      } else {
        // Si el registro falla, mostrar el mensaje de error
        setErrorMessage(response.data.message || "Error en el registro.");
      }
    } catch (error: any) {
      // Mostrar mensaje de error en caso de fallo en la solicitud
      setErrorMessage(error.response?.data?.message || "Error en el registro.");
    }
  };

  // Obtenemos el valor de password para compararlo con confirmPassword
  const password = watch("password");

  return (
    <div className="flex h-screen animate__animated animate__fadeIn animate__faster">
      {/* Sección Izquierda: Imagen de fondo */}
      <div
        className="w-[40vw] bg-cover bg-center flex flex-col items-center justify-center"
        style={{ backgroundImage: `url(${ImageMain})` }}
      ></div>

      {/* Sección Derecha: Formulario de Registro */}
      <div className="w-[60vw] bg-[#303438] flex flex-col justify-center p-12">
        <div className="max-w-[620px] mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Crea tu cuenta, si aún no la tienes
          </h2>

          {/* Mostrar el banner de error si existe un mensaje de error */}
          {errorMessage && (
            <div className="bg-transparent border border-red-400 text-red-300 p-1 rounded mb-4 text-center">
              {errorMessage}
            </div>
          )}

          {/* Formulario */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <input
                  type="text"
                  placeholder="Ingresa tu nombre"
                  className="w-full p-3 bg-[#1E2126] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("firstName", {
                    required: "El nombre es requerido",
                  })}
                />
                {errors.firstName && (
                  <p className="text-red-400 text-sm py-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="w-1/2">
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Ingresa tu apellido"
                  className="w-full p-3 bg-[#1E2126] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  {...register("lastName", {
                    required: "El apellido es requerido",
                  })}
                />
                {errors.lastName && (
                  <p className="text-red-400 text-sm py-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <input
                type="email"
                autoComplete="off"
                autoSave="off"
                placeholder="Ingresa tu email"
                className="w-full p-3 bg-[#1E2126] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("email", {
                  required: "El email es requerido",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "El formato de email no es válido",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-400 text-sm py-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="password"
                autoSave="off"
                autoComplete="off"
                placeholder="+8 caracteres"
                className="w-full p-3 bg-[#1E2126] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 8,
                    message: "La contraseña debe tener al menos 8 caracteres",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-400 text-sm py-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="password"
                autoComplete="off"
                placeholder="Confirme su contraseña"
                className="w-full p-3 bg-[#1E2126] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("confirmPassword", {
                  required: "La confirmación de la contraseña es requerida",
                  validate: (value) =>
                    value === password || "Las contraseñas no coinciden",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm py-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="flex items-center text-gray-400 text-sm">
              <input
                type="checkbox"
                className="mr-2"
                {...register("termsAccepted", {
                  required: "Debes aceptar los términos y condiciones",
                })}
              />
              <span>
                Al seleccionar, significa que está de acuerdo con nuestros{" "}
                <a href="#" className="text-blue-500 underline">
                  Términos de servicio
                </a>
                ,{" "}
                <a href="#" className="text-blue-500 underline">
                  Política de Privacidad
                </a>{" "}
                y nuestra{" "}
                <a href="#" className="text-blue-500 underline">
                  Configuración Predeterminada
                </a>
                .
              </span>
            </div>
            {errors.termsAccepted && (
              <p className="text-red-400 text-sm py-1">
                {errors.termsAccepted.message}
              </p>
            )}
            <button
              type="submit"
              className={`w-full p-3 rounded-md font-semibold transition-all ${
                isValid
                  ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                  : "bg-gray-400 text-gray-600 cursor-not-allowed"
              }`}
              disabled={!isValid}
            >
              Crear una cuenta
            </button>
          </form>

          {/* Continuar con Google/GitHub */}
          <div className="flex justify-between mb-6 space-x-4 mt-5">
            <Link
              to={`${URLBACKEND}/api/auth/google`}
              className="w-1/2 py-2.5 px-4 border border-white text-white flex items-center justify-center rounded-md hover:bg-gray-700 transition-colors"
            >
              <img src={LogoGoogle} alt="Inicio" className="mr-2 w-6 h-6" />
              Google
            </Link>
            <Link
              to={`${URLBACKEND}/api/auth/github`}
              className="w-1/2 py-2.5 px-4 border border-white text-white flex items-center justify-center rounded-md hover:bg-gray-700 transition-colors"
            >
              <img src={LogoGithub} alt="Inicio" className="mr-2 w-6 h-6" />
              GitHub
            </Link>
          </div>

          {/* Link de iniciar sesión */}
          <div className="text-center mt-4">
            <span className="text-gray-400">
              ¿Ya eres usuario?{" "}
              <Link to={"/auth/login"} className="text-blue-500 underline">
                Iniciar Sesión
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterTemplate;
