import { QuestionBankName } from "@cf/core/question-bank";
import { QuestionBank } from "@cf/providers/question-bank";
import { AppHeader, AppLogo, AppSidebar, AppSidebarButton, AppSidebarCollapseButton, AppSidebarItem, AppSidebarLink, AppThemeButton, cn } from "@cf/react/ui";
import { AcademicCapIcon, BuildingLibraryIcon, HomeIcon, PaperClipIcon, PencilSquareIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { FunctionComponent, ReactNode } from "react";

type QuestionBankLayoutProps = {
  children: ReactNode;
  params: { questionBank: QuestionBankName };
};

const QuestionBankLayout : FunctionComponent<QuestionBankLayoutProps> = async ({
  params: { questionBank },
  children,
}) => {
  const bank = QuestionBank.get(questionBank);

  return (
    <>
      <AppSidebar 
        style={{ transition: "width 300ms ease-out" }}
        className="dark:bg-neutral-900 bg-neutral-100"
      >
        <Link href="/" className="border-b p-2 h-10 flex">
          <AppLogo />
        </Link>
        <AppSidebarLink
          icon={<HomeIcon />}
          title="Home"
          href={`/${questionBank}`}
        />
        {await bank.has("questions") && (
          <AppSidebarLink
            icon={<PencilSquareIcon />}
            title="Tests"
            href={`/${questionBank}/tests`}
          />
        )}
        {await bank.has("questions") && (
          <AppSidebarLink
            icon={<QuestionMarkCircleIcon />}
            title="Questions"
            href={`/${questionBank}/questions`}
          />
        )}
        {await bank.has("learningObjectives") && (
          <AppSidebarLink
            icon={<AcademicCapIcon />}
            title="Learning Objectives"
            href={`/${questionBank}/learning-objectives`}
          />
        )}
        {await bank.has("annexes") && (
          <AppSidebarLink
            icon={<PaperClipIcon />}
            title="Annexes"
            href={`/${questionBank}/annexes`}
          />
        )}

        {await bank.has("docs") && (
          <AppSidebarLink
            icon={<BuildingLibraryIcon />}
            title="Docs"
            href={`/${questionBank}/docs`}
          />
        )}
        {await bank.has("flashcards") && (
          <AppSidebarLink
            icon={<QuestionMarkCircleIcon />}
            title="Flashcards"
            href={`/${questionBank}/flashcards`}
          />
        )}
        <AppSidebarLink
          icon={<QuestionMarkCircleIcon />}
          title="Settings"
          href={`/${questionBank}/settings`}
          className="mt-auto border-t border-b-0"
        />
        <AppSidebarCollapseButton />
      </AppSidebar>
      <AppHeader
        style={{ transition: "width 300ms ease-out" }}
        className={cn(
          "right-0",
          "dark:bg-neutral-900 bg-neutral-100",
          "w-[calc(100%_-_var(--sidebar-mobile-width))]",
          "md:w-[calc(100%_-_var(--sidebar-desktop-width))]",
        )}
      >
        <AppThemeButton className="ml-auto"/>
        <AppSidebarButton className="md:hidden"/>
      </AppHeader>
      <main
        style={{ transition: "width 300ms ease-out" }}
        className={cn(
          "ml-auto",
          "w-full",
          "md:w-[calc(100%_-_var(--sidebar-desktop-width))]",
        )}
      >
        {children}
      </main>
    </>

  );
}

export default QuestionBankLayout;