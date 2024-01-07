import { Global, css } from "@emotion/react";
import { Box } from "@mui/joy";
import { trpcMsw } from "@chair-flight/trpc/mock";
import { Welcome } from "./welcome";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof Welcome>;

export const Playground: Story = {};

const meta: Meta<typeof Welcome> = {
  title: "Containers/Overviews/Welcome",
  component: Welcome,
  tags: ["autodocs"],
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 700,
      },
    },
    msw: {
      handlers: [
        trpcMsw.questionBank.getNumberOfFlashcards.query(() => ({ count: 77 })),
        trpcMsw.questionBank.getNumberOfQuestions.query(() => ({ count: 123 })),
      ],
    },
  },
  decorators: [
    (Story) => (
      <Box sx={{ width: "100%", height: "100vh" }}>
        <Story />
        <Global styles={{ body: { padding: "0 !important" } }} />
      </Box>
    ),
  ],
};

export default meta;
