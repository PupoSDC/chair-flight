import { useState } from "react";
import { SliderWithInput } from "./slider-with-input";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof SliderWithInput>;

export const Playground: Story = {
  args: {},
  argTypes: {
    value: {
      table: {
        disable: true,
      },
    },
  },
  render: function Render(args) {
    const [value, setValue] = useState(0);
    return (
      <SliderWithInput
        {...args}
        value={value}
        onChange={(v) => {
          setValue(v);
          args.onChange?.(v);
        }}
      />
    );
  },
};

const meta: Meta<typeof SliderWithInput> = {
  title: "Components/SliderWithInput",
  component: SliderWithInput,
  tags: ["autodocs"],
};

export default meta;
