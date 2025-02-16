import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetailsPage.module.css";
import { Card } from "@/shared/components/structure";
import { ImageGallery } from "@/shared/components/data-display";
import { getProductById } from "../../services/productService"; // Asegúrate de importar correctamente tu servicio

const ProductDetailsPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  const { name, description, barcode, created_by, category, images } = product;

  // Verificar que images existe y no esté vacío
  const imageUrls = images?.map((image) => image.image_url) || [];

  return (
    <Card className={styles.card}>
      {/* Solo renderiza ImageGallery si hay imágenes disponibles */}
      {imageUrls.length > 0 && <ImageGallery images={imageUrls} />}

      <div className={styles.infoBox}>
        <div className={styles.category}>
          <span className={styles.title}>CATEGORIA</span>
          <span className={styles.var}>{category?.name || "Desconocida"}</span>
        </div>
        <div className={styles.barcode}>
          <span className={styles.title}>CODIGO DE BARRAS</span>
          <span className={styles.var}>{barcode || "No disponible"}</span>
        </div>
        <div className={styles.desc}>
          <span className={styles.title}>DESCRIPCION</span>
          <span className={styles.var}>{description || "Sin descripción"}</span>
        </div>
        <div className={styles.author}>
          <span className={styles.title}>CREADO POR</span>
          <span className={styles.var}>{created_by || "Desconocido"}</span>
        </div>
      </div>
    </Card>
  );
};

export default ProductDetailsPage;
