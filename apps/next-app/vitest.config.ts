/// <reference types="vitest" />
import { default as react } from "@vitejs/plugin-react";
import { default as viteTsConfigPaths } from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  cacheDir: "../../node_modules/.vite/next-app",

  plugins: [
    react(),
    viteTsConfigPaths({
      root: "../../",
    }),
  ],

  test: {
    globals: true,
    environment: "jsdom",
    cache: {
      dir: "../../node_modules/.vitest",
    },
    coverage: {
      all: true,
      provider: "istanbul",
    },
    include: [
      "src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "pages/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
  },
});
