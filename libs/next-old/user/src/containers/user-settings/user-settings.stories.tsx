import { UserSettings } from "./user-settings";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof UserSettings>;

export const Playground: Story = {};

const meta: Meta<typeof UserSettings> = {
  title: "Containers/User/UserSettings",
  component: UserSettings,
  tags: ["autodocs"],
  parameters: {
    msw: {
      handlers: [],
    },
  },
};

export default meta;
