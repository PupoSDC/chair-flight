import { LearningObjectiveList } from "./learning-objective-list";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof LearningObjectiveList>;

export const Playground: Story = {};

const meta: Meta<typeof LearningObjectiveList> = {
  title: "Components/LearningObjectiveList",
  component: LearningObjectiveList,
  tags: ["autodocs"],
  args: {
    loading: false,
    error: false,
    forceMode: undefined,
    items: [
      {
        id: "010.01",
        href: "/modules/atpl/learning-objectives/010.01",

        courses: [
          {
            id: "ATPL_A",
            text: "ATPL_A",
          },
          {
            id: "CPL_A",
            text: "CPL_A",
          },
          {
            id: "ATPL_H_IR",
            text: "ATPL_H_IR",
          },
          {
            id: "ATPL_H_VFR",
            text: "ATPL_H_VFR",
          },
          {
            id: "CPL_H",
            text: "CPL_H",
          },
        ],
        text: "International Law:\n-  Conventions, Agreements And Organisations",
        source: "",
        numberOfQuestions: 190,
      },
      {
        id: "010.01.01",
        href: "/modules/atpl/learning-objectives/010.01.01",

        courses: [
          {
            id: "ATPL_A",
            text: "ATPL_A",
          },
          {
            id: "CPL_A",
            text: "CPL_A",
          },
          {
            id: "ATPL_H_IR",
            text: "ATPL_H_IR",
          },
          {
            id: "ATPL_H_VFR",
            text: "ATPL_H_VFR",
          },
          {
            id: "CPL_H",
            text: "CPL_H",
          },
        ],
        text: "The Convention on International Civil Aviation (Chicago) - Icao Doc 7300/9 - Convention on the High Seas (Geneva, 29 April 1958)",
        source: "",
        numberOfQuestions: 103,
      },
      {
        id: "010.01.01.01",
        href: "/modules/atpl/learning-objectives/010.01.01.01",

        courses: [
          {
            id: "ATPL_A",
            text: "ATPL_A",
          },
          {
            id: "CPL_A",
            text: "CPL_A",
          },
          {
            id: "ATPL_H_IR",
            text: "ATPL_H_IR",
          },
          {
            id: "ATPL_H_VFR",
            text: "ATPL_H_VFR",
          },
          {
            id: "CPL_H",
            text: "CPL_H",
          },
        ],
        text: "The establishment of the Convention on International Civil Aviation, Chicago, 7 December 1944",
        source: "",
        numberOfQuestions: 13,
      },
      {
        id: "010.01.01.01.01",
        href: "/modules/atpl/learning-objectives/010.01.01.01.01",

        courses: [
          {
            id: "ATPL_A",
            text: "ATPL_A",
          },
          {
            id: "CPL_A",
            text: "CPL_A",
          },
          {
            id: "ATPL_H_IR",
            text: "ATPL_H_IR",
          },
          {
            id: "ATPL_H_VFR",
            text: "ATPL_H_VFR",
          },
          {
            id: "CPL_H",
            text: "CPL_H",
          },
        ],
        text: "Explain the circumstances that led to the establishment of the Convention on International Civil Aviation, Chicago, 7 December 1944.",
        source: "ICAO Doc 7300/9 Preamble",
        numberOfQuestions: 13,
      },
    ],
    sx: {
      height: "500px",
      overflow: "hidden",
    },
  },
  argTypes: {},
};

export default meta;
