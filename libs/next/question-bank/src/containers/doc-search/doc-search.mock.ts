import type { AppRouterOutput } from "@cf/trpc/server";

export const mockData: AppRouterOutput["containers"]["docs"]["getDocSearch"] = {
  subjectMap: {
    all: "All Subjects",
    "010": "010 - ALaw",
    "021": "021 - AGK",
    "022": "022 - Instruments",
    "031": "031 - M&B",
    "032": "032 - Perf",
    "033": "033 - FPM",
    "034": "034 - Perf(H)",
    "040": "040 - HPL",
    "050": "050 - Met",
    "061": "061 - GNav",
    "062": "062 - RNav",
    "070": "070 - OPS",
    "081": "081 - POF",
    "082": "082 - POF(H)",
    "090": "090 - Coms",
  },
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
    searchField: [
      { id: "all", text: "All Fields" },
      { id: "learningObjective", text: "Learning Objective" },
      { id: "content", text: "Content" },
      { id: "title", text: "Title" },
    ],
  },
};

export const mockSearchData: AppRouterOutput["common"]["search"]["searchDocs"] =
  {
    items: [
      {
        id: "022.01",
        questionBank: "atpl",
        title: "SENSORS AND INSTRUMENTS",
        empty: true,
        subject: "022",
        href: "/modules/[object Object]/docs/022.01",
        learningObjectives: [
          {
            id: "022.01",
            href: "/modules/[object Object]/learning-objectives/022.01",
          },
        ],
      },
      {
        id: "022.01.01",
        questionBank: "atpl",
        title: "Pressure gauge",
        empty: false,
        subject: "022",
        href: "/modules/[object Object]/docs/022.01.01",
        learningObjectives: [
          {
            id: "022.01.01",
            href: "/modules/[object Object]/learning-objectives/022.01.01",
          },
        ],
      },
      {
        id: "022.01.02",
        questionBank: "atpl",
        title: "Temperature sensing",
        empty: true,
        subject: "022",
        href: "/modules/[object Object]/docs/022.01.02",
        learningObjectives: [
          {
            id: "022.01.02",
            href: "/modules/[object Object]/learning-objectives/022.01.02",
          },
        ],
      },
      {
        id: "022.01.03",
        questionBank: "atpl",
        title: "Fuel gauge",
        empty: false,
        subject: "022",
        href: "/modules/[object Object]/docs/022.01.03",
        learningObjectives: [
          {
            id: "022.01.03",
            href: "/modules/[object Object]/learning-objectives/022.01.03",
          },
        ],
      },
      {
        id: "022.01.04",
        questionBank: "atpl",
        title: "Fuel flowmeters",
        empty: true,
        subject: "022",
        href: "/modules/[object Object]/docs/022.01.04",
        learningObjectives: [
          {
            id: "022.01.04",
            href: "/modules/[object Object]/learning-objectives/022.01.04",
          },
        ],
      },
      {
        id: "022.01.05",
        questionBank: "atpl",
        title: "Tachometer",
        empty: true,
        subject: "022",
        href: "/modules/[object Object]/docs/022.01.05",
        learningObjectives: [
          {
            id: "022.01.05",
            href: "/modules/[object Object]/learning-objectives/022.01.05",
          },
        ],
      },
      {
        id: "022.01.06",
        questionBank: "atpl",
        title: "Thrust measurement",
        empty: true,
        subject: "022",
        href: "/modules/[object Object]/docs/022.01.06",
        learningObjectives: [
          {
            id: "022.01.06",
            href: "/modules/[object Object]/learning-objectives/022.01.06",
          },
        ],
      },
      {
        id: "022.01.07",
        questionBank: "atpl",
        title: "Engine torquemeter",
        empty: false,
        subject: "022",
        href: "/modules/[object Object]/docs/022.01.07",
        learningObjectives: [
          {
            id: "022.01.07",
            href: "/modules/[object Object]/learning-objectives/022.01.07",
          },
        ],
      },
      {
        id: "022.01.08",
        questionBank: "atpl",
        title: "Synchroscope",
        empty: false,
        subject: "022",
        href: "/modules/[object Object]/docs/022.01.08",
        learningObjectives: [
          {
            id: "022.01.08",
            href: "/modules/[object Object]/learning-objectives/022.01.08",
          },
        ],
      },
      {
        id: "022.01.09",
        questionBank: "atpl",
        title: "Engine-vibration monitoring",
        empty: true,
        subject: "022",
        href: "/modules/[object Object]/docs/022.01.09",
        learningObjectives: [
          {
            id: "022.01.09",
            href: "/modules/[object Object]/learning-objectives/022.01.09",
          },
        ],
      },
      {
        id: "022.01.10",
        questionBank: "atpl",
        title: "Time measurement",
        empty: true,
        subject: "022",
        href: "/modules/[object Object]/docs/022.01.10",
        learningObjectives: [
          {
            id: "022.01.10",
            href: "/modules/[object Object]/learning-objectives/022.01.10",
          },
        ],
      },
      {
        id: "022.02",
        questionBank: "atpl",
        title: "MEASUREMENT OF AIR-DATA PARAMETERS",
        empty: true,
        subject: "022",
        href: "/modules/[object Object]/docs/022.02",
        learningObjectives: [
          {
            id: "022.02",
            href: "/modules/[object Object]/learning-objectives/022.02",
          },
        ],
      },
      {
        id: "022.02.01",
        questionBank: "atpl",
        title: "Pressure measurement",
        empty: true,
        subject: "022",
        href: "/modules/[object Object]/docs/022.02.01",
        learningObjectives: [
          {
            id: "022.02.01",
            href: "/modules/[object Object]/learning-objectives/022.02.01",
          },
        ],
      },
      {
        id: "022.02.01.01",
        questionBank: "atpl",
        title: "Definitions",
        empty: true,
        subject: "022",
        href: "/modules/[object Object]/docs/022.02.01.01",
        learningObjectives: [
          {
            id: "022.02.01.01",
            href: "/modules/[object Object]/learning-objectives/022.02.01.01",
          },
        ],
      },
      {
        id: "022.02.01.02",
        questionBank: "atpl",
        title: "Pitot/static system: design and errors",
        empty: false,
        subject: "022",
        href: "/modules/[object Object]/docs/022.02.01.02",
        learningObjectives: [
          {
            id: "022.02.01.02",
            href: "/modules/[object Object]/learning-objectives/022.02.01.02",
          },
        ],
      },
      {
        id: "022.02.02",
        questionBank: "atpl",
        title: "Temperature measurement",
        empty: true,
        subject: "022",
        href: "/modules/[object Object]/docs/022.02.02",
        learningObjectives: [
          {
            id: "022.02.02",
            href: "/modules/[object Object]/learning-objectives/022.02.02",
          },
        ],
      },
      {
        id: "022.02.02.01",
        questionBank: "atpl",
        title: "Definitions",
        empty: true,
        subject: "022",
        href: "/modules/[object Object]/docs/022.02.02.01",
        learningObjectives: [
          {
            id: "022.02.02.01",
            href: "/modules/[object Object]/learning-objectives/022.02.02.01",
          },
        ],
      },
      {
        id: "022.02.02.02",
        questionBank: "atpl",
        title: "Design and operation",
        empty: true,
        subject: "022",
        href: "/modules/[object Object]/docs/022.02.02.02",
        learningObjectives: [
          {
            id: "022.02.02.02",
            href: "/modules/[object Object]/learning-objectives/022.02.02.02",
          },
        ],
      },
      {
        id: "022.02.03",
        questionBank: "atpl",
        title: "Angle-of-attack (AoA) measurement",
        empty: true,
        subject: "022",
        href: "/modules/[object Object]/docs/022.02.03",
        learningObjectives: [
          {
            id: "022.02.03",
            href: "/modules/[object Object]/learning-objectives/022.02.03",
          },
        ],
      },
      {
        id: "022.02.03.01",
        questionBank: "atpl",
        title:
          "Sensor types, operating principles, ice protection, displays, incorrect indications",
        empty: true,
        subject: "022",
        href: "/modules/[object Object]/docs/022.02.03.01",
        learningObjectives: [
          {
            id: "022.02.03.01",
            href: "/modules/[object Object]/learning-objectives/022.02.03.01",
          },
        ],
      },
      {
        id: "022.02.04",
        questionBank: "atpl",
        title: "Altimeter",
        empty: true,
        subject: "022",
        href: "/modules/[object Object]/docs/022.02.04",
        learningObjectives: [
          {
            id: "022.02.04",
            href: "/modules/[object Object]/learning-objectives/022.02.04",
          },
        ],
      },
      {
        id: "022.02.04.01",
        questionBank: "atpl",
        title:
          "Units, terms, types, operating principles, displays, errors, corrections",
        empty: true,
        subject: "022",
        href: "/modules/[object Object]/docs/022.02.04.01",
        learningObjectives: [
          {
            id: "022.02.04.01",
            href: "/modules/[object Object]/learning-objectives/022.02.04.01",
          },
        ],
      },
      {
        id: "022.02.05",
        questionBank: "atpl",
        title: "Vertical speed indicator (VSI)",
        empty: true,
        subject: "022",
        href: "/modules/[object Object]/docs/022.02.05",
        learningObjectives: [
          {
            id: "022.02.05",
            href: "/modules/[object Object]/learning-objectives/022.02.05",
          },
        ],
      },
      {
        id: "022.02.05.01",
        questionBank: "atpl",
        title: "VSI and instantaneous vertical speed indicator (IVSI)",
        empty: true,
        subject: "022",
        href: "/modules/[object Object]/docs/022.02.05.01",
        learningObjectives: [
          {
            id: "022.02.05.01",
            href: "/modules/[object Object]/learning-objectives/022.02.05.01",
          },
        ],
      },
    ],
    totalResults: 143,
    nextCursor: 24,
  };
