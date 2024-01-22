import type { AppRouterOutput } from "@chair-flight/trpc/server";

export const questionBankGetQuestionFromGithubMock: AppRouterOutput["questionBank"]["getQuestionFromGithub"] =
  {
    questionTemplate: {
      id: "Q000YBA1ON",
      learningObjectives: ["010.01"],
      explanation: "",
      srcLocation: "libs/content/question-bank-atpl/questions/010/010.01.json",
      variants: {
        dsLWKxr9: {
          type: "simple",
          id: "dsLWKxr9",
          question:
            "Annex 14 to the convention on international civil aviation contains SARPS for:",
          options: [
            {
              id: "AIXXXDXGUH",
              text: "aerodromes.",
              correct: true,
              why: "",
            },
            {
              id: "A18NL7DOHU",
              text: "security.",
              correct: false,
              why: "",
            },
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
          externalIds: ["AVEXAM-67778", "ATPLGS-622143"],
          explanation: "",
        },
        BoFooFbr: {
          type: "simple",
          id: "BoFooFbr",
          question:
            "Annex 14 to the convention on international civil aviation contains SARPS for:",
          options: [
            {
              id: "AMUIXTPNDI",
              text: "Aerodromes",
              correct: true,
              why: "",
            },
            {
              id: "AK07WZX0SD",
              text: "Security",
              correct: false,
              why: "",
            },
            {
              id: "AN6WCW0Z03",
              text: "None of the above",
              correct: false,
              why: "",
            },
            {
              id: "AL4EQSB0K2",
              text: "Facilitation",
              correct: false,
              why: "",
            },
          ],
          annexes: [],
          externalIds: ["ATPLGS-622143", "AVEXAM-67778"],
          explanation: "",
        },
      },
    },
  };
