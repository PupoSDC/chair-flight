import { Link, Typography } from "@mui/joy";
import { Ups } from "./ups";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof Ups>;

export const Playground: Story = {
  args: {
    message: "404 Not Found",
  },
};

const meta: Meta<typeof Ups> = {
  title: "Components/Ups",
  component: Ups,
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: { type: "radio" },
      defaultValue: "undefined",
      options: ["danger", "warning", "undefined"],
      mapping: {
        danger: "danger",
        warning: "warning",
        undefined: undefined,
      },
    },
    children: {
      control: { type: "radio" },
      defaultValue: "nothing",
      options: ["nothing", "a message with a link"],
      mapping: {
        nothing: undefined,
        "a message with a link": (
          <Typography>
            You can try resolving this issue by pressing{" "}
            <Link href="#">this link</Link>!
          </Typography>
        ),
      },
    },
  },
};

export default meta;
