import {
  questionBankLoSearchSearchLearningObjectivesMock,
  questionBankGetAllSubjectsMock,
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
        trpcMsw.questionBank.getAllSubjects.query(
          () => questionBankGetAllSubjectsMock,
        ),
        trpcMsw.questionBankLoSearch.searchLearningObjectives.query(
          () => questionBankLoSearchSearchLearningObjectivesMock,
        ),
      ],
    },
  },
};

export default meta;
