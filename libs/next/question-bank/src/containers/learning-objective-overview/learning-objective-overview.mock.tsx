import type { AppRouterOutput } from "@cf/trpc/server";

export const mockData: AppRouterOutput["containers"]["learningObjectives"]["getLearningObjectiveOverview"] =
  {
    learningObjective: {
      id: "070",
      subject: "070",
      parentId: null,
      courses: ["ATPL_H_IR", "ATPL_H_VFR", "CPL_H", "ATPL_A", "CPL_A"],
      text: { mdContent: "Operational Procedures" },
      source: { mdContent: "" },
      questionBank: "atpl",
      doc: "070",
      questions: [],
      learningObjectives: ["071.01", "071.02", "071.03", "071.04"],
      nestedQuestions: [
        "QXQEJGGU",
        "QGYRQPXV",
        "QCUHSSKJ",
        "QLBGHFEY",
        "QUVCKJTS",
        "QECFSEXH",
        "QWBRIUUF",
      ],
    },
    courses: [
      { id: "ATPL_A", text: "ATPL(A)" },
      { id: "CPL_A", text: "CPL(A)" },
      { id: "ATPL_H_IR", text: "ATPL(H) IR" },
      { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
      { id: "CPL_H", text: "CPL(H)" },
      { id: "IR", text: "IR" },
      { id: "CBIR_A", text: "CBIR(A)" },
    ],
  };
