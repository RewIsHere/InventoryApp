import { create } from "zustand";
import { listMovements } from "../../features/movements/services/movementService";

export const useMovementStore = create((set, get) => ({
  movements: [],
  loading: false,
  error: null,
  pagination: { total: 0, page: 1, limit: 5, totalPages: 1 },

  fetchMovements: async (
    { search = "", type = "" } = {},
    page = 1,
    limit = 5
  ) => {
    const { loading } = get();
    if (loading) return; // Evita llamadas innecesarias

    set({ loading: true, error: null });

    try {
      const response = await listMovements({
        search,
        type,
        page,
        limit,
      });

      set((state) => {
        if (
          JSON.stringify(state.movements) ===
            JSON.stringify(response.movements) &&
          JSON.stringify(state.pagination) ===
            JSON.stringify(response.pagination)
        ) {
          return { loading: false }; // Evita actualizar si los datos son los mismos
        }

        return {
          movements: Array.isArray(response.movements)
            ? response.movements
            : [],
          pagination: response.pagination || {},
          loading: false,
        };
      });
    } catch (err) {
      set({
        error: err.message || "Ocurrió un error al cargar los movimientos.",
        loading: false,
      });
    }
  },

  removeMovementFromState: (movementId) => {
    set((state) => ({
      movements: state.movements.filter(
        (movement) => movement.id !== movementId
      ),
    }));
  },
}));

export default useMovementStore;
