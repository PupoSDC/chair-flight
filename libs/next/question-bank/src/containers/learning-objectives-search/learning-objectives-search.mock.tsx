import type { AppRouterOutput } from "@cf/trpc/server";

export const mockData: AppRouterOutput["containers"]["learningObjectives"]["getLearningObjectivesSearch"] =
  {
    filters: {
      subject: [
        { id: "all", text: "All Subjects" },
        { id: "010", text: "010 - ALaw" },
        { id: "021", text: "021 - AGK" },
        { id: "022", text: "022 - Instruments" },
        { id: "031", text: "031 - M&B" },
        { id: "032", text: "032 - Perf" },
        { id: "033", text: "033 - FPM" },
        { id: "034", text: "034 - Perf(H)" },
        { id: "040", text: "040 - HPL" },
        { id: "050", text: "050 - Met" },
        { id: "061", text: "061 - GNav" },
        { id: "062", text: "062 - RNav" },
        { id: "070", text: "070 - OPS" },
        { id: "081", text: "081 - POF" },
        { id: "082", text: "082 - POF(H)" },
        { id: "090", text: "090 - Coms" },
      ],
      course: [
        { id: "all", text: "All Courses" },
        { id: "ATPL_A", text: "ATPL(A)" },
        { id: "CPL_A", text: "CPL(A)" },
        { id: "ATPL_H_IR", text: "ATPL(H) IR" },
        { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
        { id: "CPL_H", text: "CPL(H)" },
        { id: "IR", text: "IR" },
        { id: "CBIR_A", text: "CBIR(A)" },
      ],
      searchField: [
        { id: "all", text: "All Fields" },
        { id: "id", text: "Learning Objective ID" },
        { id: "text", text: "text" },
      ],
    },
  };
