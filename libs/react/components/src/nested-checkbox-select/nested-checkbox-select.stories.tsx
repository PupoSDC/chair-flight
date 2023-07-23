import { useState } from "react";
import { NestedCheckboxSelect } from "./nested-checkbox-select";
import type { NestedCheckboxSelectProps } from "./nested-checkbox-select";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof NestedCheckboxSelect>;

export const Playground: Story = {
  args: {
    items: "simple" as unknown as NestedCheckboxSelectProps["items"],
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
              oldItems?.map((oldItem) => ({
                ...oldItem,
                checked: (() => {
                  if (oldItem.id === val[0].id) return !oldItem.checked;
                  return oldItem.checked;
                })(),
                children: oldItem.children.map((oldChild) => ({
                  ...oldChild,
                  checked: (() => {
                    if (oldItem.id === val[0].id) return !oldItem.checked;
                    if (oldChild.id === val[0].id) return !oldChild.checked;
                    return oldChild.checked;
                  })(),
                })),
              })),
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
      options: ["simple"],
      control: { type: "radio" },
      mapping: {
        simple: [
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
      },
    },
  },
};

export default meta;
