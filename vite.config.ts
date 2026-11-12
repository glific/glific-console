import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { parseEnv } from "./src/lib/env";

export default defineConfig(({ mode }) => {
  // Fail fast at dev/build start rather than at the first API call.
  parseEnv(loadEnv(mode, process.cwd(), "VITE_"));

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    build: { target: "es2023" },
  };
});
