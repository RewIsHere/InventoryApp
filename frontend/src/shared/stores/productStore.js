// src/shared/stores/productStore.js
import { create } from "zustand";
import { listProducts } from "../../features/products/services/productService";

const useProductStore = create((set, get) => ({
  products: [], // Lista de productos
  loading: true,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1,
  },
  filters: {
    status: null,
    category: null,
    sort: "name_asc", // Orden predeterminado
    stock_alert: null,
  },

  // Función para cargar productos desde el backend
  fetchProducts: async (filters = {}, page = 1, limit = 5) => {
    set({ loading: true });
    try {
      const response = await listProducts({ ...filters, page, limit });
      const newProducts = Array.isArray(response.products)
        ? response.products
        : [];
      const newPagination = response.pagination || {};
      set({
        products:
          page === 1 ? newProducts : [...get().products, ...newProducts],
        pagination: newPagination,
        filters: { ...filters }, // Actualizar filtros actuales
        loading: false,
      });
    } catch (err) {
      set({
        error: err.message || "Ocurrió un error al cargar los productos.",
        loading: false,
      });
    }
  },

  // Función para eliminar un producto del estado
  removeProduct: (productId) => {
    set((state) => ({
      products: state.products.filter((product) => product.id !== productId),
    }));
  },

  // Función para aplicar filtros
  applyFilters: (filters = {}) => {
    set({ filters });
    get().fetchProducts(filters); // Recargar productos con los nuevos filtros
  },

  // Función para cargar más productos (paginación)
  loadMore: () => {
    const { pagination, filters } = get();
    if (pagination.page < pagination.totalPages) {
      get().fetchProducts(filters, pagination.page + 1);
    }
  },
}));

export default useProductStore;
