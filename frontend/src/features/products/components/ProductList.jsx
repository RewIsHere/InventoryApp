// ProductList.jsx
import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./ProductList.module.css";
import ProductCard from "./ProductCard";
import { Pagination } from "@DataDisplay"; // Importar el componente Pagination
import { useProducts } from "../hooks/useProducts";

const ProductList = () => {
  const [searchParams] = useSearchParams();

  // Función para transformar el estado de la URL al formato del backend
  const transformStatusForBackend = (status) => {
    if (status === "ACTIVO") return "ACTIVE";
    if (status === "INACTIVO") return "INACTIVE";
    return status; // Mantener el valor original si no coincide con los casos conocidos
  };

  // Extraer los query params de la URL
  const currentFilters = useMemo(() => {
    return {
      status:
        searchParams.get("status") === "all"
          ? null
          : transformStatusForBackend(searchParams.get("status")),
      category:
        searchParams.get("category") === "all"
          ? null
          : searchParams.get("category"),
      sort: searchParams.get("sort") || "name_asc", // Orden predeterminado: "name_asc"
      stock_alert:
        searchParams.get("stock_alert") === "all"
          ? null
          : searchParams.get("stock_alert"),
      page: parseInt(searchParams.get("page") || "1", 10), // Obtener el número de página actual
    };
  }, [searchParams]);

  // Usar el hook useProducts con los filtros actuales
  const {
    products,
    loading,
    error,
    pagination,
    loadMore,
    removeProductFromState,
  } = useProducts(currentFilters);

  // Manejar la carga inicial de productos
  useEffect(() => {
    // No es necesario aplicar filtros manualmente aquí porque ya están incluidos en `currentFilters`
  }, [currentFilters]);

  if (loading && products.length === 0) {
    return <div>Cargando productos...</div>;
  }

  if (error) {
    return <div>Ocurrió un error: {error}</div>;
  }

  if (!Array.isArray(products) || products.length === 0) {
    return <div>No se encontraron productos.</div>;
  }

  return (
    <div className={styles.productList}>
      {/* Lista de productos */}
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          status={product.status === "ACTIVE" ? "ACTIVO" : "INACTIVO"} // Transformar estado para el frontend
          removeProductFromState={removeProductFromState} // Pasar la función para eliminar productos
        />
      ))}

      {/* Componente de paginación */}
      {pagination.totalPages > 1 && (
        <Pagination totalPages={pagination.totalPages} />
      )}
    </div>
  );
};

export default ProductList;
