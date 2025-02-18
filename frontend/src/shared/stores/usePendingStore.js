import { create } from "zustand";
import { listPending } from "../../features/pendingreviews/services/pendingService";

export const usePendingStore = create((set, get) => ({
  pendings: [], // Lista de productos pendientes
  loading: false, // Estado de carga
  error: null, // Mensaje de error
  fetchPending: async ({ search = "" } = {}) => {
    const { loading } = get();
    if (loading) return; // Evita llamadas innecesarias si ya está cargando
    set({ loading: true, error: null });
    try {
      const response = await listPending({ search }); // Llama al servicio
      console.log("RESPUESTA DEL BACKEND:", response);
      set({
        pendings: Array.isArray(response) ? response : [], // Asegúrate de que sea un array
        loading: false,
      });
    } catch (err) {
      set({
        error: err.message || "Ocurrió un error al cargar los movimientos.",
        loading: false,
      });
    }
  },
  removePendingFromState: (pendingID) => {
    set((state) => ({
      pendings: state.pendings.filter((pending) => pending.id !== pendingID),
    }));
  },
}));
