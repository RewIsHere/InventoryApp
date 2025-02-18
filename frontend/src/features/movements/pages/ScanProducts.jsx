import React, { useState, useEffect, useContext } from "react";
import { useScanProduct } from "../hooks/useScanProduct";
import { Input } from "@/shared/components/form";
import { Button } from "@/shared/components/buttons";
import { ToastContext } from "../../../shared/context/ToastContext";
import styles from "./ScanProducts.module.css";
import { useNavigate } from "react-router-dom";
import BackIcon from "@Assets/Back.svg?react";

const ScanProducts = () => {
  const navigate = useNavigate();

  const {
    scanProduct,
    updateQuantity,
    deleteProduct,
    scannedProducts,
    loading,
    error,
    tempMovement, // Ahora obtenemos la respuesta completa
    fetchTempMovement,
    confirmMovement,
    handleUnregisteredProducts,
  } = useScanProduct();

  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addNotification } = useContext(ToastContext);

  // Expresión regular para validar códigos de barras numéricos de 12 a 13 dígitos
  const barcodeRegex = /^[0-9]{12,13}$/;

  // Obtener el tempMovement al montar el componente
  useEffect(() => {
    fetchTempMovement();
  }, []);

  useEffect(() => {
    console.log("Productos escaneados actualizados:", scannedProducts);
  }, [scannedProducts]);

  // Función para escanear un producto
  const handleScan = async () => {
    if (!barcode || !barcodeRegex.test(barcode)) {
      addNotification(
        "El código de barras debe ser numérico y tener entre 12 y 13 dígitos.",
        "error"
      );
      return;
    }

    if (quantity <= 0 || !tempMovement?.id) {
      addNotification("Por favor, ingresa una cantidad válida.", "error");
      return;
    }

    try {
      await scanProduct(barcode, quantity, tempMovement.id);
    } catch (err) {
      console.error("Error al escanear el producto:", err.message);
      addNotification("Ocurrió un error al escanear el producto.", "error");
    } finally {
      setBarcode(""); // Limpiar el campo de código de barras
      setQuantity(1); // Restablecer la cantidad a 1
    }
  };

  // Función para actualizar la cantidad de un producto
  const handleUpdateQuantity = async (barcode, newQuantity) => {
    if (!tempMovement?.id) return;
    await updateQuantity(barcode, newQuantity, tempMovement.id);
  };

  // Función para eliminar un producto
  const handleDeleteProduct = async (barcode) => {
    if (!tempMovement?.id) return;
    await deleteProduct(barcode, tempMovement.id);
  };

  // Función para confirmar el movimiento
  const handleConfirmMovement = async () => {
    if (!tempMovement?.id) {
      addNotification(
        "No hay un carrito temporal disponible para confirmar.",
        "error"
      );
      return;
    }

    if (scannedProducts.length === 0) {
      addNotification(
        "No hay productos escaneados para confirmar el movimiento.",
        "error"
      );
      return;
    }

    try {
      const unregisteredProducts = await confirmMovement(tempMovement.id);
      if (unregisteredProducts && unregisteredProducts.length > 0) {
        addNotification(
          "Movimiento confirmado, pero hay productos no registrados pendientes.",
          "warning"
        );
        navigate("/movements");
        // Manejar productos no registrados
        const result = await handleUnregisteredProducts(
          tempMovement.id,
          unregisteredProducts
        );
        console.log(
          "Resultado del manejo de productos no registrados:",
          result
        );
      } else {
        addNotification("Movimiento confirmado correctamente.", "success");
        navigate("/movements");
      }
    } catch (err) {
      console.error("Error al confirmar el movimiento:", err.message);
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.backButton}
        onClick={() => navigate("/movements")}
      >
        <BackIcon /> VOLVER
      </button>
      <h3 className={styles.title}>Escanear Productos</h3>

      {/* Formulario para escanear productos */}
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label>Código de Barras</label>
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Ingresa el código de barras"
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Cantidad</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            placeholder="Cantidad"
          />
        </div>
        <Button onClick={handleScan} disabled={loading || !tempMovement?.id}>
          {loading ? "Escaneando..." : "Escanear Producto"}
        </Button>
      </div>

      {/* Mensajes de error */}
      {error && <p className={styles.error}>{error}</p>}

      {/* Tabla de productos escaneados */}
      <table className={styles.cartTable}>
        <thead>
          <tr>
            <th>Código de Barras</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {scannedProducts.length > 0 ? (
            scannedProducts.map((product, index) => (
              <tr key={`${product.barcode}-${index}`}>
                <td>{product.barcode}</td>
                <td>
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) =>
                      handleUpdateQuantity(
                        product.barcode,
                        Number(e.target.value)
                      )
                    }
                    min="1"
                  />
                </td>
                <td>
                  <Button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteProduct(product.barcode)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className={styles.emptyCart}>
                No hay productos escaneados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Botón para confirmar el movimiento */}
      <div className={styles.actions}>
        <Button
          className={styles.confirmButton}
          onClick={handleConfirmMovement}
          disabled={loading || !tempMovement?.id}
        >
          Confirmar Movimiento
        </Button>
      </div>
    </div>
  );
};

export default ScanProducts;
