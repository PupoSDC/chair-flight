import {
  trpcMsw,
  questionBankLoSearchSearchLearningObjectivesMock,
  questionBankLoSearchGetSearchConfig,
} from "@chair-flight/trpc/mock";
import { LearningObjectivesSearch } from "./learning-objectives-search";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof LearningObjectivesSearch>;

export const Playground: Story = {};

const meta: Meta<typeof LearningObjectivesSearch> = {
  title: "Containers/LearningObjectives/LearningObjectivesSearch",
  component: LearningObjectivesSearch,
  tags: ["autodocs"],
  args: {
    questionBank: "atpl",
    sx: { height: 500 },
  },
  argTypes: {
    questionBank: { control: false },
  },
  parameters: {
    msw: {
      handlers: [
        trpcMsw.questionBankLoSearch.getSearchConfigFilters.query(
          () => questionBankLoSearchGetSearchConfig,
        ),
        trpcMsw.questionBankLoSearch.searchLearningObjectives.query(
          () => questionBankLoSearchSearchLearningObjectivesMock,
        ),
      ],
    },
  },
};

export default meta;
