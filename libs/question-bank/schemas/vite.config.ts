/// <reference types="vitest" />
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  cacheDir: "../../../node_modules/.vite/question-bank",

  plugins: [
    viteTsConfigPaths({
      root: "../../../",
    }),
  ],

  test: {
    globals: true,
    include: ["__tests__/**/*.{test,spec}.{ts,tsx}"],
    cache: {
      dir: "../../../node_modules/.vitest",
    },
    coverage: {
      all: true,
      provider: "istanbul",
    },
  },
});
