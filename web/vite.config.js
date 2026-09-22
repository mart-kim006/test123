import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  server: { hmr: { clientPort: 5173 } },
});
