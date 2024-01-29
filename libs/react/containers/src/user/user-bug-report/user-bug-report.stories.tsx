import { UserBugReport } from "./user-bug-report";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof UserBugReport>;

export const Playground: Story = {};

const meta: Meta<typeof UserBugReport> = {
  title: "Containers/User/UserBugReport",
  component: UserBugReport,
  tags: ["autodocs"],
  parameters: {
    msw: {
      handlers: [],
    },
  },
};

export default meta;
