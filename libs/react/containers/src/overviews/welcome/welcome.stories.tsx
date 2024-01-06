import { trpcMsw } from "@chair-flight/trpc/mock";
import { Welcome } from "./welcome";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof Welcome>;

export const Playground: Story = {
  parameters: {
    nextjs: {
      router: {
        path: "/",
      },
    },
  },
};

const meta: Meta<typeof Welcome> = {
  title: "Containers/Overviews/Welcome",
  component: Welcome,
  tags: ["autodocs"],
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 500,
      },
    },
    msw: [
      trpcMsw.questionBank.getNumberOfFlashcards.query((req, res, ctx) => {
        return res(ctx.status(200), ctx.data({ count: 77 }));
      }),
      trpcMsw.questionBank.getNumberOfQuestions.query((req, res, ctx) => {
        return res(ctx.status(200), ctx.data({ count: 230 }));
      }),
    ],
  },
};

export default meta;
