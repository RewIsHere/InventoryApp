import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./EditProductPage.module.css";
import { Card } from "@Structure";
import { Form, Input, SearchableSelect, TextArea, NumberInput } from "@Form"; // Asegúrate de importar NumberInput
import { Button } from "@Buttons";
import { useCategories } from "../hooks/useCategories";
import { useEditProduct } from "../hooks/useEditProduct";
import { getProductById } from "../services/productService"; // Servicio para obtener el producto por ID
import { ToastContext } from "../../../shared/context/ToastContext";
import { NavIconButton } from "@/shared/components/buttons";
import BackIcon from "@Assets/Back.svg?react";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useContext(ToastContext);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    barcode: "",
    category_id: "",
    min_stock: 0, // Agregado min_stock con valor inicial 0
  });

  const [errorDescripcion, setErrorDescripcion] = useState("");

  const {
    categories,
    loading: loadingCategories,
    error: errorCategories,
    createNewCategory,
  } = useCategories();

  const { loading, editProduct } = useEditProduct();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(id); // Obtener el producto por ID
        console.log("Datos del producto:", product); // Depuración

        if (product) {
          setFormData({
            name: product.name,
            description: product.description,
            barcode: product.barcode,
            category_id: product.category_id,
            min_stock: product.min_stock || 0, // Agregar min_stock, asegurando que sea un número
          });
        } else {
          addNotification("Producto no encontrado.", "error");
          navigate("/products");
        }
      } catch (error) {
        addNotification("Error al cargar el producto.", "error");
        navigate("/products");
      }
    };
    fetchProduct();
  }, [id, addNotification, navigate]);

  const handleInputChange = (name, value) => {
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

  const handleCreateOption = async (newOption) => {
    const trimmedName = newOption.trim();
    const newCategory = await createNewCategory(trimmedName);
    if (newCategory) {
      setFormData((prev) => ({ ...prev, category_id: newCategory.id }));
    }
  };

  const isValidBarcode = (barcode) => {
    const barcodeRegex = /^(?:\d{12}|\d{13})$/;
    return barcodeRegex.test(barcode);
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.barcode.trim() !== "" &&
      formData.category_id.trim() !== "" &&
      errorDescripcion === ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      addNotification(
        "Por favor, completa todos los campos correctamente.",
        "error"
      );
      return;
    }
    if (!isValidBarcode(formData.barcode)) {
      addNotification(
        "El código de barras debe tener 12 o 13 dígitos numéricos.",
        "error"
      );
      return;
    }
    try {
      const updatedProduct = await editProduct(id, formData);
      if (updatedProduct) {
        navigate("/products");
      }
    } catch (err) {
      console.error("Error al actualizar el producto:", err.message);
    }
  };

  const options = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  return (
    <div className={styles.addProductPage}>
      <div className={styles.mainContainer}>
        <Card className={styles.card}>
          <NavIconButton icon={<BackIcon />} size="medium" to="/products" />
          <h1>Editar Producto</h1>
          <Form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.generalInfoContainer}>
              <span className={styles.sectionTitle}>Información General</span>
              <Input
                label="Nombre"
                type="text"
                placeholder="Escribe el nombre"
                name="name"
                defaultValue={formData.name}
                onValueChange={handleInputChange}
                required
              />
              <div className={styles.secondInputsContainer}>
                <div className={styles.categoryContainer}>
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
                      onChange={(value) =>
                        handleInputChange("category_id", value)
                      }
                      label="Categoría"
                      value={formData.category_id}
                      required
                    />
                  )}
                </div>
                <div className={styles.barcodeContainer}>
                  <Input
                    label="Código de Barras"
                    type="text"
                    placeholder="Ingrese el código de barras"
                    name="barcode"
                    defaultValue={formData.barcode}
                    onValueChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <TextArea
                label="Descripción"
                placeholder="Descripción del producto..."
                value={formData.description}
                onChange={handleDescripcionChange}
                error={errorDescripcion}
                size="large"
              />
              {/* Nuevo campo min_stock */}
              <NumberInput
                label="Stock Mínimo"
                value={formData.min_stock} // Aquí pasamos el valor directamente desde formData
                min={0}
                step={1}
                onChange={(value) => handleInputChange("min_stock", value)}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="medium"
              disabled={loading || !isFormValid()}
            >
              {loading ? "Actualizando..." : "Guardar Cambios"}
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default EditProductPage;
