import { trpcMsw } from "@chair-flight/trpc/mock";
import { LayoutPublic } from "./layout-public";
import { mockData } from "./layout-public.mock";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof LayoutPublic>;

export const Playground: Story = {};

const meta: Meta<typeof LayoutPublic> = {
  title: "Containers/Layouts/LayoutPublic",
  component: LayoutPublic,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      story: {
        height: 200,
      },
    },
    msw: {
      handlers: [
        trpcMsw.containers.layouts.getLayoutPublic.query(() => mockData),
      ],
    },
  },
};

export default meta;
