import { mergeConfig } from "vite";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/**/*.stories.tsx", "../src/**/*.mdx"],
  addons: [
    "@storybook/addon-essentials",
    "@nx/react/plugins/storybook",
    "storybook-dark-mode",
  ],
  typescript: {
    reactDocgen: "react-docgen-typescript",
    skipBabel: true,
    check: false,
  },
  async viteFinal(config) {
    return mergeConfig(config, {});
  },
};

export default config;
