import type { AppRouterOutput } from "@chair-flight/trpc/server";

export const questionBankGetQuestionOverviewMock: AppRouterOutput["questionBank"]["getQuestionOverview"] =
  {
    template: {
      id: "Q1YYGK54U6",
      explanation: "",
      learningObjectives: ["010.09.08.03.04"],
      variants: {
        jRHizc6Q: {
          id: "jRHizc6Q",
          type: "simple",
          question:
            "Refer to figure 010-27.\nFor a CAT I precision approach, which of the following lengths applies to B1 and B2 in the attached diagram ?",
          options: [
            { id: "AT8SE853YU", text: "30 m / 150 m", correct: true, why: "" },
            { id: "AUMKJOA6BF", text: "15 m / 75 m", correct: false, why: "" },
            { id: "APQTLPTQP8", text: "60 m / 300 m", correct: false, why: "" },
            { id: "ADCQ56OKZD", text: "15 m / 50 m", correct: false, why: "" },
          ],
          annexes: ["b5e5af624a98bdf402dc0d1bd4ce9973"],
          externalIds: ["AVEXAM-66387"],
          explanation: "",
        },
      },
      srcLocation: "libs/content/question-bank-atpl/questions/010/010.09.json",
    },
    annexes: {
      b5e5af624a98bdf402dc0d1bd4ce9973: {
        id: "b5e5af624a98bdf402dc0d1bd4ce9973",
        href: "/content/content-question-bank-atpl/annexes/b5e5af624a98bdf402dc0d1bd4ce9973.jpg",
      },
    },
    learningObjectives: [
      {
        id: "010.09.08.03.04",
        text: "Describe the diagram of the inner 300 m of the precision approach lighting system in the case of Cat Ii and Iii.",
        href: "/modules/[object Object]/learning-objectives/010.09.08.03.04",
      },
    ],
    editLink: "/modules/[object Object]/questions/Q1YYGK54U6/edit",
  };
