import { trpcMsw } from "@chair-flight/trpc/mock";
import { OverviewWelcome } from "./welcome";
import { mockData } from "./welcome.mock";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof OverviewWelcome>;

export const Playground: Story = {};

const meta: Meta<typeof OverviewWelcome> = {
  title: "Containers/Overviews/OverviewWelcome",
  component: OverviewWelcome,
  tags: ["autodocs"],
  args: {
    sx: {
      height: "100vh",
    },
  },
  argTypes: {
    questionBank: {
      control: "select",
      options: ["atpl", "type", "prep"] satisfies QuestionBankName[],
    },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      story: {
        height: 700,
      },
    },
    msw: {
      handlers: [
        trpcMsw.containers.overviews.getOverviewWelcome.query(() => mockData),
      ],
    },
  },
};

export default meta;
