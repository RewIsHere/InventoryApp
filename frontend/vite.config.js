import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@Components": path.resolve(__dirname, "./src/shared/components"),
      "@Buttons": path.resolve(__dirname, "./src/shared/components/buttons"),
      "@Form": path.resolve(__dirname, "./src/shared/components/form"),
      "@DataDisplay": path.resolve(
        __dirname,
        "./src/shared/components/data-display"
      ),
      "@Navigation": path.resolve(
        __dirname,
        "./src/shared/components/navigation"
      ),
      "@Structure": path.resolve(
        __dirname,
        "./src/shared/components/structure"
      ),
      "@Toast": path.resolve(__dirname, "./src/shared/components/toast/Toast"),
      "@Layout": path.resolve(__dirname, "./src/shared/components/layout"),
      "@Auth": path.resolve(__dirname, "./src/features/authentication"),
      "@Dashboard": path.resolve(__dirname, "./src/features/dashboard"),
      "@Products": path.resolve(__dirname, "./src/features/products"),
      "@Movements": path.resolve(__dirname, "./src/features/movements"),
      "@Users": path.resolve(__dirname, "./src/features/users"),
      "@Assets": path.resolve(__dirname, "./src/assets"),
      "@Stores": path.resolve(__dirname, "./src/shared/stores"),
    },
  },
});
