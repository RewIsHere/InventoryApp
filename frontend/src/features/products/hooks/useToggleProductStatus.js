import { useState } from "react";
import { toggleProductStatus } from "../services/productService"; // Importamos el servicio

const useToggleProductStatus = (id, initialStatus) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(initialStatus);
  const [isCooldown, setIsCooldown] = useState(false); // Estado para manejar el cooldown

  const toggleStatus = async (newStatus) => {
    if (isCooldown) return; // Si está en cooldown, no hacer nada

    setIsLoading(true);
    setError(null);

    try {
      await toggleProductStatus(id, newStatus);
      setStatus(newStatus); // Actualizamos el estado local con el nuevo status
      setIsCooldown(true); // Activamos el cooldown

      // Establecemos el cooldown de 2 segundos (ajustable)
      setTimeout(() => {
        setIsCooldown(false); // Desactivamos el cooldown después de 2 segundos
      }, 2000); // 2000 ms = 2 segundos
    } catch (err) {
      setError(err.message); // Guardamos el error si ocurre
    } finally {
      setIsLoading(false);
    }
  };

  return {
    status,
    isLoading,
    error,
    isCooldown,
    toggleStatus,
  };
};

export default useToggleProductStatus;
