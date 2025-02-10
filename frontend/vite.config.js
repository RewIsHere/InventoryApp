import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@Components": path.resolve(__dirname, "./src/shared/components"),
      "@Buttons": path.resolve(__dirname, "./src/shared/components/buttons"),
      "@Form": path.resolve(__dirname, "./src/shared/components/form"),
      "@DataDisplay": path.resolve(__dirname, "./src/shared/components/data-display"),
      "@Navigation": path.resolve(__dirname, "./src/shared/components/navigation"),
      "@Structure": path.resolve(__dirname, "./src/shared/components/structure"),
      "@Toast": path.resolve(__dirname, "./src/shared/components/toast/Toast"),

    },
  },
})
