import React from "react";
import styles from "./LowStock.module.css";
import LowStockCard from "./LowStockCard";
import useLowStockProducts from "../hooks/useLowStockProducts";

const LowStock = () => {
  const { products, loading, error } = useLowStockProducts();

  // Imagen por defecto para productos sin imagen
  const defaultImage =
    "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png";

  if (loading) {
    // Muestra múltiples LowStockCard con estado de carga
    return (
      <div className={styles.LowStockContainer}>
        <div className={styles.title}>
          <p>Productos con Stock Bajo</p>
        </div>
        <div className={styles.products}>
          {[...Array(5)].map((_, index) => (
            <LowStockCard
              key={index}
              isLoading={true} // Indica que está cargando
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.LowStockContainer}>
      <div className={styles.title}>
        <p>Los 5 Productos con Stock Bajo</p>
      </div>
      <div className={styles.products}>
        {products.length > 0 ? (
          products.map((product, index) => {
            // Validar si la imagen es "No Image" o no está disponible
            const imageSrc =
              product.image &&
              String(product.image).trim().toLowerCase() !== "no image"
                ? product.image
                : defaultImage;

            return (
              <LowStockCard
                key={index}
                productName={product.name}
                productCategory={product.category}
                productStock={product.stock}
                imageSrc={imageSrc} // Usa la imagen validada
                productLink={`/products/${product.id}`}
              />
            );
          })
        ) : (
          <div className={styles.noProducts}>
            No hay productos con stock bajo.
          </div>
        )}
      </div>
    </div>
  );
};

export default LowStock;
