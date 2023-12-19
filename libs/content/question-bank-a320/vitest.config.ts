/// <reference types="vitest" />
import viteTsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [viteTsConfigPaths({ root: "../../" })],

  test: {
    globals: true,
    reporters: ["default"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    cache: {
      dir: "../../../node_modules/.vitest",
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
