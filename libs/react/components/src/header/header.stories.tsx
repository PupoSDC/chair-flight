import { Global, css } from "@emotion/react";
import { Box, Typography } from "@mui/joy";
import { generateQuestionsForNavigation } from "../__utils__/generate-questions-for-navigation";
import { QuestionNavigation } from "../question-navigation";
import { Header, useHeaderContext } from "./header";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof Header>;

const TestNavigationExample = () => {
  const { closeDrawer, canDrawerBeOpened } = useHeaderContext();
  if (!canDrawerBeOpened) {
    return (
      <Typography level="body-sm">
        This demo is only available on mobile screen
      </Typography>
    );
  }

  return (
    <QuestionNavigation
      questions={generateQuestionsForNavigation(40, 27)}
      currentId="13"
      onQuestionClicked={() => closeDrawer()}
    />
  );
};

export const Playground: Story = {
  args: {
    children: "Empty",
  },
  argTypes: {
    children: {
      options: ["Empty", "Some content", "Test Navigation"],
      control: { type: "radio" },
      mapping: {
        Empty: undefined,
        "Some content": <div>Some content</div>,
        "Test Navigation": <TestNavigationExample />,
      },
    },
  },
};

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Box
        sx={{
          width: "100%",
          overflow: "hidden",
          "& > header": { position: "relative" },
        }}
      >
        <Story />
        <Global
          styles={css`
            body {
              padding: 0 !important;
            }
          `}
        />
      </Box>
    ),
  ],
};

export default meta;
