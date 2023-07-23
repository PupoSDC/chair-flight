import path from "node:path";
import { mergeConfig } from "vite";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: [
    "../**/*.stories.tsx",
    "../**/*.mdx",
    "../../../libs/react/**/src/**/*.stories.tsx",
    "../../../libs/react/**/src/**/*.mdx",
    "../../../libs/next/**/src/**/*.stories.tsx",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@nx/react/plugins/storybook",
    "storybook-dark-mode",
  ],
  staticDirs: [
    '../public'
  ],
  typescript: {
    reactDocgen: "react-docgen-typescript",
    skipBabel: true,
    check: false,
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@chair-flight/core/app": path.resolve(
            path.dirname(__dirname),
            "../../libs/core/app/src",
          ),
          "@chair-flight/react/components": path.resolve(
            path.dirname(__dirname),
            "../../libs/react/components/src",
          ),
          "@chair-flight/trpc/client": path.resolve(
            path.dirname(__dirname),
            "../../libs/trpc/client/src",
          ),
          "@chair-flight/question-bank/providers": path.resolve(
            path.dirname(__dirname),
            "../../libs/question-bank/providers/src",
          ),
          "@chair-flight/base/errors": path.resolve(
            path.dirname(__dirname),
            "../../libs/base/errors/src",
          ),
          "@chair-flight/base/env": path.resolve(
            path.dirname(__dirname),
            "../../libs/base/env/src",
          ),
        },
      },
    });
  },
};

export default config;
