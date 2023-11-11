import { trpcMsw } from "@chair-flight/trpc/mock";
import { QuestionOverview } from "./question-overview";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof QuestionOverview>;

export const Playground: Story = {
  args: {
    questionId: "Q00YQLC8JS",
  },
};

const meta: Meta<typeof QuestionOverview> = {
  title: "Containers/Questions/QuestionOverview",
  component: QuestionOverview,
  tags: ["autodocs"],
  argTypes: {
    questionId: {
      control: "select",
      options: ["Q00YQLC8JS"],
    },
    variantId: {
      control: "select",
      options: [undefined],
    },
    seed: {
      control: "select",
      options: [undefined],
    },
  },
  parameters: {
    msw: [
      trpcMsw.questionBankAtpl.getQuestion.query((req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.data({
            questionTemplate: {
              id: "Q00YQLC8JS",
              srcLocation: "",
              explanation:
                "This is an explanation to the question.\n\n - It can contain markdown!\n\n`niiiice`",
              learningObjectives: ["081.01.09.02.07"],
              variants: {
                Cy1C8vfr: {
                  id: "Cy1C8vfr",
                  type: "simple",
                  question: "A deployed slat will:",
                  options: [
                    {
                      id: "ATCUY2UPPJ",
                      text: "increase the boundary layer energy and increase the suction peak on the fixed part of the wing, so that the stall is postponed to higher angles of attack.",
                      correct: true,
                      why: "",
                    },
                    {
                      id: "APH849MTSY",
                      text: "decrease the boundary layer energy and decrease the suction peak on the slat, so that CLMAX is reached at lower angles of attack.",
                      correct: false,
                      why: "",
                    },
                    {
                      id: "ALZZRTYZ6Q",
                      text: "increase the camber of the aerofoil and increase the effective angle of attack, so that CLMAX is reached at higher angles of attack.",
                      correct: false,
                      why: "",
                    },
                    {
                      id: "AXXX8E6HS1",
                      text: "increase the boundary layer energy, move the suction peak from the fixed part of the wing to the slat, so that the stall is postponed to higher angles of attack.",
                      correct: false,
                      why: "",
                    },
                  ],
                  annexes: [],
                  externalIds: ["AVEXAM-33196", "ATPLQ-818552"],
                  explanation: "",
                },
              },
            },
            learningObjectives: [],
          }),
        );
      }),
    ],
  },
};

export default meta;
