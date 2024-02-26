import { useState } from "react";
import { NestedCheckboxSelect } from "./nested-checkbox-select";
import type { NestedCheckboxSelectProps } from "./nested-checkbox-select";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof NestedCheckboxSelect>;

export const Playground: Story = {
  args: {
    items: "with children" as unknown as NestedCheckboxSelectProps["items"],
  },
  render: function Render(args) {
    const [values, setValues] = useState<string[]>([]);
    return (
      <NestedCheckboxSelect
        {...args}
        values={values}
        items={args.items}
        onChange={(...val) => {
          args.onChange?.(...val);
          setValues(val[0]);
        }}
      />
    );
  },
};

const meta: Meta<typeof NestedCheckboxSelect> = {
  title: "Components/NestedCheckboxSelect",
  component: NestedCheckboxSelect,
  tags: ["autodocs"],
  argTypes: {
    values: { control: false },
    items: {
      options: ["with children", "no children"],
      control: { type: "radio" },
      mapping: {
        ["with children"]: [
          {
            id: "010",
            label: "Air Law",
            subLabel: "12 questions",

            children: [
              {
                id: "010.01",
                label: "Principles of air law",
                subLabel: "44 questions",
              },
              {
                id: "010.02",
                label: "Seconds of air law",
                subLabel: "23 questions",
              },
            ],
          },
          {
            id: "021",
            label: "ops Law",
            subLabel: "47 questions",

            children: [
              {
                id: "021.01",
                label: "Principles of ops law",
                subLabel: "12 questions",
              },
              {
                id: "021.02",
                label: "Seconds of ops law",
                subLabel: "35 questions",
              },
            ],
          },
        ] as NestedCheckboxSelectProps["items"],
        ["no children"]: [
          {
            id: "010",
            label: "Air Law",
            subLabel: "12 questions",

            children: [],
          },
          {
            id: "021",
            label: "ops Law",
            subLabel: "47 questions",

            children: [],
          },
        ] as NestedCheckboxSelectProps["items"],
      },
    },
  },
};

export default meta;
