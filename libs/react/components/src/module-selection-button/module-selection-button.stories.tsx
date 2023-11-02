import { default as AccountBalanceIcon } from "@mui/icons-material/AccountBalance";
import { default as AnimationIcon } from "@mui/icons-material/Animation";
import { ModuleSelectionButton } from "./module-selection-button";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof ModuleSelectionButton>;

export const Playground: Story = {};

const meta: Meta<typeof ModuleSelectionButton> = {
  title: "Components/ModuleSelectionButton",
  component: ModuleSelectionButton,
  tags: ["autodocs"],
  args: {
    title: "This is just a tribute",
    description:
      "This is a reference to the movie Tenacious D in the Pick of Destiny",
    color: "blue",
    active: false,
  },
  argTypes: {
    icon: {
      options: ["icon1", "icon2"],
      control: { type: "radio" },
      mapping: {
        icon1: <AccountBalanceIcon />,
        icon2: <AnimationIcon />,
      },
    },
  },
};

export default meta;
