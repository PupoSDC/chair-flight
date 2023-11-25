import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  framework: "@storybook/nextjs",
  stories: [
    "../**/*.stories.tsx",
    "../**/*.mdx",
    "../../../libs/react/**/src/**/*.stories.tsx",
    "../../../libs/react/**/src/**/*.mdx",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@nx/react/plugins/storybook",
    "storybook-dark-mode",
  ],
  staticDirs: ["../public"],
  typescript: {
    reactDocgen: "react-docgen-typescript",
    skipBabel: false,
    check: false,
  },
  features: {},
  webpackFinal: async (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        crypto: false,
      },
    },
    ignoreWarnings: [/Failed to parse source map/],
  }),
};

export default config;
