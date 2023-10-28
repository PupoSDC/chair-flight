import { Suspense } from "react";
import { Box } from "@mui/joy";
import { Toaster } from "@chair-flight/react/components";
import { trpcMsw, mockSubjects } from "@chair-flight/trpc/mock";
import { TestMaker } from "./test-maker";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof TestMaker>;

export const Playground: Story = {
  parameters: {
    msw: [
      trpcMsw.questionBankAtpl.getAllSubjects.query((req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.data({
            subjects: mockSubjects,
          }),
        );
      }),
      trpcMsw.questionBankAtpl.createTest.mutation(async (req, res, ctx) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return res(
          ctx.status(200),
          ctx.data({
            test: {
              id: "1",
              title: "Test",
              mode: "exam",
              status: "created",
              createdAtEpochMs: Date.now() / 1,
              startedAtEpochMs: null,
              finishedAtEpochMs: null,
              timeSpentInMs: 0,
              durationInMs: 60 * 40,
              currentQuestionIndex: 0,
              questions: [],
            },
          }),
        );
      }),
    ],
  },
};

export const PlaygroundWithErrorOnSubmit: Story = {
  parameters: {
    msw: [
      trpcMsw.questionBankAtpl.getAllSubjects.query((req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.data({
            subjects: mockSubjects,
          }),
        );
      }),
      trpcMsw.questionBankAtpl.createTest.mutation(async (req, res, ctx) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return res(
          ctx.status(500),
          ctx.json([
            {
              message: "Something went wrong",
              code: "INTERNAL_SERVER_ERROR",
            },
          ]),
        );
      }),
    ],
  },
};

const meta: Meta<typeof TestMaker> = {
  title: "Containers/Test/TestMaker",
  component: TestMaker,
  tags: ["autodocs"],
  argTypes: {},
  decorators: [
    (Story) => (
      <>
        <Suspense fallback={<div>Loading...</div>}>
          <Box sx={{ height: 600 }}>
            <Story />
          </Box>
        </Suspense>
        <Toaster />
      </>
    ),
  ],
};

export default meta;
