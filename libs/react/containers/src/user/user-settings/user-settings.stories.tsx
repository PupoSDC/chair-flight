import { trpcMsw } from "@chair-flight/trpc/mock";
import { UserSettings } from "./user-settings";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof UserSettings>;

export const Playground: Story = {};

const meta: Meta<typeof UserSettings> = {
  title: "Containers/User/UserSettings",
  component: UserSettings,
  tags: ["autodocs"],
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 700,
      },
    },
    msw: {
      handlers: [
        trpcMsw.questionBank.getConfig.query(() => ({
          hasFlashcards: true,
          hasQuestions: true,
          hasLearningObjectives: true,
          hasAnnexes: true,
          hasCourses: true,
          hasDocs: true,
        })),
      ],
    },
  },
};

export default meta;
