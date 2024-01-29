import { trpcMsw } from "@chair-flight/trpc/mock";
import { OverviewModules } from "./overview-modules";
import { mockData } from "./overview-modules.mock";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof OverviewModules>;

export const Playground: Story = {};

const meta: Meta<typeof OverviewModules> = {
  title: "Containers/Overviews/OverviewModules",
  component: OverviewModules,
  tags: ["autodocs"],
  parameters: {
    msw: {
      handlers: [
        trpcMsw.containers.overviews.getOverviewModules.query(() => mockData),
      ],
    },
  },
};

export default meta;
