import React, { useState } from "react";
import Modal from "./shared/components/structure/Modal"; // Ajusta la ruta según tu estructura de carpetas

const Test = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Prueba de Modal</h2>
      <button onClick={handleOpenModal} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Abrir Modal
      </button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h3>Este es un Modal</h3>
        <p>El contenido del modal puede ser cualquier cosa.</p>
        <button onClick={handleCloseModal} style={{ padding: "10px 20px" }}>
          Cerrar Modal
        </button>
      </Modal>
    </div>
  );
};

export default Test;
