import { useState } from "react";

export const useToast = () => {
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000); // Ocultar después de 3 segundos
  };

  return { toast, showToast };
};