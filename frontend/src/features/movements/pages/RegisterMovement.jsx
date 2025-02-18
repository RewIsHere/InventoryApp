import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPendingMovementService } from "../services/movementService";
import { useDeleteTempMovement } from "../hooks/useDeleteTempMovement";
import { useStartMovement } from "../hooks/useStartMovement";
import useStore from "@/shared/stores/useStore";
import styles from "./RegisterMovement.module.css";
import BackIcon from "@Assets/Back.svg?react";

const RegisterMovement = () => {
  const navigate = useNavigate();
  const [tempMovementId, setTempMovementId] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [movementType, setMovementType] = useState("");
  const {
    deleteTempMovement,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteTempMovement();
  const {
    startMovement,
    loading: startLoading,
    error: startError,
  } = useStartMovement();
  const { setTempMovementId: setGlobalTempMovementId } = useStore();

  // Verificar si ya existe un movimiento temporal al montar el componente
  useEffect(() => {
    const checkExistingMovement = async () => {
      try {
        const response = await getPendingMovementService();
        if (response && response.id) {
          setTempMovementId(response.id); // Usamos el 'id' recibido de la API
          setShowOptions(true);
        } else {
          console.log("No se encontró ningún movimiento temporal.");
        }
      } catch (err) {
        console.error(
          "Error al verificar el movimiento temporal:",
          err.message
        );
      }
    };
    checkExistingMovement();
  }, []);

  // Función para restaurar el movimiento temporal
  const handleRestoreMovement = () => {
    navigate("/movements/scan");
  };

  // Función para crear un nuevo movimiento
  const handleCreateNewMovement = async () => {
    if (!tempMovementId) return;
    try {
      await deleteTempMovement(tempMovementId);
      setShowOptions(false);
      setTempMovementId(null);
    } catch (err) {
      console.error("Error al crear un nuevo movimiento:", err.message);
    }
  };

  // Función para manejar cambios en el tipo de movimiento
  const handleMovementChange = (e) => {
    setMovementType(e.target.value);
  };

  // Función para iniciar un nuevo movimiento
  const handleStartMovement = async () => {
    if (!movementType) {
      alert("Por favor, selecciona un tipo de movimiento (Entrada o Salida).");
      return;
    }
    try {
      const response = await startMovement(movementType);
      if (response && response.tempMovement) {
        setGlobalTempMovementId(response.tempMovement.id);
        navigate("/movements/scan");
      } else {
        console.error("Error al iniciar el movimiento:", response?.message);
        alert(
          "Ocurrió un error al iniciar el movimiento. Por favor, intenta nuevamente."
        );
      }
    } catch (err) {
      console.error("Error al iniciar el movimiento:", err.message);
      alert(
        "Ocurrió un error al iniciar el movimiento. Por favor, intenta nuevamente."
      );
    }
  };

  return (
    <div className={styles.container}>
      {/* Botón de retroceso */}
      <button
        className={styles.backButton}
        onClick={() => navigate("/movements")}
      >
        <BackIcon /> VOLVER
      </button>

      {/* Card principal */}
      <div className={styles.card}>
        <h2 className={styles.title}>Registrar Entrada/Salida</h2>

        {/* Mostrar opciones si hay un movimiento temporal */}
        {showOptions ? (
          <div className={styles.optionsContainer}>
            <p className={styles.normaltext}>
              Se ha detectado un movimiento temporal activo.
            </p>
            <button
              className={styles.optionButton}
              onClick={handleRestoreMovement}
              disabled={deleteLoading}
            >
              Restaurar Movimiento
            </button>
            <button
              className={styles.optionButton}
              onClick={handleCreateNewMovement}
              disabled={deleteLoading}
            >
              Crear Nuevo Movimiento
            </button>
            {deleteError && <p className={styles.error}>{deleteError}</p>}
          </div>
        ) : (
          // Mostrar formulario para iniciar un nuevo movimiento
          <div>
            <div className={styles.movementType}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="movementType"
                  value="ENTRY"
                  checked={movementType === "ENTRY"}
                  onChange={handleMovementChange}
                  className={styles.radioInput}
                />
                <span className={styles.radioCustom}></span>
                Entrada
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="movementType"
                  value="EXIT"
                  checked={movementType === "EXIT"}
                  onChange={handleMovementChange}
                  className={styles.radioInput}
                />
                <span className={styles.radioCustom}></span>
                Salida
              </label>
            </div>
            <button
              className={styles.startButton}
              onClick={handleStartMovement}
              disabled={startLoading || !movementType}
            >
              {startLoading ? "Iniciando movimiento..." : "Iniciar Escaneo"}
            </button>
            {startError && <p className={styles.error}>{startError}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterMovement;
