import type { AppRouterOutput } from "@chair-flight/trpc/server";

export const mockData: AppRouterOutput["containers"]["questions"]["getQuestionOverview"] =
  {
    template: {
      id: "Q000YBA1ON",
      learningObjectives: ["010.01"],
      explanation: "",
      variants: {
        dsLWKxr9: {
          type: "simple",
          id: "dsLWKxr9",
          question:
            "Annex 14 to the convention on international civil aviation contains SARPS for:",
          options: [
            { id: "AIXXXDXGUH", text: "aerodromes.", correct: true, why: "" },
            { id: "A18NL7DOHU", text: "security.", correct: false, why: "" },
            {
              id: "AC0EHU7TT6",
              text: "facilitation.",
              correct: false,
              why: "",
            },
            {
              id: "A55C2LXDYK",
              text: "none of the above.",
              correct: false,
              why: "",
            },
          ],
          annexes: [],
          externalIds: ["ATPLGS-622143", "AVEXAM-67778", "AVEXAM-67778"],
          explanation: "",
        },
      },
      srcLocation: "libs/content/question-bank-atpl/questions/010/010.01.json",
    },
    annexes: {},
    learningObjectives: [
      {
        id: "010.01",
        text: "International Law:\n-  Conventions, Agreements And Organisations",
        href: "/modules/atpl/learning-objectives/010.01",
      },
    ]
  };
