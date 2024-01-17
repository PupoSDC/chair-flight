import { trpcMsw } from "@chair-flight/trpc/mock";
import { OverviewModules } from "./overview-modules";
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
        trpcMsw.questionBank.getNumberOfFlashcards.query(() => ({ count: 77 })),
        trpcMsw.questionBank.getNumberOfQuestions.query(() => ({ count: 123 })),
      ],
    },
  },
};

export default meta;
