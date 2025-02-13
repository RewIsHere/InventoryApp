import React from "react";
import styles from "./LowStockCard.module.css";
import { Card, ImageBox } from "@Structure";
import { Skeleton } from "@Structure"; // Importa tu componente Skeleton

const LowStockCard = ({
  productName = "Producto desconocido",
  productCategory = "Categoría desconocida",
  productStock = 0,
  imageSrc = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png",
  productLink = "/test",
  isLoading = false, // Propiedad para manejar el estado de carga
}) => {
  return (
    <Card
      isPressable={isLoading ? undefined : true}
      to={productLink}
      className={styles.card}
    >
      {/* Imagen */}
      {isLoading ? (
        <Skeleton
          isLoading={true}
          borderRadius="25px"
          style={{ width: "100%", height: "150px" }}
        />
      ) : (
        <ImageBox
          src={imageSrc}
          alt={productName}
          width="100%"
          height="150px"
          borderRadius="25px"
        />
      )}
      {/* Detalles del producto */}
      <div className={styles.ProductDetails}>
        {/* Nombre del producto */}
        {isLoading ? (
          <Skeleton
            isLoading={true}
            style={{
              width: "80%",
              height: "20px",
              marginBottom: "8px",
              marginTop: "10px",
              marginLeft: "auto", // Alinea el esqueleto a la derecha
            }}
          />
        ) : (
          <p className={styles.ProductName}>{productName}</p>
        )}
        {/* Categoría */}
        {isLoading ? (
          <Skeleton
            isLoading={true}
            style={{
              width: "60%",
              height: "16px",
              marginBottom: "8px",
              marginLeft: "auto", // Alinea el esqueleto a la derecha
            }}
          />
        ) : (
          <span className={styles.ProductCategory}>{productCategory}</span>
        )}
        {/* Stock */}
        {isLoading ? (
          <Skeleton
            isLoading={true}
            style={{
              width: "40%",
              height: "16px",
              marginLeft: "auto", // Alinea el esqueleto a la derecha
            }}
          />
        ) : (
          <span className={styles.ProductStock}>{productStock} en stock</span>
        )}
      </div>
    </Card>
  );
};

export default LowStockCard;
