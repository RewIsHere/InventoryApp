import React, { useContext } from "react";
import { ToastContext } from "./shared/context/ToastContext";

const Test = () => {
  const { addNotification } = useContext(ToastContext);

  return (
    <div>
      <h1>Componente Toast</h1>
      <button onClick={() => addNotification("¡Operación exitosa!", "success")}>
        Mostrar Notificación
      </button>
      <button onClick={() => addNotification("¡Algo salió mal!", "error")}>
        Mostrar Error
      </button>
      <button onClick={() => addNotification("¡Advertencia!", "warning")}>
        Mostrar Advertencia
      </button>
      <button onClick={() => addNotification("¡Información!", "info")}>
        Mostrar Información
      </button>
    </div>
  );
};

export default Test;