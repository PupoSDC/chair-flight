import { trpcMsw } from "@chair-flight/trpc/mock";
import { OverviewWelcome } from "./welcome";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof OverviewWelcome>;

export const Playground: Story = {};

const meta: Meta<typeof OverviewWelcome> = {
  title: "Containers/Overviews/OverviewWelcome",
  component: OverviewWelcome,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      story: {
        inline: false,
        iframeHeight: 700,
      },
    },
    msw: {
      handlers: [
        trpcMsw.questionBank.getNumberOfFlashcards.query(() => ({ count: 77 })),
        trpcMsw.questionBank.getNumberOfQuestions.query(() => ({ count: 123 })),
      ],
    },
  },
};

export default meta;
