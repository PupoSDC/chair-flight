/// <reference types="vitest" />
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [viteTsConfigPaths({ root: "../../" })],

  test: {
    globals: true,
    include: ["**/*.{test,spec}.{ts,tsx}"],
    cache: {
      dir: "../../node_modules/.vitest",
    },
    coverage: {
      all: true,
      provider: "istanbul",
    },
  },

  define: {
    process: {
      env: {
        VERCEL_URL: "localhost:4200",
      },
    },
  },
});
