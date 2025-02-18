import { useState, useContext } from "react";
import { updateUserService } from "../services/updateUserService"; // Ajusta la ruta del archivo de servicio
import { ToastContext } from "../../../shared/context/ToastContext";

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addNotification } = useContext(ToastContext);

  const updateUser = async (userId, updates) => {
    try {
      setLoading(true);
      setError(null);

      // Si no hay campos para actualizar, mostramos una notificación
      if (Object.keys(updates).length === 0) {
        addNotification(
          "No se proporcionaron cambios para actualizar.",
          "info"
        );
        return null;
      }

      // Llamar a la API para actualizar el usuario
      const response = await updateUserService(userId, updates);

      // Verificamos si la respuesta está presente y no tiene errores
      if (!response) {
        const errorMessage =
          "La respuesta del backend no contiene los datos esperados.";
        addNotification(errorMessage, "error");
        return null;
      }

      // Notificación de éxito
      addNotification("Usuario actualizado correctamente.", "success");

      // Devolvemos la respuesta directamente
      return response;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error.message || error);
      setError(error.message || "Ocurrió un error al actualizar el usuario.");
      addNotification(
        error.message || "Ocurrió un error al actualizar el usuario.",
        "error"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
};
