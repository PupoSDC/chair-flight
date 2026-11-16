import type { ComponentProps } from "react";
import type { Test } from "../../libs/core/tests/test";
import type { LearningObjectiveTable } from "../../libs/ui/components/question-bank/learning-objective-table";
import type { TestMaker } from "../../libs/ui/components/tests/test-maker";

const QUESTIONS = [
  {
    question: "What is the standard sea level pressure in the ISA?",
    options: ["1013.25 hPa", "1000 hPa", "29.29 inHg", "1025 hPa"],
    explanation:
      "The International Standard Atmosphere assumes **1013.25 hPa** (29.92 inHg) and 15 °C at mean sea level.",
  },
  {
    question: "Which cloud type is associated with thunderstorms?",
    options: ["Cumulonimbus", "Cirrostratus", "Altocumulus", "Stratus"],
    explanation: "Thunderstorms only develop in cumulonimbus (CB) clouds.",
  },
  {
    question: "What does the transponder code 7700 indicate?",
    options: [
      "General emergency",
      "Radio failure",
      "Unlawful interference",
      "VFR flight",
    ],
    explanation:
      "7500 is unlawful interference, 7600 radio failure and 7700 emergency.",
  },
  {
    question: "At what temperature lapse rate does the ISA troposphere cool?",
    options: [
      "1.98 °C per 1000 ft",
      "3 °C per 1000 ft",
      "1 °C per 1000 ft",
      "0.65 °C per 1000 ft",
    ],
    explanation: "6.5 °C per km, which is 1.98 °C per 1000 ft.",
  },
  {
    question: "Which instrument uses the pitot pressure?",
    options: [
      "Airspeed indicator",
      "Altimeter",
      "Vertical speed indicator",
      "Attitude indicator",
    ],
    explanation:
      "Only the airspeed indicator compares pitot (total) with static pressure.",
  },
  {
    question: "What is the wake turbulence category of an A320?",
    options: ["Medium", "Light", "Heavy", "Super"],
    explanation: "Between 7 000 kg and 136 000 kg MTOM is Medium.",
  },
];

const createTest = (
  answers: (number | undefined)[],
  overrides: Partial<Test>,
) =>
  ({
    id: "story-test",
    title: "general navigation",
    mode: "exam",
    questionBank: "atpl",
    status: "started",
    createdAtEpochMs: Date.UTC(2026, 9, 4, 9, 30),
    startedAtEpochMs: Date.UTC(2026, 9, 4, 9, 31),
    finishedAtEpochMs: null,
    timeSpentInMs: 4 * 60 * 1000,
    durationInMs: 20 * 60 * 1000,
    currentQuestionIndex: 2,
    questions: QUESTIONS.map((item, index) => ({
      questionId: `Q${index + 1}`,
      templateId: `QDS${index + 1}`,
      selectedOptionId:
        answers[index] === undefined ? undefined : `o${answers[index]}`,
      correctOptionId: "o0",
      seed: "story",
      question: item.question,
      explanation: item.explanation,
      annexes: [],
      options: item.options.map((text, optionIndex) => ({
        id: `o${optionIndex}`,
        text,
        why: optionIndex === 0 ? "This is the correct answer." : "",
      })),
    })),
    ...overrides,
  }) satisfies Test as Test;

export const STORY_TEST_IN_PROGRESS = createTest([0, 2], {});

export const STORY_TEST_FINISHED = createTest([0, 0, 1, 0, 0, 3], {
  id: "story-test-finished",
  title: "meteorology",
  status: "finished",
  finishedAtEpochMs: Date.UTC(2026, 9, 4, 9, 49),
  timeSpentInMs: 18 * 60 * 1000,
  currentQuestionIndex: 0,
});

