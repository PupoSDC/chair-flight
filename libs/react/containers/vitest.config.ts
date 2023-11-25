/// <reference types="vitest" />
import { default as react } from "@vitejs/plugin-react";
import { default as viteTsConfigPaths } from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  cacheDir: "../../../node_modules/.vite/chair-flight-components",
  plugins: [
    react(),
    viteTsConfigPaths({
      root: "../../../",
    }),
  ],

  test: {
    globals: true,
    cache: {
      dir: "../../../node_modules/.vitest",
    },
    coverage: {
      all: true,
      provider: "istanbul",
    },
    deps: {
      optimizer: {
        web: {
          include: ["storybook/nextjs", "next/config"],
        },
      },
    },
    environment: "jsdom",
    setupFiles: "./src/__tests__/setup-tests.ts",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
