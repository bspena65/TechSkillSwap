import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/api";
import { Link } from "react-router-dom";
import lupa from "../../assets/lupa.svg";
import { useAuthStore } from "../../state/authStore";

// Define interfaces for the user and profile data
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface ProfileData extends User {
  profilePictureUrl?: string | null;
  bio?: string | null;
  userRoles?: Array<{
    id: number;
    role: {
      id: number;
      roleName: string;
    };
  }>;
  userSkills?: Array<{
    id: number;
    proficiencyLevel: string;
    yearsOfExperience: number;
    skill: {
      id: number;
      skillName: string;
    };
  }>;
  userLanguages?: Array<{
    id: number;
    proficiencyLevel: string;
    yearsOfExperience: number;
    language: {
      id: number;
      languageName: string;
    };
  }>;
}

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState<string>(""); // Valor por defecto "a"
  const [users, setUsers] = useState<User[]>([]);
  const [profileData] = useState<ProfileData | null>(null);
  const { user } = useAuthStore();

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(
        `/users/searchByJustWordAllData`,
        {
          params: { keyword: searchTerm },
        }
      );

      // No deberia mostra el usuario logueado
      const usersFiltered = response.data.filter(
        (u: User) => u.id !== user?.id
      );
      setUsers(usersFiltered);
    } catch (error) {
      console.error("Error searching for users", error);
    }
  };

  // Cada vez que el usuario escriba algo en el input, actualizamos el searchTerm y la URL
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    // Actualiza la URL dinámicamente sin recargar la página
    window.history.pushState({}, "", `/dash/search?keyword=${newSearchTerm}`);
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const keyword = query.get("keyword");

    // Si no hay keyword en la URL, se usa "a" como valor por defecto
    if (keyword) {
      setSearchTerm(keyword);
    } else {
      setSearchTerm("");
      window.history.pushState({}, "", `/dash/search?keyword=`); // Actualiza la URL si está vacía
    }

    // Ejecuta la búsqueda automáticamente cuando cargue la página
    handleSearch();
  }, [searchTerm]); // Se ejecutará siempre que cambie searchTerm

  return (
    <div className="max-w-4xl mx-auto px-4 py-2 animate__animated animate__fadeIn animate__faster">
      <section className="flex flex-col items-center justify-center mb-4">
        <h1 className="text-4xl font-semibold text-center mb-4">Búsqueda</h1>
        <div className="bg-black h-[2px] w-[90%]"> </div>
      </section>
      <form
        className="flex justify-center mb-6  sticky top-0 z-30 bg-slate-50"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <img
          src={lupa}
          alt="lupa"
          className="absolute left-2 top-2"
          width={"3.8%"}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange} // Actualiza el searchTerm y la URL
          className="border border-black rounded-lg p-2 w-full pl-12 "
          placeholder="Java"
        />
        {/* <button
          onClick={handleSearch}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Buscar
        </button> */}
      </form>

      {profileData && (
        <div className="mb-6 p-4 border border-gray-300 rounded-lg">
          <h2 className="text-xl font-semibold">Perfil</h2>
          <p>
            {profileData.firstName} {profileData.lastName}
          </p>
          <p>{profileData.email}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="border border-black rounded-lg p-2 text-center"
          >
            <div className="w-auto h-auto rounded-full mx-auto mt-8">
              <img
                // @ts-ignore
                src={user.profilePictureUrl ||`https://api.dicebear.com/9.x/initials/svg?seed=${user.firstName}-${user.lastName}`}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h2 className="text-base font-medium rounded-lg py-1 bg-[#D9D9D9] relative bottom-1">
              {user.firstName} {user.lastName}
            </h2>
            <div className="flex justify-center mb-2">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-2xl">
                  ★
                </span>
                <span className="text-yellow-500 text-2xl">
                  ★
                </span>
                <span className="text-black text-2xl">
                  ★
                </span>
                <span className="text-black text-2xl">
                  ★
                </span>
                <span className="text-black text-2xl">
                  ★
                </span>
              </div>
            </div>
            <div className="relative">
              <Link
                to={`/dash/user/${user.id}`}
                className="gradient-background-azulfeo items-center justify-around text-white text-center px-2 py-1 rounded-2xl flex w-[100%]"
              >
                Detalle
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
