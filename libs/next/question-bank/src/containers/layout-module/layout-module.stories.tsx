import { trpcMsw } from "@cf/trpc/mock";
import { LayoutModule } from "./layout-module";
import { mockData } from "./layout-module.mock";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof LayoutModule>;

export const Playground: Story = {};

const meta: Meta<typeof LayoutModule> = {
  title: "Containers/Layouts/LayoutModule",
  component: LayoutModule,
  tags: ["autodocs"],
  args: {
    questionBank: "atpl",
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      story: {
        inline: false,
        iframeHeight: 500,
      },
    },
    msw: {
      handlers: [
        trpcMsw.containers.layouts.getLayoutModule.query(() => mockData),
      ],
    },
  },
};

export default meta;
