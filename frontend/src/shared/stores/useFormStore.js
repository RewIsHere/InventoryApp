import { create } from "zustand";

const useFormStore = create((set) => ({
  formData: {
    username: "",
    name: "",
    surnames: "",
    email: "",
    password: "",
    role: "",
  },
  setFormData: (data) => set({ formData: { ...data } }),
  resetFormData: (data) => set({ formData: { ...data } }),
}));

export default useFormStore;
