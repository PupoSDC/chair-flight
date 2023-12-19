import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  framework: {
    name: "@storybook/nextjs",
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  stories: [
    "../**/*.stories.tsx",
    "../**/*.mdx",
    "../../../libs/react/**/src/**/*.stories.tsx",
    "../../../libs/react/**/src/**/*.mdx",
  ],
  addons: ["@storybook/addon-essentials", "storybook-dark-mode"],
  staticDirs: ["../public"],
  typescript: {
    reactDocgen: "react-docgen-typescript",
    skipBabel: true,
  },
  features: {},
  webpackFinal: async (config) => ({
    ...config,
    ignoreWarnings: [/Failed to parse source map/],
  }),
};

export default config;
