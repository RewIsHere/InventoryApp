// store.js
import { create } from "zustand";

const useStore = create((set) => ({
  tempMovementId: null,
  setTempMovementId: (id) => {
    console.log("Estableciendo temp_movement_id en el store:", id); // Depuración
    set({ tempMovementId: id });
  },
}));

export default useStore;
