import { useState } from "react";
import { InputSlider } from "./input-slider";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof InputSlider>;

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
      <InputSlider
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

const meta: Meta<typeof InputSlider> = {
  title: "Components/InputSlider",
  component: InputSlider,
  tags: ["autodocs"],
};

export default meta;
