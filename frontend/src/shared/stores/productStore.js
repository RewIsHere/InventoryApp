// productStore.js
import { create } from "zustand";

const useProductStore = create((set) => ({
  products: [], // Estado inicial para los productos
  setProducts: (newProducts) => set({ products: newProducts }), // Función para actualizar todos los productos
  removeProduct: (productId) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== productId),
    })), // Función para eliminar un producto por su ID
}));

export default useProductStore;
