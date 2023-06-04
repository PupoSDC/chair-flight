import { default as AddCircleOutlineIcon } from "@mui/icons-material/AddCircleOutline";
import { default as BoltIcon } from "@mui/icons-material/Bolt";
import { default as ListIcon } from "@mui/icons-material/List";
import { default as QuestionAnswerIcon } from "@mui/icons-material/QuestionAnswer";
import { default as QuizIcon } from "@mui/icons-material/Quiz";
import {
  HeaderNavDesktop,
  HeaderNavMobile,
} from "@chair-flight/react/components";
import type { HeaderNavProps } from "@chair-flight/react/components";
import type { FunctionComponent } from "react";

const items: HeaderNavProps["items"] = [
  {
    title: "Question Bank",
    href: "/questions",
    subItems: [
      {
        icon: QuestionAnswerIcon,
        title: "Questions",
        subtitle: "Search chair-flights 30.000+ questions",
        href: "/questions",
      },
      {
        icon: ListIcon,
        title: "Learning Objectives",
        subtitle: "Explore EASA official Learning Objectives",
        href: "/learning-objectives",
      },
      {
        icon: BoltIcon,
        title: "Flashcards",
        subtitle: "Practice for open-ended interview questions.",
        href: "/flash-cards",
      },
    ],
  },
  {
    title: "Tests",
    href: "/tests",
    subItems: [
      {
        icon: QuizIcon,
        title: "My Tests",
        subtitle: "Manage your in progress and completed tests",
        href: "/tests",
      },
      {
        icon: AddCircleOutlineIcon,
        title: "New Test",
        subtitle: "Create a new test or Exam",
        href: "/tests/new",
      },
    ],
  },
];

export const AppHeaderMenu: FunctionComponent<{
  otherItems?: HeaderNavProps["items"];
}> = ({ otherItems = [] }) => {
  return (
    <>
      <HeaderNavMobile
        items={[...items, ...otherItems]}
        sx={{ display: { xs: "flex", md: "none" } }}
      />
      <HeaderNavDesktop
        items={[...items, ...otherItems]}
        sx={{ display: { xs: "none", md: "flex" } }}
      />
    </>
  );
};
