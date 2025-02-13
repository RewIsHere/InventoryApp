import { useState, useEffect } from "react";
import { listProducts } from "../services/productService";

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]); // Almacena todos los productos cargados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  }); // Información de paginación

  // Función para cargar productos desde el backend
  const fetchProducts = async (filters = {}, page = 1, limit = 20) => {
    setLoading(true);
    try {
      const response = await listProducts({ ...filters, page, limit });
      const newProducts = Array.isArray(response.products)
        ? response.products
        : [];
      const newPagination = response.pagination || {};

      // Si es la primera página, reemplazar los productos; si no, agregarlos
      if (page === 1) {
        setProducts(newProducts);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...newProducts]);
      }

      // Actualizar la información de paginación
      setPagination(newPagination);
    } catch (err) {
      setError(err.message || "Ocurrió un error al cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar productos iniciales o actualizar cuando cambian los filtros
  useEffect(() => {
    const { page = 1, ...otherFilters } = filters;
    fetchProducts(otherFilters, page); // Usar el parámetro `page` de los filtros
  }, [filters]); // Dependencia: `filters` (incluye `page`)

  // Función para cargar más productos (paginación infinita)
  const loadMore = () => {
    if (!loading && pagination.page < pagination.totalPages) {
      const nextPage = pagination.page + 1;
      fetchProducts(filters, nextPage);
    }
  };

  return { products, loading, error, pagination, loadMore };
};
