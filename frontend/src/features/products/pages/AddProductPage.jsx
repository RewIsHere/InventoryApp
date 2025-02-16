import React, { useState, useContext } from "react";
import styles from "./AddProductPage.module.css";
import { Card, Divider } from "@Structure";
import {
  Form,
  FileUploader,
  Input,
  NumberInput,
  SearchableSelect,
  TextArea,
} from "@Form";
import { Button } from "@Buttons";
import { useCategories } from "../hooks/useCategories";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { ToastContext } from "../../../shared/context/ToastContext";
import { NavIconButton } from "@/shared/components/buttons";
import BackIcon from "@Assets/Back.svg?react";

const AddProductPage = () => {
  const { addNotification } = useContext(ToastContext);

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    barcode: "",
    stock: 0,
    min_stock: 0,
    status: "ACTIVE",
    category_id: "",
  });
  const [errorDescripcion, setErrorDescripcion] = useState("");
  const [isUploading, setIsUploading] = useState(false); // Estado de carga de archivo

  const {
    categories,
    loading: loadingCategories,
    error: errorCategories,
    createNewCategory,
  } = useCategories();

  const { loading, createNewProduct, uploadImage } = useCreateProduct();

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
      formData.stock > 0 &&
      formData.min_stock > 0 &&
      formData.category_id.trim() !== "" &&
      files.length > 0 &&
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

    if (files.length === 0) {
      addNotification("Debe subir al menos una imagen.", "error");
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
      const newProduct = await createNewProduct(formData);
      if (!newProduct) return; // Si no se crea el producto, no continúes

      setIsUploading(true);

      // Subir imágenes
      for (const file of files) {
        await uploadImage(newProduct.product.id, file);
      }

      setIsUploading(false);

      // Limpiar formulario y redirigir
      setFormData({
        name: "",
        description: "",
        barcode: "",
        stock: 0,
        min_stock: 0,
        status: "ACTIVE",
        category_id: "",
      });
      setFiles([]);
    } catch (err) {
      setIsUploading(false); // Asegúrate de detener la carga de archivos en caso de error
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
          <h1>Agregar Producto</h1>
          <Form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.generalInfoContainer}>
              <span className={styles.sectionTitle}>Información General</span>
              <Input
                label="Nombre"
                type="text"
                placeholder="Escribe el nombre"
                name="name"
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
            </div>
            <Divider
              orientation="horizontal"
              size="1px"
              color="#333030"
              height="60%"
            />
            <div className={styles.stockInfoContainer}>
              <span className={styles.sectionTitle}>Cantidad de Stock</span>
              <div className={styles.stockInputsContainer}>
                <NumberInput
                  label="Stock"
                  value={formData.stock}
                  min={0}
                  step={1}
                  name="stock"
                  onChange={(value) => handleInputChange("stock", value)}
                  required
                />
                <NumberInput
                  label="Mínimo de Stock"
                  value={formData.min_stock}
                  min={0}
                  step={1}
                  name="min_stock"
                  onChange={(value) => handleInputChange("min_stock", value)}
                  required
                />
              </div>
            </div>
            <Divider
              orientation="horizontal"
              size="1px"
              color="#333030"
              height="60%"
            />
            <div className={styles.imgContainer}>
              <span className={styles.sectionTitle}>Imágenes del Producto</span>
              <FileUploader
                onFilesChange={setFiles}
                label="Imágenes"
                required
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="medium"
              disabled={loading || !isFormValid() || isUploading}
            >
              {isUploading ? "Subiendo..." : "Guardar Producto"}
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddProductPage;
