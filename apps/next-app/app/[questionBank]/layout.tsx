import { QuestionBank } from "@cf/providers/question-bank";
import { AppHeader } from "@cf/react/components";
import { ThemeOverrideColorScheme } from "@cf/react/theme";
import { ModulesHeader } from "./_client/modules-header";
import { ModulesSidebar } from "./_client/modules-sidebar";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { FunctionComponent, ReactNode } from "react";

const getModuleData = async (questionBank: QuestionBankName) => {
  const bank = QuestionBank.get(questionBank);

  const routes = {
    home: {
      href: `/${questionBank}`,
      isVisible: true,
    },
    questions: {
      href: `/${questionBank}/questions`,
      isVisible: await bank.has("questions"),
    },
    learningObjectives: {
      href: `/${questionBank}/learning-objectives`,
      isVisible: await bank.has("learningObjectives"),
    },
    annexes: {
      href: `/${questionBank}/annexes`,
      isVisible: await bank.has("annexes"),
    },
    tests: {
      href: `/${questionBank}/tests`,
      isVisible: await bank.has("questions"),
    },
    docs: {
      href: `/${questionBank}/docs`,
      isVisible: await bank.has("docs"),
    },
    flashcards: {
      href: `/${questionBank}/flashcards`,
      isVisible: await bank.has("flashcards"),
    },
    settings: {
      href: `/${questionBank}/settings`,
      isVisible: true,
    },
  };

  return { routes };
};

type ModulePageTemplateProps = {
  children: ReactNode;
  params: { questionBank: QuestionBankName };
};

const ModulePageTemplate: FunctionComponent<ModulePageTemplateProps> = async ({
  children,
  params: { questionBank },
}) => {
  const { routes } = await getModuleData(questionBank);

  return (
    <>
      <ThemeOverrideColorScheme questionBank={questionBank} />
      <ModulesSidebar routes={routes} />
      <ModulesHeader />
      {children}
    </>
  );
};

export default ModulePageTemplate;
