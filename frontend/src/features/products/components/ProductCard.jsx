// ProductCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css";
import { Card, ImageBox, Divider } from "@Structure";
import { Badge } from "@DataDisplay";
import { IconButton } from "@Buttons"; // Importar Modal
import { Modal } from "@Structure"; // Importar Modal
import DotsIcon from "@Assets/Dots.svg?react";
import ViewIcon from "@Assets/Redirect.svg?react";
import EditIcon from "@Assets/Edit.svg?react";
import DeleteIcon from "@Assets/Trash.svg?react";
import TagIcon from "@Assets/Tag.svg?react";
import { useDeleteProduct } from "../hooks/useDeleteProduct"; // Importar el hook
import { useProducts } from "../hooks/useProducts";

const ProductCard = ({ id, image, name, status, category, stock, barcode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const { loading, error, handleDeleteProduct } = useDeleteProduct();
  const { removeProductFromState } = useProducts(); // Obtener la función para eliminar del estado

  // Función para abrir el modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Función para manejar la eliminación
  const handleConfirmDelete = () => {
    handleDeleteProduct(id, () => {
      closeModal(); // Cerrar el modal después de eliminar
      removeProductFromState(id); // Eliminar el producto del estado local
    });
  };

  const options = [
    {
      icon: <ViewIcon />,
      text: (
        <Link to={`/product/${id}`} className={styles.link}>
          Detalles
        </Link>
      ),
    },
    {
      icon: <EditIcon />,
      text: (
        <Link to={`/product/edit/${id}`} className={styles.link}>
          Editar
        </Link>
      ),
    },
    {
      icon: <DeleteIcon className={styles.deleteicons} />,
      text: "Eliminar",
      onClick: openModal, // Abrir el modal al hacer clic en "Eliminar"
    },
  ];

  return (
    <>
      <Card className={styles.card}>
        {/* Imagen del producto */}
        <div className={styles.image}>
          <ImageBox
            width="100px"
            height="100px"
            src={
              image?.url ||
              "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png"
            }
            alt={name}
          />
        </div>
        {/* Nombre del producto */}
        <div className={styles.name}>
          <span className={styles.productname}>{name}</span>
        </div>
        {/* Estado y categoría */}
        <div className={styles.statusCategory}>
          <Badge
            text={status}
            color="white"
            backgroundColor={status === "ACTIVO" ? "#006fee" : "#ff4d4d"}
            className={styles.badge}
          />{" "}
          <span className={styles.productcategory}>
            {category}
            <TagIcon />
          </span>
        </div>
        {/* Separador vertical */}
        <div className={styles.divider}>
          <Divider
            orientation="vertical"
            size="1px"
            color="var(--color-navbar)"
            height="60%"
          />
        </div>
        {/* Títulos de stock y código de barras */}
        <div className={styles.stockTitle}>
          <span className={styles.titleText}>CANTIDAD DE STOCK</span>
        </div>
        <div className={styles.barcodeTitle}>
          <span className={styles.titleText}>CODIGO DE BARRAS</span>
        </div>
        {/* Valores de stock y código de barras */}
        <div className={styles.stock}>
          <span className={styles.value}>{stock}</span>
        </div>
        <div className={styles.barcode}>
          <span className={styles.value}>{barcode}</span>
        </div>
        {/* Menú de acciones */}
        <div className={styles.action}>
          <IconButton icon={<DotsIcon />} options={options} size="medium" />
        </div>
      </Card>

      {/* Modal de confirmación */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h3>¿Estás seguro de que deseas eliminar este producto?</h3>
        <p>Esta acción no se puede deshacer.</p>
        <div className={styles.modalActions}>
          <button onClick={closeModal} disabled={loading}>
            Cancelar
          </button>
          <button onClick={handleConfirmDelete} disabled={loading}>
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ProductCard;
