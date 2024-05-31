import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env': env
    },
    plugins: [react()],
    server: {
      proxy: {
        "/api": "http://localhost:3000"
      }
  }
}})

