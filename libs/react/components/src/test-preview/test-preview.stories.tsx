import { Link } from "@mui/joy";
import { DateTime } from "luxon";
import { TestPreview } from "./test-preview";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof TestPreview>;

export const Playground: Story = {
  args: {
    title: "010 - Air Law",
    status: "finished",
    score: 80,
    epochTimeInMs: DateTime.local().toMillis(),
    timeToCompleteInMs: 259000,
    timeLeftInMs: 1242414,
    numberOfQuestions: 100,
  },
  argTypes: {},
};

export const LinkComponent: Story = {
  args: {
    ...Playground.args,
    component: Link,
  },
  argTypes: {},
};

const meta: Meta<typeof TestPreview> = {
  title: "Components/TestPreview",
  component: TestPreview,
  tags: ["autodocs"],
  argTypes: {
    status: {
      options: ["finished", "started"],
      control: { type: "radio" },
    },
    score: {
      control: { type: "slider" },
    },
  },
};

export default meta;
