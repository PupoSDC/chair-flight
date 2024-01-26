import type { AppRouterOutput } from "@chair-flight/trpc/server";

export const questionBankLoSearchGetLearningObjectiveTree: AppRouterOutput["questionBankLoSearch"]["getLearningObjectiveTree"] =
  {
    items: [
      {
        id: "010.01",
        href: "/modules/atpl/learning-objectives/010.01",
        parentId: "010",
        courses: ["ATPL_A", "CPL_A", "ATPL_H_IR", "ATPL_H_VFR", "CPL_H"],
        text: "International Law:\n-  Conventions, Agreements And Organisations",
        source: "",
        questionBank: "atpl",
        subject: "010",
        numberOfQuestions: 190,
      },
      {
        id: "010.01.01",
        href: "/modules/atpl/learning-objectives/010.01.01",
        parentId: "010.01",
        courses: ["ATPL_A", "CPL_A", "ATPL_H_IR", "ATPL_H_VFR", "CPL_H"],
        text: "The Convention on International Civil Aviation (Chicago) - Icao Doc 7300/9 - Convention on the High Seas (Geneva, 29 April 1958)",
        source: "",
        questionBank: "atpl",
        subject: "010",
        numberOfQuestions: 103,
      },
      {
        id: "010.01.01.01",
        href: "/modules/atpl/learning-objectives/010.01.01.01",
        parentId: "010.01.01",
        courses: ["ATPL_A", "CPL_A", "ATPL_H_IR", "ATPL_H_VFR", "CPL_H"],
        text: "The establishment of the Convention on International Civil Aviation, Chicago, 7 December 1944",
        source: "",
        questionBank: "atpl",
        subject: "010",
        numberOfQuestions: 13,
      },
      {
        id: "010.01.01.01.01",
        href: "/modules/atpl/learning-objectives/010.01.01.01.01",
        parentId: "010.01.01.01",
        courses: ["ATPL_A", "CPL_A", "ATPL_H_IR", "ATPL_H_VFR", "CPL_H"],
        text: "Explain the circumstances that led to the establishment of the Convention on International Civil Aviation, Chicago, 7 December 1944.",
        source: "ICAO Doc 7300/9 Preamble",
        questionBank: "atpl",
        subject: "010",
        numberOfQuestions: 13,
      },
    ],
  };
