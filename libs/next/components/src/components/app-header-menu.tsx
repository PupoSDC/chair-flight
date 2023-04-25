import { default as ListIcon } from "@mui/icons-material/List";
import { default as QuestionAnswerIcon } from "@mui/icons-material/QuestionAnswer";
import { default as QuizIcon } from "@mui/icons-material/Quiz";
import {
  HeaderNavDesktop,
  HeaderNavMobile,
} from "@chair-flight/react/components";
import type { FunctionComponent } from "react";
import type { HeaderNavProps } from "@chair-flight/react/components";

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
    ],
  },
  {
    title: "Tests",
    href: "/tests",
    subItems: [
      {
        icon: QuizIcon,
        title: "My Tests",
        subtitle: "Create and manage your tests",
        href: "/tests",
      },
    ],
  },
];

export const AppHeaderMenu: FunctionComponent = () => {
  return (
    <>
      <HeaderNavMobile
        items={items}
        sx={{ display: { xs: "flex", md: "none" } }}
      />
      <HeaderNavDesktop
        items={items}
        sx={{ display: { xs: "none", md: "flex" } }}
      />
    </>
  );
};
