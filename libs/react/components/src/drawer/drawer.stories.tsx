import { useState } from "react";
import { Button, Typography } from "@mui/joy";
import { generateQuestionsForNavigation } from "../__utils__/generate-questions-for-navigation";
import { QuestionNavigation } from "../question-navigation/question-navigation";
import { Drawer } from "./drawer";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof Drawer>;

export const Playground: Story = {
  args: {
    children: <h1>{"Drawer content"}</h1>,
  },
  argTypes: {
    children: {
      defaultValue: "Some random stuff",
      options: ["Some random stuff", "Test question Navigation"],
      mapping: {
        "Some random stuff": (
          <>
            <h1>Drawer Content</h1>
            <p>Some random text</p>
            <ul>
              <li>Some random text</li>
              <li>Some random text</li>
              <li>Some random text</li>
              <li>Some random text</li>
            </ul>
            <Button>I do nothing</Button>
          </>
        ),
        "Test question Navigation": (
          <>
            <Typography level="h4">Test Question Navigation</Typography>
            <QuestionNavigation
              questions={generateQuestionsForNavigation(100, 14)}
            />
          </>
        ),
      },
    },
  },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <Drawer {...args} onClose={() => setOpen(false)} open={open} />
      </>
    );
  },
};

const meta: Meta<typeof Drawer> = {
  title: "Components/Drawer",
  component: Drawer,
  tags: ["autodocs"],
};

export default meta;
