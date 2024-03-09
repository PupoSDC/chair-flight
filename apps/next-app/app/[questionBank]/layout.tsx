import { notFound } from "next/navigation";
import { default as HomeIcon } from "@mui/icons-material/ConnectingAirportsOutlined";
import { default as TestIcon } from "@mui/icons-material/FlightTakeoffOutlined";
import { default as DocsIcon } from "@mui/icons-material/LibraryBooksOutlined";
import { default as LearningObjectivesIcon } from "@mui/icons-material/ListOutlined";
import { default as AnnexesIcon } from "@mui/icons-material/PanoramaOutlined";
import { default as QuestionsIcon } from "@mui/icons-material/QuizOutlined";
import { default as SettingsIcon } from "@mui/icons-material/SettingsOutlined";
import { default as CardIcon } from "@mui/icons-material/StyleOutlined";
import {
  questionBankNameSchema,
  type QuestionBankName,
} from "@cf/core/question-bank";
import {
  ModulesHeader,
  ModulesSidebarHomeItem,
  ModulesSidebarListItem,
} from "@cf/next/ui";
import { QuestionBank } from "@cf/providers/question-bank";
import { ThemeOverrideColorScheme } from "@cf/react/theme";
import { Sidebar } from "@cf/react/ui";
import type { FunctionComponent, ReactNode } from "react";

type ModulePageTemplateProps = {
  children: ReactNode;
  params: {
    questionBank: QuestionBankName;
  };
};

const ModulePageTemplate: FunctionComponent<ModulePageTemplateProps> = async ({
  children,
  params: { questionBank },
}) => {
  if (questionBankNameSchema.safeParse(questionBank).success === false) {
    return notFound();
  }

  const bank = new QuestionBank(questionBank);

  return (
    <>
      <ThemeOverrideColorScheme questionBank={questionBank} />
      <Sidebar sx={{ height: "100vh" }}>
        <ModulesSidebarHomeItem />
        <ModulesSidebarListItem
          key="home"
          title="Home"
          href={`/${questionBank}/home`}
          icon={HomeIcon}
        />
        {(await bank.has("questions")) && (
          <ModulesSidebarListItem
            key="tests"
            title="Tests"
            href={`/${questionBank}/tests`}
            icon={TestIcon}
          />
        )}
        {(await bank.has("questions")) && (
          <ModulesSidebarListItem
            key="questions"
            title="Questions"
            href={`/${questionBank}/questions`}
            icon={QuestionsIcon}
          />
        )}
        {(await bank.has("docs")) && (
          <ModulesSidebarListItem
            key="docs"
            title="Docs"
            href={`/${questionBank}/docs`}
            icon={DocsIcon}
          />
        )}
        {(await bank.has("learningObjectives")) && (
          <ModulesSidebarListItem
            key="learningObjectives"
            title="Learning Objectives"
            href={`/${questionBank}/learning-objectives`}
            icon={LearningObjectivesIcon}
          />
        )}
        {(await bank.has("annexes")) && (
          <ModulesSidebarListItem
            key="annexes"
            title="Annexes"
            href={`/${questionBank}/annexes`}
            icon={AnnexesIcon}
          />
        )}
        {(await bank.has("flashcards")) && (
          <ModulesSidebarListItem
            key="flashcards"
            title="Flash Cards"
            href={`/${questionBank}/flashcards`}
            icon={CardIcon}
            sx={{ "& svg": { transform: "rotate(180deg)" } }}
          />
        )}
        <ModulesSidebarListItem
          bottom
          key="settings"
          title="Settings"
          href={`/${questionBank}/settings`}
          icon={SettingsIcon}
        />
      </Sidebar>
      <ModulesHeader />
      {children}
    </>
  );
};

export default ModulePageTemplate;
