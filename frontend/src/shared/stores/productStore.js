import { create } from "zustand";
import { listProducts } from "../../features/products/services/productService";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  pagination: { total: 0, page: 1, limit: 5, totalPages: 1 },

  fetchProducts: async (
    { search = "", ...filters } = {},
    page = 1,
    limit = 5
  ) => {
    const { loading } = get();
    if (loading) return; // Evita llamadas innecesarias

    set({ loading: true, error: null });

    try {
      const response = await listProducts({ search, ...filters, page, limit });

      set((state) => {
        if (
          JSON.stringify(state.products) ===
            JSON.stringify(response.products) &&
          JSON.stringify(state.pagination) ===
            JSON.stringify(response.pagination)
        ) {
          return { loading: false }; // Evita actualizar si los datos son los mismos
        }

        return {
          products: Array.isArray(response.products) ? response.products : [],
          pagination: response.pagination || {},
          loading: false,
        };
      });
    } catch (err) {
      set({
        error: err.message || "Ocurrió un error al cargar los productos.",
        loading: false,
      });
    }
  },

  removeProductFromState: (productId) => {
    set((state) => ({
      products: state.products.filter((product) => product.id !== productId),
    }));
  },
}));

export default useProductStore;
