// store/userStore.js
import { create } from "zustand";
import { listUsers } from "../../features/users/services/userService";

export const useUserStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,
  pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },

  fetchUsers: async (filters = {}) => {
    if (get().loading) return;
    set({ loading: true, error: null });

    try {
      // Filtrar valores vacíos o 'TODOS' para no enviarlos en la petición
      const validFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value && value !== "TODOS" && value !== "all"
        )
      );

      const response = await listUsers(validFilters);

      set((state) => {
        if (
          JSON.stringify(state.users) === JSON.stringify(response.users) &&
          JSON.stringify(state.pagination) ===
            JSON.stringify(response.pagination)
        ) {
          return { loading: false };
        }
        return {
          users: Array.isArray(response.users) ? response.users : [],
          pagination: response.pagination || {},
          loading: false,
        };
      });
    } catch (err) {
      set({ error: err.message || "Error al cargar usuarios", loading: false });
    }
  },

  removeUserFromState: (userId) => {
    set((state) => ({
      users: state.users.filter((user) => user.id !== userId),
    }));
  },
}));
