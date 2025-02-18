import React, { useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./PendingDetails.module.css";
import { Card } from "@Structure";
import { NavIconButton } from "@Buttons";
import BackIcon from "@Assets/Back.svg?react";
import { usePendingDetails } from "../hooks/usePendingDetails";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { Button } from "@/shared/components/buttons";
import { Modal } from "@/shared/components/structure";
import { SearchableSelect } from "@Form"; // Importa tu componente SearchableSelect
import { registerPendingProduct } from "../services/registerPendingProductService"; // Servicio para registrar el producto
import { useCategories } from "../../products/hooks/useCategories"; // Hook para cargar categorías
import { Input, NumberInput, TextArea } from "@/shared/components/form";
import { ToastContext } from "../../../shared/context/ToastContext";
import { useNavigate } from "react-router-dom";

const PendingDetails = () => {
  const { id } = useParams();
  const { pending, loading, error } = usePendingDetails(id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addNotification } = useContext(ToastContext);
  const navigate = useNavigate();

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    min_stock: 0,
    category_id: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [errorDescripcion, setErrorDescripcion] = useState("");

  // Cargar categorías
  const {
    categories,
    loading: loadingCategories,
    error: errorCategories,
    createNewCategory,
  } = useCategories();

  if (loading) {
    return <p className={styles.loadingText}>Cargando detalles...</p>;
  }

  if (error) {
    return <p className={styles.errorText}>Error: {error}</p>;
  }

  if (!pending) {
    return (
      <p className={styles.errorText}>Producto pendiente no encontrado.</p>
    );
  }

  // Formatear la fecha en la zona horaria de México
  const mexicoTimeZone = "America/Mexico_City";
  const formattedDate = formatInTimeZone(
    pending.created_at,
    mexicoTimeZone,
    "dd/MM/yyyy HH:mm:ss",
    { locale: es }
  );

  // Manejadores para abrir y cerrar el modal
  const handleOpenModal = () => {
    if (!pending.barcode || !pending.quantity) {
      alert(
        "Los campos 'Código de Barras' y 'Cantidad' son obligatorios para continuar."
      );
      return;
    }
    setIsModalOpen(true);
  };

  const handleCreateOption = async (newOption) => {
    const trimmedName = newOption.trim();
    const newCategory = await createNewCategory(trimmedName);
    if (newCategory) {
      setFormData((prev) => ({ ...prev, category_id: newCategory.id }));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      description: "",
      min_stock: 0,
      category_id: "",
    });
    setSubmitError(null);
  };

  // Manejador para actualizar el estado del formulario
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescripcionChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, description: value }));
    setErrorDescripcion(
      value.length < 5 && value.length > 0
        ? "Debe tener al menos 5 caracteres"
        : ""
    );
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.min_stock > 0 &&
      formData.category_id.trim() !== "" &&
      errorDescripcion === ""
    );
  };
  // Manejador para enviar el formulario
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      addNotification(
        "Por favor, completa todos los campos correctamente.",
        "error"
      );
      return;
    }
    try {
      const result = await registerPendingProduct(id, formData);
      if (result) {
        addNotification("Producto creado correctamente.", "success");
        navigate("/products");
      }
    } catch (err) {
      setSubmitError(
        err.message || "Ocurrió un error al registrar el producto."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // Mapear categorías para el componente SearchableSelect
  const options = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.nameContainer}>
          <NavIconButton icon={<BackIcon />} size="medium" to="/pendings" />
          <h1 className={styles.titleText}>ID: {pending.id}</h1>
        </div>
      </div>
      <div className={styles.sidebarContainer}>
        <Card className={styles.sidebar}>
          <span className={styles.userTitle}>Agregar producto</span>
          <Button
            onClick={handleOpenModal}
            disabled={!pending.barcode || !pending.quantity}
          >
            Agregar Producto
          </Button>
        </Card>
      </div>
      <div className={styles.infoContainer}>
        <Card className={styles.mainC}>
          <span className={styles.userTitle}>Información</span>
          <Card className={styles.miniCard}>
            <span className={styles.userSubTitle}>
              Usuario que creó el registro
            </span>
            <span className={styles.userVar}>
              {pending.created_by?.name || "Desconocido"}
            </span>
          </Card>
          <Card className={styles.miniCard}>
            <span className={styles.userSubTitle}>CÓDIGO DE BARRAS</span>
            <span className={styles.userVar}>{pending.barcode}</span>
          </Card>
          <Card className={styles.miniCard}>
            <span className={styles.userSubTitle}>CANTIDAD</span>
            <span className={styles.userVar}>{pending.quantity}</span>
          </Card>
          <Card className={styles.miniCard}>
            <span className={styles.userSubTitle}>FECHA DE CREACIÓN</span>
            <span className={styles.userVar}>{formattedDate}</span>
          </Card>
          <Card className={styles.miniCard}>
            <span className={styles.userSubTitle}>MOVIMIENTO RELACIONADO</span>
            <span className={styles.userVar}>
              {" "}
              <Link
                to={`/movements/${pending.movement.id}/`}
                className={styles.link}
              >
                VER
              </Link>
            </span>
          </Card>
        </Card>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <form onSubmit={handleFormSubmit}>
          <h2>Agregar Producto</h2>
          <div>
            <Input
              label="Nombre"
              placeholder="Escribe el nombre"
              name="name"
              value={formData.name}
              onValueChange={(name, value) => handleChange(name, value)}
              required
            />
          </div>
          <div>
            <TextArea
              label="Descripción"
              placeholder="Descripción del producto..."
              value={formData.description}
              onChange={handleDescripcionChange}
              error={errorDescripcion}
              size="large"
            />
          </div>
          <div>
            <label>Stock Mínimo:</label>
            <NumberInput
              name="min_stock"
              value={formData.min_stock}
              min={0}
              onChange={(value) => handleChange("min_stock", value)}
              required
            />
          </div>
          <div>
            {loadingCategories ? (
              <p>Cargando categorías...</p>
            ) : errorCategories ? (
              <p>Error al cargar categorías: {errorCategories}</p>
            ) : (
              <SearchableSelect
                options={options}
                onCreateOption={handleCreateOption}
                placeholder="Elige una categoría..."
                actionLabel="Crear"
                onChange={(value) => handleChange("category_id", value)}
                label="Categoría"
                value={formData.category_id}
                required
              />
            )}
          </div>
          <div>
            <Button type="submit" disabled={submitLoading}>
              {submitLoading ? "Registrando..." : "Registrar"}
            </Button>
            <Button onClick={handleCloseModal}>Cancelar</Button>
          </div>
          {submitError && <p style={{ color: "red" }}>{submitError}</p>}
        </form>
      </Modal>
    </div>
  );
};

export default PendingDetails;