export const STORY_SUBJECTS: ComponentProps<typeof TestMaker>["subjects"] = [
  {
    id: "050",
    shortName: "MET",
    numberOfExamQuestions: 84,
    chapters: [
      {
        id: "050.01",
        text: "The atmosphere",
        numberOfQuestions: 210,
        sections: [
          {
            id: "050.01.01",
            text: "Composition, extent and vertical division",
            numberOfQuestions: 60,
          },
          {
            id: "050.01.02",
            text: "Air temperature",
            numberOfQuestions: 150,
          },
        ],
      },
      {
        id: "050.02",
        text: "Wind",
        numberOfQuestions: 180,
        sections: [
          {
            id: "050.02.01",
            text: "Definition and measurement of wind",
            numberOfQuestions: 180,
          },
        ],
      },
    ],
  },
  {
    id: "061",
    shortName: "GNAV",
    numberOfExamQuestions: 55,
    chapters: [
      {
        id: "061.01",
        text: "Basics of navigation",
        numberOfQuestions: 320,
        sections: [],
      },
    ],
  },
];

export const STORY_LEARNING_OBJECTIVE_COURSES: ComponentProps<
  typeof LearningObjectiveTable
>["courses"] = [
  { id: "ATPL_A", text: "ATPL(A)" },
  { id: "CPL_A", text: "CPL(A)" },
  { id: "IR", text: "IR" },
];

export const STORY_LEARNING_OBJECTIVES: ComponentProps<
  typeof LearningObjectiveTable
>["items"] = [
  {
    id: "050",
    parentId: null,
    level: 0,
    text: "METEOROLOGY",
    items: [],
    source: "",
    courses: ["ATPL_A", "CPL_A", "IR"],
    numberOfQuestions: 1240,
  },
  {
    id: "050.01",
    parentId: "050",
    level: 1,
    text: "THE ATMOSPHERE",
    items: [],
    source: "",
    courses: ["ATPL_A", "CPL_A", "IR"],
    numberOfQuestions: 320,
  },
  {
    id: "050.01.01",
    parentId: "050.01",
    level: 2,
    text: "Composition, extent, vertical division",
    items: [],
    source: "",
    courses: ["ATPL_A", "CPL_A"],
    numberOfQuestions: 120,
  },
  {
    id: "050.01.01.01",
    parentId: "050.01.01",
    level: 3,
    text: "Describe the composition of the atmosphere, including:",
    items: ["nitrogen", "oxygen", "water vapour"],
    source: "ICAO Annex 3, Chapter 1",
    courses: ["ATPL_A", "CPL_A"],
    numberOfQuestions: 64,
  },
  {
    id: "050.01.01.02",
    parentId: "050.01.01",
    level: 3,
    text: "Name the layers of the atmosphere and state their characteristics.",
    items: [],
    source: "",
    courses: ["ATPL_A"],
    numberOfQuestions: 56,
  },
  {
    id: "050.01.02",
    parentId: "050.01",
    level: 2,
    text: "Air temperature",
    items: [],
    source: "",
    courses: ["ATPL_A", "IR"],
    numberOfQuestions: 200,
  },
  {
    id: "050.01.02.01",
    parentId: "050.01.02",
    level: 3,
    text: "Explain the effect of insolation on air temperature.",
    items: [],
    source: "",
    courses: ["ATPL_A", "IR"],
    numberOfQuestions: 88,
  },
];

export const STORY_CHAPTERS = [
  { id: "01", title: "Airplane General", numberOfQuestions: 26 },
  { id: "02", title: "Air Systems", numberOfQuestions: 21 },
  { id: "03", title: "Anti-Ice & Rain", numberOfQuestions: 10 },
  { id: "04", title: "Automatic Flight", numberOfQuestions: 23 },
  { id: "05", title: "Communications", numberOfQuestions: 9 },
  { id: "06", title: "Electrical", numberOfQuestions: 38 },
];

export const STORY_CHAPTER_LINK = (chapterId: string) => ({
  to: "/design-system/{-$story}" as const,
  params: { story: `chapter-${chapterId}` },
});
