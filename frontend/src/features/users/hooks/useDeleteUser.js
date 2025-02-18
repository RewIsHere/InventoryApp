import { useState } from "react";
import { deleteUserService } from "../services/userService"; // Importa el servicio

export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);

  const deleteUser = async (userId) => {
    setLoading(true);
    try {
      // Llamada al servicio para eliminar el usuario
      const response = await deleteUserService(userId);
      setLoading(false);
      return response; // Devuelve el mensaje o el error de la API
    } catch (error) {
      setLoading(false);
      throw error; // Lanza el error para que lo capturemos en el componente
    }
  };

  return { deleteUser, loading };
};
