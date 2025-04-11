import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Image4 from "../../assets/image.png";
import Logo from "../../assets/LogoAuth.png";
import LogoGoogle from "../../assets/icons/logo-google.svg";
import LogoGithub from "../../assets/icons/logo-github.svg";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../state/authStore";
import axiosInstance from "../../services/api";
import { URLBACKEND } from "../../config/variables";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginTemplate: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  // Estado para manejar el mensaje de error
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormValues) => {
    // Limpiar el mensaje de error antes de enviar la solicitud
    setErrorMessage(null);

    try {
      // Usar axiosInstance en lugar de fetch
      const response = await axiosInstance.post("/auth/login", data);

      if (response.status === 200) {
        // Simulación de éxito: Almacenar token y navegar
        login(response.data.user, response.data.token);
        navigate("/dash");
      } else {
        // Mostrar mensaje de error si el login no es exitoso
        setErrorMessage(response.data.message || "Error en la autenticación.");
      }
    } catch (error) {
      // Mostrar mensaje de error en caso de fallo en la solicitud
      setErrorMessage("Error en la autenticación, intenta de nuevo.");
    }
  };

  return (
    <div className="flex h-screen animate__animated animate__fadeIn animate__faster">
      <div
        className="w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${Image4})` }}
      >
        {/* Aquí puedes usar la imagen como fondo o como un <img /> */}
      </div>

      {/* Sección derecha del formulario */}
      <div className="w-1/2 flex items-center justify-center bg-[#16191C] p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src={Logo} alt="TechSkillSwap" className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">
              Bienvenido de vuelta
            </h2>
          </div>

          {/* Mostrar el banner de error si existe un mensaje de error */}
          {errorMessage && (
            <div className="bg-transparent border border-zinc-400 text-red-300 p-1 rounded mb-4 text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-white mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Juan@gmail.com"
                autoComplete="off"
                className="w-full p-3 bg-[#1E2126] text-white rounded-md focus:outline-none"
                {...register("email", {
                  required: "El email es requerido",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "El formato de email no es válido",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-6 relative">
              <label htmlFor="password" className="block text-white mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                autoComplete="off"
                placeholder="*********"
                className="w-full p-3 bg-[#1E2126] text-white rounded-md focus:outline-none"
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 8,
                    message: "La contraseña debe tener al menos 8 caracteres",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-2">
                  {errors.password.message}
                </p>
              )}
              <a
                href="#"
                className="text-sm text-gray-500 absolute right-2 top-[10px]"
              >
                ¿Has olvidado tu contraseña?
              </a>
            </div>

            {/* Botón de Iniciar sesión */}
            <button
              type="submit"
              className="w-full py-3 text-white font-semibold rounded-md mb-6 
             bg-gradient-to-r from-[#3969FC] to-[#2A49FF] shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              Iniciar Sesión
            </button>

            {/* Iniciar sesión con Google o GitHub */}
            <div className="text-center text-gray-400 mb-6">
              O inicia sesión con
            </div>
            <div className="flex justify-between mb-6 space-x-4">
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

            {/* Enlace para crear una cuenta */}
            <div className="text-center text-gray-400">
              ¿Todavía no tienes una cuenta?{" "}
              <Link to={"/auth/register"} className="text-white underline">
                Crea una ahora
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginTemplate;
