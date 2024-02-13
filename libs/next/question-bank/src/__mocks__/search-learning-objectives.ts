import type { LearningObjectiveSearchResult } from "@cf/core/search";
import type { AppRouterOutput } from "@cf/trpc/client";

const items: LearningObjectiveSearchResult[] = [
  {
    id: "010.01",
    href: "/modules/atpl/learning-objectives/010.01",
    parentId: "010",
    courses: [
      { id: "ATPL_A", text: "ATPL(A)" },
      { id: "CPL_A", text: "CPL(A)" },
      { id: "ATPL_H_IR", text: "ATPL(H) IR" },
      { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
      { id: "CPL_H", text: "CPL(H)" },
    ],
    text: {
      mdContent:
        "International Law:\n-  Conventions, Agreements And Organisations",
    },
    source: { mdContent: "" },
    questionBank: "atpl",
    subject: "010",
    numberOfQuestions: 203,
  },
  {
    id: "010.01.01",
    href: "/modules/atpl/learning-objectives/010.01.01",
    parentId: "010.01",
    courses: [
      { id: "ATPL_A", text: "ATPL(A)" },
      { id: "CPL_A", text: "CPL(A)" },
      { id: "ATPL_H_IR", text: "ATPL(H) IR" },
      { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
      { id: "CPL_H", text: "CPL(H)" },
    ],
    text: {
      mdContent:
        "The Convention on International Civil Aviation (Chicago) - Icao Doc 7300/9 - Convention on the High Seas (Geneva, 29 April 1958)",
    },
    source: { mdContent: "" },
    questionBank: "atpl",
    subject: "010",
    numberOfQuestions: 106,
  },
  {
    id: "010.01.01.01",
    href: "/modules/atpl/learning-objectives/010.01.01.01",
    parentId: "010.01.01",
    courses: [
      { id: "ATPL_A", text: "ATPL(A)" },
      { id: "CPL_A", text: "CPL(A)" },
      { id: "ATPL_H_IR", text: "ATPL(H) IR" },
      { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
      { id: "CPL_H", text: "CPL(H)" },
    ],
    text: {
      mdContent:
        "The establishment of the Convention on International Civil Aviation, Chicago, 7 December 1944",
    },
    source: { mdContent: "" },
    questionBank: "atpl",
    subject: "010",
    numberOfQuestions: 14,
  },
  {
    id: "010.01.01.01.01",
    href: "/modules/atpl/learning-objectives/010.01.01.01.01",
    parentId: "010.01.01.01",
    courses: [
      { id: "ATPL_A", text: "ATPL(A)" },
      { id: "CPL_A", text: "CPL(A)" },
      { id: "ATPL_H_IR", text: "ATPL(H) IR" },
      { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
      { id: "CPL_H", text: "CPL(H)" },
    ],
    text: {
      mdContent:
        "Explain the circumstances that led to the establishment of the Convention on International Civil Aviation, Chicago, 7 December 1944.",
    },
    source: { mdContent: "ICAO Doc 7300/9 Preamble" },
    questionBank: "atpl",
    subject: "010",
    numberOfQuestions: 14,
  },
  {
    id: "010.01.01.02",
    href: "/modules/atpl/learning-objectives/010.01.01.02",
    parentId: "010.01.01",
    courses: [
      { id: "ATPL_A", text: "ATPL(A)" },
      { id: "CPL_A", text: "CPL(A)" },
      { id: "ATPL_H_IR", text: "ATPL(H) IR" },
      { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
      { id: "CPL_H", text: "CPL(H)" },
    ],
    text: { mdContent: "Part I - Air navigation" },
    source: { mdContent: "" },
    questionBank: "atpl",
    subject: "010",
    numberOfQuestions: 57,
  },
  {
    id: "010.01.01.02.01",
    href: "/modules/atpl/learning-objectives/010.01.01.02.01",
    parentId: "010.01.01.02",
    courses: [
      { id: "ATPL_A", text: "ATPL(A)" },
      { id: "CPL_A", text: "CPL(A)" },
      { id: "ATPL_H_IR", text: "ATPL(H) IR" },
      { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
      { id: "CPL_H", text: "CPL(H)" },
    ],
    text: {
      mdContent:
        "Recall the general contents of relevant parts of the following chapters:\n-  general principles and application of the Convention;\n-  flight over territory of Contracting States;\n-  nationality of aircraft;\n-  international standards and recommended practices (SARPs), especially notification of differences and validity of endorsed certificates and licences.",
    },
    source: {
      mdContent:
        "ICAO Doc 7300/9 Part 1, Articles 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 16, 17, 18, 19, 20, 37, 38, 39, 40",
    },
    questionBank: "atpl",
    subject: "010",
    numberOfQuestions: 19,
  },
  {
    id: "010.01.01.02.02",
    href: "/modules/atpl/learning-objectives/010.01.01.02.02",
    parentId: "010.01.01.02",
    courses: [
      { id: "ATPL_A", text: "ATPL(A)" },
      { id: "CPL_A", text: "CPL(A)" },
      { id: "ATPL_H_IR", text: "ATPL(H) IR" },
      { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
      { id: "CPL_H", text: "CPL(H)" },
    ],
    text: {
      mdContent:
        "General principles - Describe the application of the following terms in civil aviation:\n-  sovereignty;\n-  territory and high seas according to the Un Convention on the High Seas. ",
    },
    source: {
      mdContent:
        "Convention on the High Seas (Geneva, 29 April 1958) Articles 1, 2;\r\nICAO Doc 7300/9 Part 1, Articles 1, 2",
    },
    questionBank: "atpl",
    subject: "010",
    numberOfQuestions: 2,
  },
  {
    id: "010.01.01.02.03",
    href: "/modules/atpl/learning-objectives/010.01.01.02.03",
    parentId: "010.01.01.02",
    courses: [
      { id: "ATPL_A", text: "ATPL(A)" },
      { id: "CPL_A", text: "CPL(A)" },
      { id: "ATPL_H_IR", text: "ATPL(H) IR" },
      { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
      { id: "CPL_H", text: "CPL(H)" },
    ],
    text: {
      mdContent:
        "Explain the following terms and how they apply to international air traffic:\n-  right of non-scheduled flight (including the two technical freedoms of the air);\n-  scheduled air services;\n-  cabotage;\n-  landing at customs airports;\n-  Rules of the Air;\n-  search of aircraft.",
    },
    source: { mdContent: "ICAO Doc 7300/9, Articles 5, 6, 7, 10, 12, 16" },
    questionBank: "atpl",
    subject: "010",
    numberOfQuestions: 15,
  },
  {
    id: "010.01.01.02.04",
    href: "/modules/atpl/learning-objectives/010.01.01.02.04",
    parentId: "010.01.01.02",
    courses: [
      { id: "ATPL_A", text: "ATPL(A)" },
      { id: "CPL_A", text: "CPL(A)" },
      { id: "ATPL_H_IR", text: "ATPL(H) IR" },
      { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
      { id: "CPL_H", text: "CPL(H)" },
    ],
    text: {
      mdContent:
        "Explain the duties of Contracting States in relation to:\n-  documents carried on board the aircraft:\n-  certificate of registration;\n-  certificates of airworthiness;\n-  licences of personnel;\n-  recognition of certificates and licences;\n-  cargo restrictions;\n-  photographic apparatus.",
    },
    source: { mdContent: "ICAO Doc 7300/9, Articles 29, 31, 32, 33, 35, 36" },
    questionBank: "atpl",
    subject: "010",
    numberOfQuestions: 21,
  },
  {
    id: "010.01.01.03",
    href: "/modules/atpl/learning-objectives/010.01.01.03",
    parentId: "010.01.01",
    courses: [
      { id: "ATPL_A", text: "ATPL(A)" },
      { id: "CPL_A", text: "CPL(A)" },
      { id: "ATPL_H_IR", text: "ATPL(H) IR" },
      { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
      { id: "CPL_H", text: "CPL(H)" },
    ],
    text: {
      mdContent:
        "Part Ii - The International Civil Aviation Organization (Icao)",
    },
    source: { mdContent: "" },
    questionBank: "atpl",
    subject: "010",
    numberOfQuestions: 35,
  },
  {
    id: "010.01.01.03.01",
    href: "/modules/atpl/learning-objectives/010.01.01.03.01",
    parentId: "010.01.01.03",
    courses: [
      { id: "ATPL_A", text: "ATPL(A)" },
      { id: "CPL_A", text: "CPL(A)" },
      { id: "ATPL_H_IR", text: "ATPL(H) IR" },
      { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
      { id: "CPL_H", text: "CPL(H)" },
    ],
    text: { mdContent: "Describe the objectives of Icao." },
    source: { mdContent: "ICAO Doc 7300/9, Article 44" },
    questionBank: "atpl",
    subject: "010",
    numberOfQuestions: 23,
  },
  {
    id: "010.01.01.03.02",
    href: "/modules/atpl/learning-objectives/010.01.01.03.02",
    parentId: "010.01.01.03",
    courses: [
      { id: "ATPL_A", text: "ATPL(A)" },
      { id: "CPL_A", text: "CPL(A)" },
      { id: "ATPL_H_IR", text: "ATPL(H) IR" },
      { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
      { id: "CPL_H", text: "CPL(H)" },
    ],
    text: {
      mdContent:
        "Recognise the organisation and duties of the Icao Assembly, Council and Air Navigation Commission (Anc).",
    },
    source: { mdContent: "ICAO Doc 7300/9, Articles 48, 49, 50, 54, 56, 57" },
    questionBank: "atpl",
    subject: "010",
    numberOfQuestions: 7,
  },
  {
    id: "010.01.01.03.03",
    href: "/modules/atpl/learning-objectives/010.01.01.03.03",
    parentId: "010.01.01.03",
    courses: [
      { id: "ATPL_A", text: "ATPL(A)" },
      { id: "CPL_A", text: "CPL(A)" },
      { id: "ATPL_H_IR", text: "ATPL(H) IR" },
      { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
      { id: "CPL_H", text: "CPL(H)" },
    ],
    text: { mdContent: "Describe the annexes to the Convention." },
    source: { mdContent: "ICAO Doc 7300/9, Articles 54, 90, 94, 95" },
    questionBank: "atpl",
    subject: "010",
    numberOfQuestions: 5,
  },
  {
    id: "010.01.02",
    href: "/modules/atpl/learning-objectives/010.01.02",
    parentId: "010.01",
    courses: [
      { id: "ATPL_A", text: "ATPL(A)" },
      { id: "CPL_A", text: "CPL(A)" },
      { id: "ATPL_H_IR", text: "ATPL(H) IR" },
      { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
      { id: "CPL_H", text: "CPL(H)" },
    ],
    text: { mdContent: "Other conventions and agreements" },
    source: { mdContent: "" },
    questionBank: "atpl",
    subject: "010",
    numberOfQuestions: 39,
  },
  {
    id: "010.01.02.01",
    href: "/modules/atpl/learning-objectives/010.01.02.01",
    parentId: "010.01.02",
    courses: [
      { id: "ATPL_A", text: "ATPL(A)" },
      { id: "CPL_A", text: "CPL(A)" },
      { id: "ATPL_H_IR", text: "ATPL(H) IR" },
      { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
      { id: "CPL_H", text: "CPL(H)" },
    ],
    text: {
      mdContent:
        "The International Air Services Transit Agreement (Icao Doc 7500)",
    },
    source: { mdContent: "" },
    questionBank: "atpl",
    subject: "010",
    numberOfQuestions: 5,
  },
  {
    id: "010.01.02.01.01",
    href: "/modules/atpl/learning-objectives/010.01.02.01.01",
    parentId: "010.01.02.01",
    courses: [
      { id: "ATPL_A", text: "ATPL(A)" },
      { id: "CPL_A", text: "CPL(A)" },
      { id: "ATPL_H_IR", text: "ATPL(H) IR" },
      { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
      { id: "CPL_H", text: "CPL(H)" },
    ],
    text: { mdContent: "Explain the two technical freedoms of the air." },
    source: { mdContent: "ICAO Doc 7500" },
    questionBank: "atpl",
    subject: "010",
    numberOfQuestions: 5,
  },
  {
    id: "010.01.02.02",
    href: "/modules/atpl/learning-objectives/010.01.02.02",
    parentId: "010.01.02",
    courses: [
      { id: "ATPL_A", text: "ATPL(A)" },
      { id: "CPL_A", text: "CPL(A)" },
      { id: "ATPL_H_IR", text: "ATPL(H) IR" },
      { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
      { id: "CPL_H", text: "CPL(H)" },
    ],
    text: {
      mdContent: "The International Air Transport Agreement (Icao Doc 9626)",
    },
    source: { mdContent: "" },
    questionBank: "atpl",
    subject: "010",
    numberOfQuestions: 6,
  },
  {
    id: "010.01.02.02.01",
    href: "/modules/atpl/learning-objectives/010.01.02.02.01",
    parentId: "010.01.02.02",
    courses: [
      { id: "ATPL_A", text: "ATPL(A)" },
      { id: "CPL_A", text: "CPL(A)" },
      { id: "ATPL_H_IR", text: "ATPL(H) IR" },
      { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
      { id: "CPL_H", text: "CPL(H)" },
    ],
    text: { mdContent: "Explain the three commercial freedoms of the air." },
    source: { mdContent: "ICAO Doc 9626" },
    questionBank: "atpl",
    subject: "010",
    numberOfQuestions: 6,
  },
  {
    id: "010.01.02.03",
    href: "/modules/atpl/learning-objectives/010.01.02.03",
    parentId: "010.01.02",
    courses: [
      { id: "ATPL_A", text: "ATPL(A)" },
      { id: "CPL_A", text: "CPL(A)" },
      { id: "ATPL_H_IR", text: "ATPL(H) IR" },
      { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
      { id: "CPL_H", text: "CPL(H)" },
    ],
    text: {
      mdContent:
        "Suppression of Unlawful Acts Against the Safety of Civil Aviation - The Tokyo Convention of 1963",
    },
    source: { mdContent: "" },
    questionBank: "atpl",
    subject: "010",
    numberOfQuestions: 16,
  },
  {
    id: "010.01.02.03.01",
    href: "/modules/atpl/learning-objectives/010.01.02.03.01",
    parentId: "010.01.02.03",
    courses: [
      { id: "ATPL_A", text: "ATPL(A)" },
      { id: "CPL_A", text: "CPL(A)" },
      { id: "ATPL_H_IR", text: "ATPL(H) IR" },
      { id: "ATPL_H_VFR", text: "ATPL(H) VFR" },
      { id: "CPL_H", text: "CPL(H)" },
    ],
    text: {
      mdContent:
        "Describe the measures and actions to be taken by the pilot-in-command (Pic) of an aircraft in order to suppress unlawful acts against the safety of the aircraft.",
    },
    source: {
      mdContent:
        "ICAO Doc 8364 — Convention on Offences and Certain Other Acts Committed on Board Aircraft, signed in Tokyo on 14 September 1963 ",
    },
    questionBank: "atpl",
    subject: "010",
    numberOfQuestions: 16,
  },
];

export const mockRetrieveLearningObjectivesData: AppRouterOutput["common"]["search"]["retrieveLearningObjective"] =
  {
    items,
  };

export const mockSearchLearningObjectivesData: AppRouterOutput["common"]["search"]["searchLearningObjectives"] =
  {
    items,
    totalResults: 697,
    nextCursor: 20,
  };
