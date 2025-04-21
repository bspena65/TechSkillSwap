import { useEffect, useState } from "react";
import { User } from "../../interfaces/User";
import axiosInstance from "../../services/api";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../state/authStore";

export const HomeDash = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axiosInstance.get(
        `/users/searchByJustWordAllData`,
        {
          params: { keyword: "" },
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-2 animate__animated animate__fadeIn animate__faster">
      <section className="flex flex-col items-center justify-center mb-4">
        <h1 className="text-4xl font-semibold text-center mb-4">
          Perfiles más vistos
        </h1>
        <div className="bg-black h-[2px] w-[90%] mt-5"></div>
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="border border-black rounded-lg p-2 text-center"
          >
            <div className="w-32 h-32 rounded-full mx-auto mt-8">
              <img
                // @ts-ignore
                src={
                  user.profilePictureUrl ||
                  `https://api.dicebear.com/9.x/initials/svg?seed=${user.firstName}-${user.lastName}`
                }
                alt={`${user.firstName} ${user.lastName}`}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h2 className="text-base font-medium rounded-lg py-1 bg-[#D9D9D9] relative bottom-1">
              {user.firstName} {user.lastName}
            </h2>
            <div className="flex justify-center mb-2">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-2xl">★</span>
                <span className="text-yellow-500 text-2xl">★</span>
                <span className="text-black text-2xl">★</span>
                <span className="text-black text-2xl">★</span>
                <span className="text-black text-2xl">★</span>
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
