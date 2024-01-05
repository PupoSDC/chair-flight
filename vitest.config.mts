/// <reference types="vitest" />
import { default as react } from "@vitejs/plugin-react";
import { default as viteTsConfigPaths } from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  cacheDir: "./node_modules/.vite",

  plugins: [react(), viteTsConfigPaths({ root: "./" })],

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup-tests.ts",
    cache: {
      dir: "./node_modules/.vitest",
    },
    coverage: {
      all: true,
      provider: "istanbul",
    },
    include: [
      "apps/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "libs/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
  },
});

process.env.ENV_FILE_NAME = "TEST";
process.env.VERCEL_URL = "localhost:4200";
