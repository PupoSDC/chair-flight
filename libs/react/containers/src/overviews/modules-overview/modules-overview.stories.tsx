import { trpcMsw } from "@chair-flight/trpc/mock";
import { ModulesOverview } from "./modules-overview";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof ModulesOverview>;

export const Playground: Story = {};

const meta: Meta<typeof ModulesOverview> = {
  title: "Containers/Overviews/ModulesOverview",
  component: ModulesOverview,
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
