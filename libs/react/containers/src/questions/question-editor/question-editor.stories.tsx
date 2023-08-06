import { mockQuestion, trpcMsw } from "@chair-flight/trpc/mock";
import { trpc } from "@chair-flight/trpc/client";
import { QuestionEditor } from "./question-editor";
import type { Meta, StoryObj } from "@storybook/react";
import { rest } from "msw";
import { useEffect, useState } from "react";

type Story = StoryObj<typeof QuestionEditor>;

export const BasePage: Story = {
  parameters: {
    nextjs: {
      router: {
        path: "/questions/[questionId]/edit",
        query: {
          questionId: "Q00YQLC8JS",
        },
      },
    },
  },
};

export const VariantSimpleEditor: Story = {
  parameters: {
    nextjs: {
      router: {
        path: "/questions/[questionId]/edit?variantId=Cy1C8vfr",
        query: {
          questionId: "Q00YQLC8JS",
          variantId: "Cy1C8vfr",
        },
      },
    },
  },
};

export const VariantOneTwoEditor: Story = {
  parameters: {
    nextjs: {
      router: {
        path: "/questions/[questionId]/edit?variantId=WEC930Kb",
        query: {
          questionId: "WEC930Kb",
          variantId: "WEC930Kb",
        },
      },
    },
  },
};

export const VariantSTupid: Story = {
  render: () => {
    const [a, setA] = useState("potato");
    
    trpc.questions.getQuestionFromGithub.useQuery({
      questionId: "124",
    });

    return <h1>{a}</h1>
  }
}

const meta: Meta<typeof QuestionEditor> = {
  title: "Containers/Questions/QuestionEditor",
  component: QuestionEditor,
  tags: ["autodocs"],
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 500,
      },
    },
    msw: [
      trpcMsw.questions.getQuestionFromGithub.query((req, res, ctx) => {
        console.log("potatooooo");
        return res(
          ctx.status(200),
          ctx.data({ questionTemplate: mockQuestion }),
        );
      }),
    ],
  },
};

export default meta;
