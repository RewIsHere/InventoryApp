import React, { useState, useEffect, useContext } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import styles from "./ProductLayout.module.css";
import { Card, Tabs, Modal } from "../../structure";
import { Button, IconButton, NavIconButton } from "../../buttons";
import { Switch, NumberInput, TextArea } from "../../form";
import useProductDetails from "../../../../features/products/hooks/useProductDetails";
import useToggleProductStatus from "../../../../features/products/hooks/useToggleProductStatus";
import useAdjustStock from "../../../../features/products/hooks/useAdjustStock";
import { useDeleteProduct } from "../../../../features/products/hooks/useDeleteProduct";
import { ToastContext } from "../../../context/ToastContext";
import BackIcon from "@Assets/Back.svg?react";

const tabs = [
  { key: "", label: "Información General" },
  { key: "history", label: "Historial" },
  { key: "notes", label: "Notas" },
];

const ProductLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useContext(ToastContext);
  const { productDetails, loading, error, refreshProduct } =
    useProductDetails(id);
  const {
    status,
    isLoading,
    error: toggleError,
    isCooldown,
    toggleStatus,
  } = useToggleProductStatus(id, productDetails?.status);
  const {
    adjustStock,
    loading: adjusting,
    error: adjustError,
  } = useAdjustStock(id);
  const {
    handleDeleteProduct,
    loading: deleting,
    error: deleteError,
  } = useDeleteProduct();

  const [isChecked, setIsChecked] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adjustment, setAdjustment] = useState(0);
  const [reason, setReason] = useState("");
  const [currentStock, setCurrentStock] = useState(productDetails?.stock || 0);

  useEffect(() => {
    if (productDetails) {
      setIsChecked(productDetails.status === "ACTIVE");
      setCurrentStock(productDetails.stock);
    }
  }, [productDetails]);

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  if (error || toggleError) {
    return <div>Error: {error || toggleError}</div>;
  }

  const handleSwitchChange = (newCheckedState) => {
    toggleStatus(newCheckedState ? "ACTIVE" : "INACTIVE");
    setIsChecked(newCheckedState);
  };

  const handleEditClick = () => {
    // Usamos navigate con la URL absoluta o correctamente relativa
    navigate(`/products/${id}/edit`);
  };

  const handleAdjustStockSubmit = async () => {
    if (!reason.trim()) {
      addNotification(
        "Debe ingresar una razón para ajustar el stock.",
        "error"
      );
      return;
    }

    try {
      await adjustStock(adjustment, reason);
      setCurrentStock((prevStock) => prevStock + adjustment);
      setAdjustment(0);
      setReason("");
      setIsModalOpen(false);
      addNotification("Stock ajustado correctamente.", "success");
      refreshProduct();
    } catch (err) {
      console.error("Error al ajustar el stock:", err);
    }
  };

  const handleDeleteProducts = async () => {
    try {
      await handleDeleteProduct(id);
      addNotification("Producto eliminado correctamente.", "success");
      navigate("/products");
    } catch (err) {
      console.error("Error al eliminar el producto:", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.nameContainer}>
          <NavIconButton icon={<BackIcon />} size="medium" to="/products" />
          <h1 className={styles.titleText}>
            {productDetails?.name || "Product Name"}
          </h1>
        </div>
        <div className={styles.actionsContainer}>
          <Switch
            label="Activo"
            checked={isChecked}
            onChange={handleSwitchChange}
            disabled={isCooldown}
          />
          <Button variant="outline" onClick={handleEditClick}>
            Editar
          </Button>
          <Button
            variant="outlineDanger"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Eliminar
          </Button>
        </div>
      </div>

      <div className={styles.sidebarContainer}>
        <Card className={styles.sidebar}>
          <span className={styles.stockTitle}>Stock</span>
          <Card className={styles.miniCard}>
            <span className={styles.stockSubTitle}>
              CANTIDAD DE STOCK ACTUAL
            </span>
            <span className={styles.stockVar}>{currentStock}</span>
          </Card>
          <Button variant="outline" onClick={() => setIsModalOpen(true)}>
            Ajustar Stock
          </Button>
        </Card>
      </div>

      <div className={styles.infoContainer}>
        <div className={styles.tabContainer}>
          <Tabs tabs={tabs} />
        </div>
        <div className={styles.childrenContainer}>
          <Outlet />
        </div>
      </div>

      {/* Modal para ajustar el stock */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Ajustar Stock</h2>
        <NumberInput
          label="Ajuste de stock"
          value={adjustment}
          min={-1000}
          max={1000}
          step={1}
          onChange={(value) => setAdjustment(value)}
        />
        <TextArea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Razón del ajuste"
        />
        <Button
          type="button"
          onClick={handleAdjustStockSubmit}
          disabled={adjusting}
        >
          {adjusting ? "Ajustando..." : "Ajustar Stock"}
        </Button>
        {adjustError && <p>{adjustError}</p>}
      </Modal>

      {/* Modal para eliminar producto */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <h2>Eliminar Producto</h2>
        <p>
          ¿Estás seguro de que deseas eliminar este producto? Esta acción no se
          puede deshacer.
        </p>
        {deleteError && <p className={styles.error}>{deleteError}</p>}
        <div className={styles.modalActions}>
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteProducts}
            disabled={deleting}
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductLayout;
