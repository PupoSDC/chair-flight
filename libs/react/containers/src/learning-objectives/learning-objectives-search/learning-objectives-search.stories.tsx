import {
  mockLearningObjectiveSearchItems,
  mockSubjects,
  trpcMsw,
} from "@chair-flight/trpc/mock";
import { LearningObjectivesSearch } from "./learning-objectives-search";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof LearningObjectivesSearch>;

export const Playground: Story = {};

const meta: Meta<typeof LearningObjectivesSearch> = {
  title: "Containers/LearningObjectives/LearningObjectivesSearch",
  component: LearningObjectivesSearch,
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
        trpcMsw.questionBank.getAllSubjects.query(() => ({
          subjects: mockSubjects,
        })),
        trpcMsw.questionBankLoSearch.searchLearningObjectives.query(() => {
          const items = mockLearningObjectiveSearchItems;

          return {
            items,
            nextCursor: 20,
            totalResults: items.length,
          };
        }),
      ],
    },
  },
};

export default meta;
