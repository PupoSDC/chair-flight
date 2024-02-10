import type { AppRouterOutput } from "@chair-flight/trpc/server";

export const mockData: AppRouterOutput["containers"]["learningObjectives"]["getLearningObjectiveTree"] =
  {
    items: [
      {
        id: "022.01",
        href: "/modules/atpl/learning-objectives/022.01",
        parentId: "022",
        courses: [
          { id: "ATPL_A", text: "ATPL(A)" },
          { id: "CPL_A", text: "CPL(A)" },
          { id: "ATPL_H_IR", text: "ATPL(H) IR" },
          { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
          { id: "CPL_H", text: "CPL(H)" },
        ],
        text: "Sensors And Instruments ",
        source: "",
        questionBank: "atpl",
        subject: "022",
        numberOfQuestions: 284,
      },
      {
        id: "022.01.06",
        href: "/modules/atpl/learning-objectives/022.01.06",
        parentId: "022.01",
        courses: [
          { id: "ATPL_A", text: "ATPL(A)" },
          { id: "CPL_A", text: "CPL(A)" },
        ],
        text: "Thrust measurement",
        source: "",
        questionBank: "atpl",
        subject: "022",
        numberOfQuestions: 16,
      },
      {
        id: "022.01.06.01",
        href: "/modules/atpl/learning-objectives/022.01.06.01",
        parentId: "022.01.06",
        courses: [
          { id: "ATPL_A", text: "ATPL(A)" },
          { id: "CPL_A", text: "CPL(A)" },
        ],
        text: "Parameters, operating principle",
        source: "",
        questionBank: "atpl",
        subject: "022",
        numberOfQuestions: 16,
      },
      {
        id: "022.01.06.01.01",
        href: "/modules/atpl/learning-objectives/022.01.06.01.01",
        parentId: "022.01.06.01",
        courses: [
          { id: "ATPL_A", text: "ATPL(A)" },
          { id: "CPL_A", text: "CPL(A)" },
        ],
        text: "List and describe the following two parameters used to represent thrust:\n-  N1;\n-  Epr.",
        source: "",
        questionBank: "atpl",
        subject: "022",
        numberOfQuestions: 6,
      },
      {
        id: "022.01.06.01.02",
        href: "/modules/atpl/learning-objectives/022.01.06.01.02",
        parentId: "022.01.06.01",
        courses: [
          { id: "ATPL_A", text: "ATPL(A)" },
          { id: "CPL_A", text: "CPL(A)" },
        ],
        text: "Explain the operating principle of using an engine with Epr indication and explain the consequences of incorrect or missing Epr to the operation of the engine, including reverting to N1 mode.",
        source: "",
        questionBank: "atpl",
        subject: "022",
        numberOfQuestions: 3,
      },
      {
        id: "022.01.06.01.03",
        href: "/modules/atpl/learning-objectives/022.01.06.01.03",
        parentId: "022.01.06.01",
        courses: [
          { id: "ATPL_A", text: "ATPL(A)" },
          { id: "CPL_A", text: "CPL(A)" },
        ],
        text: "Give examples of display for N1 and Epr.",
        source: "",
        questionBank: "atpl",
        subject: "022",
        numberOfQuestions: 7,
      },
    ],
  };
