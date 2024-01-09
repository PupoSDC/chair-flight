import { Global } from "@emotion/react";
import { Box } from "@mui/joy";
import { trpcMsw } from "@chair-flight/trpc/mock";
import { LayoutModule } from "./layout-module";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof LayoutModule>;

export const Playground: Story = {};

const meta: Meta<typeof LayoutModule> = {
  title: "Containers/Layouts/LayoutModule",
  component: LayoutModule,
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
        trpcMsw.questionBank.getConfig.query(() => ({
          hasFlashcards: true,
          hasQuestions: true,
          hasLearningObjectives: true,
          hasMedia: true,
        })),
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
