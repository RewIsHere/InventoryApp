import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css";
import { Card, ImageBox, Divider, Modal } from "@Structure";
import { Badge } from "@DataDisplay";
import { IconButton } from "@Buttons";
import DotsIcon from "@Assets/Dots.svg?react";
import ViewIcon from "@Assets/Redirect.svg?react";
import EditIcon from "@Assets/Edit.svg?react";
import DeleteIcon from "@Assets/Trash.svg?react";
import TagIcon from "@Assets/Tag.svg?react";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import useProductStore from "../../../shared/stores/productStore";

const ProductCard = ({ id, image, name, status, category, stock, barcode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading, handleDeleteProduct } = useDeleteProduct();
  const { removeProductFromState } = useProductStore();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleConfirmDelete = async () => {
    await handleDeleteProduct(id, () => {
      removeProductFromState(id);
      closeModal();
    });
  };

  const options = [
    {
      icon: <ViewIcon />,
      text: (
        <Link to={`/products/${id}/`} className={styles.link}>
          Detalles
        </Link>
      ),
    },
    {
      icon: <EditIcon />,
      text: (
        <Link to={`/products/${id}/edit/`} className={styles.link}>
          Editar
        </Link>
      ),
    },
    {
      icon: <DeleteIcon className={styles.deleteicons} />,
      text: "Eliminar",
      onClick: openModal,
    },
  ];

  return (
    <>
      <Card className={styles.card}>
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
        <div className={styles.name}>
          <span className={styles.productname}>{name}</span>
        </div>
        <div className={styles.statusCategory}>
          <Badge
            text={status}
            color="white"
            backgroundColor={status === "ACTIVO" ? "#006fee" : "#ff4d4d"}
            className={styles.badge}
          />
          <span className={styles.productcategory}>
            {category} <TagIcon />
          </span>
        </div>
        <div className={styles.divider}>
          <Divider
            orientation="vertical"
            size="1px"
            color="var(--color-text-secondary-opacity)"
            height="60%"
          />
        </div>
        <div className={styles.stockTitle}>
          <span className={styles.titleText}>CANTIDAD DE STOCK</span>
        </div>
        <div className={styles.barcodeTitle}>
          <span className={styles.titleText}>CÓDIGO DE BARRAS</span>
        </div>
        <div className={styles.stock}>
          <span className={styles.value}>{stock}</span>
        </div>
        <div className={styles.barcode}>
          <span className={styles.value}>{barcode}</span>
        </div>
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
