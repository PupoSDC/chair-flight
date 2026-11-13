import {
  createFileRoute,
  Link,
  notFound,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import { useState } from "react";
import { formatSlugAsTitle } from "../../libs/base/format-values";
import {
  QUESTION_BANK_NAMES,
  QUESTION_BANKS,
} from "../../libs/core/question-bank/question-banks";
import { IconButton } from "../../libs/ui/components/base/icon-button";
import { Logo } from "../../libs/ui/components/base/logo";
import { GITHUB_URL } from "../../libs/ui/components/base/public-header";
import { ThemeToggle } from "../../libs/ui/components/base/theme-toggle";
import { useMediaQuery } from "../../libs/ui/hooks/use-media-query";
import { useQuestionBankTheme } from "../../libs/ui/hooks/use-question-bank-theme";
import { BookIcon } from "../../libs/ui/icons/book-icon";
import { CardsIcon } from "../../libs/ui/icons/cards-icon";
import { ChevronLeftIcon } from "../../libs/ui/icons/chevron-left-icon";
import { ChevronRightIcon } from "../../libs/ui/icons/chevron-right-icon";
import { GithubIcon } from "../../libs/ui/icons/github-icon";
import { HelpIcon } from "../../libs/ui/icons/help-icon";
import { HomeIcon } from "../../libs/ui/icons/home-icon";
import { LayersIcon } from "../../libs/ui/icons/layers-icon";
import { ListIcon } from "../../libs/ui/icons/list-icon";
import { MenuIcon } from "../../libs/ui/icons/menu-icon";
import { cn } from "../../libs/ui/utils/cn";
import { fetchSubjects } from "../-server-functions/question-bank/fetch-subjects";
import type { FC } from "react";

const NAV_ITEMS = [
  {
    to: "/modules/$questionBank",
    label: "Home",
    icon: HomeIcon,
    requires: null,
  },
  {
    to: "/modules/$questionBank/tests",
    label: "Tests",
    icon: ListIcon,
    requires: "hasQuestions",
  },
  {
    to: "/modules/$questionBank/questions",
    label: "Questions",
    icon: HelpIcon,
    requires: "hasQuestions",
  },
  {
    to: "/modules/$questionBank/docs",
    label: "Docs",
    icon: BookIcon,
    requires: "hasQuestions",
  },
  {
    to: "/modules/$questionBank/learning-objectives",
    label: "Learning Objectives",
    icon: LayersIcon,
    requires: "hasQuestions",
  },
  {
    to: "/modules/$questionBank/flashcards",
    label: "Flashcards",
    icon: CardsIcon,
    requires: "hasFlashcards",
  },
] as const;

const ModuleLayout: FC = () => {
  const { questionBank } = Route.useParams();
  const { pathname } = useLocation();
  useQuestionBankTheme(questionBank);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 639px)");
  const bank = QUESTION_BANKS[questionBank];
  const [section, item] = pathname.split("/").slice(3);
  const sectionLink = NAV_ITEMS.find(
    (navItem) => navItem.to.split("/")[3] === section,
  )?.to;
  const isOpen = isMobile ? mobileOpen : desktopOpen;

  return (
    <div data-bank={questionBank} className="h-dvh bg-canvas text-ink">
      <div
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 z-30 bg-black/40 backdrop-blur-sm sm:hidden",
          !mobileOpen && "hidden",
        )}
      />
      <nav
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col overflow-x-hidden",
          "border-rule bg-paper transition-[width] duration-250",
          mobileOpen ? "w-[210px] border-r" : "w-0",
          desktopOpen ? "sm:w-[210px]" : "sm:w-[42px]",
          "sm:border-r",
        )}
      >
        <Link
          to="/"
          className={cn(
            "flex h-12 flex-none items-center gap-2 border-b border-rule",
            "pl-2 text-ink no-underline",
          )}
        >
          <Logo />
          <span
            className={cn(
              "text-sm font-bold tracking-widest whitespace-nowrap uppercase",
            )}
          >
            Chair Flight
          </span>
        </Link>
        <div className="flex min-h-0 flex-1 flex-col overflow-x-hidden">
          {NAV_ITEMS.filter(
            (navItem) => !navItem.requires || bank[navItem.requires],
          ).map((navItem) => (
            <Link
              key={navItem.to}
              to={navItem.to}
              params={{ questionBank }}
              title={navItem.label}
              activeOptions={{ exact: navItem.label === "Home" }}
              activeProps={{ className: "border-l-accent text-accent" }}
              inactiveProps={{ className: "border-l-transparent text-ink" }}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex flex-none items-center gap-3 border-b border-l-4 border-b-rule p-2",
                "text-sm font-medium whitespace-nowrap no-underline hover:text-accent",
              )}
            >
              <navItem.icon size={20} className="flex-none" />
              <span>{navItem.label}</span>
            </Link>
          ))}
        </div>
        <button
          type="button"
          aria-label={isOpen ? "Collapse menu" : "Expand menu"}
          className={cn(
            "flex flex-none cursor-pointer items-center gap-3 border-0",
            "border-t border-l-4 border-rule border-l-transparent",
            "bg-transparent p-2 text-sm whitespace-nowrap text-ink",
            "hover:text-accent",
          )}
          onClick={() =>
            isMobile ? setMobileOpen(false) : setDesktopOpen(!desktopOpen)
          }
        >
          <ChevronLeftIcon
            size={20}
            className={cn(
              "flex-none transition-transform duration-250",
              !isOpen && "rotate-180",
            )}
          />
          <span>Collapse</span>
        </button>
      </nav>
      <div
        className={cn(
          "flex h-dvh min-w-0 flex-col transition-[margin] duration-250",
          desktopOpen ? "sm:ml-[210px]" : "sm:ml-[42px]",
        )}
      >
        <header
          className={cn(
            "flex h-12 flex-none items-center gap-2 border-b border-rule",
            "bg-paper px-4",
          )}
        >
          <div className="flex min-w-0 flex-1 items-center gap-1 text-sm">
            <Link
              to="/modules/$questionBank"
              params={{ questionBank }}
              className="flex-none font-semibold text-ink no-underline"
            >
              {bank.shortTitle}
            </Link>
            {section && (
              <>
                <ChevronRightIcon size={14} className="flex-none text-muted" />
                {item && sectionLink ? (
                  <Link
                    to={sectionLink}
                    params={{ questionBank }}
                    className="flex-none text-ink no-underline hover:text-accent max-sm:hidden"
                  >
                    {formatSlugAsTitle(section)}
                  </Link>
                ) : (
                  <span className="flex-none">
                    {formatSlugAsTitle(section)}
                  </span>
                )}
              </>
            )}
            {item && (
              <>
                <ChevronRightIcon
                  size={14}
                  className="flex-none text-muted max-sm:hidden"
                />
                <span className="truncate text-muted">
                  {item === "create" ? "Create" : decodeURIComponent(item)}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className={cn(
                "grid size-8 flex-none place-items-center rounded-md border",
                "border-rule-strong bg-paper text-ink hover:border-accent",
                "hover:text-accent",
              )}
            >
              <GithubIcon />
            </a>
            <ThemeToggle />
            <IconButton
              label="Open menu"
              className="sm:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/(modules)/modules/$questionBank")({
  params: {
    parse: (params) => {
      const questionBank = QUESTION_BANK_NAMES.find(
        (name) => name === params.questionBank,
      );
      if (!questionBank) throw notFound();
      return { questionBank };
    },
  },
  beforeLoad: ({ params, location }) => {
    const section = location.pathname.split("/")[3];
    const navItem = NAV_ITEMS.find((item) => item.to.split("/")[3] === section);
    const requires = navItem && "requires" in navItem && navItem.requires;
    if (requires && !QUESTION_BANKS[params.questionBank][requires])
      throw redirect({
        to: "/modules/$questionBank",
        params: { questionBank: params.questionBank },
      });
  },
  loader: ({ params }) => fetchSubjects({ data: params }),
  staleTime: Number.POSITIVE_INFINITY,
  head: ({ params }) => ({
    meta: [
      { title: `${QUESTION_BANKS[params.questionBank].title} · Chair Flight` },
    ],
  }),
  component: ModuleLayout,
});
