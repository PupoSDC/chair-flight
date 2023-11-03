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
    const [items, setItems] = useState(args.items);
    return (
      <NestedCheckboxSelect
        {...args}
        items={items}
        onChange={(...val) => {
          args.onChange?.(...val);
          setItems(
            (oldItems) =>
              oldItems?.map((oldItem) => {
                return oldItem.id === val[0].id ? val[0] : oldItem;
              }),
          );
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
    items: {
      options: ["with children", "no children"],
      control: { type: "radio" },
      mapping: {
        ["with children"]: [
          {
            id: "010",
            label: "Air Law",
            subLabel: "12 questions",
            checked: false,
            children: [
              {
                id: "010.01",
                label: "Principles of air law",
                subLabel: "44 questions",
                checked: false,
              },
              {
                id: "010.02",
                label: "Seconds of air law",
                subLabel: "23 questions",
                checked: false,
              },
            ],
          },
          {
            id: "021",
            label: "ops Law",
            subLabel: "47 questions",
            checked: false,
            children: [
              {
                id: "021.01",
                label: "Principles of ops law",
                subLabel: "12 questions",
                checked: false,
              },
              {
                id: "021.02",
                label: "Seconds of ops law",
                subLabel: "35 questions",
                checked: false,
              },
            ],
          },
        ] as NestedCheckboxSelectProps["items"],
        ["no children"]: [
          {
            id: "010",
            label: "Air Law",
            subLabel: "12 questions",
            checked: false,
            children: [],
          },
          {
            id: "021",
            label: "ops Law",
            subLabel: "47 questions",
            checked: false,
            children: [],
          },
        ] as NestedCheckboxSelectProps["items"],
      },
    },
  },
};

export default meta;
