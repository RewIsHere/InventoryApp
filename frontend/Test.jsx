import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./ProductList.module.css";
import ProductCard from "./ProductCard";
import { Pagination } from "@DataDisplay";
import useProductStore from "../../../shared/stores/productStore";

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    removeProductFromState,
  } = useProductStore();

  const transformStatusForBackend = (status) => {
    if (status === "ACTIVO") return "ACTIVE";
    if (status === "INACTIVO") return "INACTIVE";
    return status;
  };

  const currentFilters = useMemo(
    () => ({
      search: searchParams.get("search") || "", // Extrae el término de búsqueda
      status:
        searchParams.get("status") === "all"
          ? null
          : transformStatusForBackend(searchParams.get("status")),
      category:
        searchParams.get("category") === "all"
          ? null
          : searchParams.get("category"),
      sort: searchParams.get("sort") || "name_asc",
      stock_alert:
        searchParams.get("stock_alert") === "all"
          ? null
          : searchParams.get("stock_alert"),
      page: parseInt(searchParams.get("page") || "1", 10),
    }),
    [searchParams]
  );

  useEffect(() => {
    fetchProducts(currentFilters, currentFilters.page);
  }, [currentFilters, fetchProducts]);

  if (loading && products.length === 0) return <div>Cargando productos...</div>;
  if (error) return <div>Ocurrió un error: {error}</div>;
  if (!Array.isArray(products) || products.length === 0)
    return <div>No se encontraron productos.</div>;

  return (
    <div className={styles.productList}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          status={product.status === "ACTIVE" ? "ACTIVO" : "INACTIVO"}
          removeProductFromState={removeProductFromState}
        />
      ))}

      {pagination.totalPages > 1 && (
        <Pagination totalPages={pagination.totalPages} />
      )}
    </div>
  );
};

export default ProductList;
