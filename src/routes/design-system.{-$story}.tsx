import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Logo } from "../libs/ui/components/base/logo";
import { ThemeToggle } from "../libs/ui/components/base/theme-toggle";
import { cn } from "../libs/ui/utils/cn";
import { AccountButtonStory } from "./-design-system/account-button-story";
import { AccountModalStory } from "./-design-system/account-modal-story";
import { AnnexBuffetOnsetChartStory } from "./-design-system/annex-buffet-onset-chart-story";
import { AnnexModalStory } from "./-design-system/annex-modal-story";
import { AnnexMrjtLoadTrimSheetStory } from "./-design-system/annex-mrjt-load-trim-sheet-story";
import { AppShellStory } from "./-design-system/app-shell-story";
import { BadgeStory } from "./-design-system/badge-story";
import { BreadcrumbsStory } from "./-design-system/breadcrumbs-story";
import { ButtonIconStory } from "./-design-system/button-icon-story";
import { ButtonStory } from "./-design-system/button-story";
import { CardStory } from "./-design-system/card-story";
import { ChapterNavigationStory } from "./-design-system/chapter-navigation-story";
import { CheckboxStory } from "./-design-system/checkbox-story";
import { ColorsStory } from "./-design-system/colors-story";
import { CommentMarkdownStory } from "./-design-system/comment-markdown-story";
import { DrawerStory } from "./-design-system/drawer-story";
import { IconsStory } from "./-design-system/icons-story";
import { InputStory } from "./-design-system/input-story";
import { LearningObjectiveTableStory } from "./-design-system/learning-objective-table-story";
import { LogoStory } from "./-design-system/logo-story";
import { MarkdownStory } from "./-design-system/markdown-story";
import { ModalStory } from "./-design-system/modal-story";
import { ModuleTitleStory } from "./-design-system/module-title-story";
import { NestedCheckboxSelectStory } from "./-design-system/nested-checkbox-select-story";
import { OutlinesStory } from "./-design-system/outlines-story";
import { QuestionCommentsStory } from "./-design-system/question-comments-story";
import { QuestionMultipleChoiceStory } from "./-design-system/question-multiple-choice-story";
import { QuestionPreviewStory } from "./-design-system/question-preview-story";
import { SearchHighlightStory } from "./-design-system/search-highlight-story";
import { SearchTableStory } from "./-design-system/search-table-story";
import { SelectStory } from "./-design-system/select-story";
import { SliderWithInputStory } from "./-design-system/slider-with-input-story";
import { TestHeaderStory } from "./-design-system/test-header-story";
import { TestMakerStory } from "./-design-system/test-maker-story";
import { TestNavigationStory } from "./-design-system/test-navigation-story";
import { TestResumeBannerStory } from "./-design-system/test-resume-banner-story";
import { TestReviewStory } from "./-design-system/test-review-story";
import { TestRunnerStory } from "./-design-system/test-runner-story";
import { ThemeToggleStory } from "./-design-system/theme-toggle-story";
import { TypicalStory } from "./-design-system/typical-story";
import { WordmarkStory } from "./-design-system/wordmark-story";
import type { FC } from "react";

const GROUPS: {
  title: string;
  stories: { id: string; name: string; about: string; Story: FC }[];
}[] = [
  {
    title: "Foundations",
    stories: [
      {
        id: "colors",
        name: "Colors",
        about: "The colour tokens, switching with the theme.",
        Story: ColorsStory,
      },
      {
        id: "icons",
        name: "SVG Icons",
        about:
          "Every icon in src/libs/ui/icons, drawn in the current text colour.",
        Story: IconsStory,
      },
      {
        id: "outlines",
        name: "SVG Outlines",
        about: "Line drawings of aircraft, engines, wings and controls.",
        Story: OutlinesStory,
      },
    ],
  },
  {
    title: "Base",
    stories: [
      {
        id: "app-shell",
        name: "App shell",
        about:
          "The sidebar, header and scrolling main area around every module.",
        Story: AppShellStory,
      },
      {
        id: "badge",
        name: "Badge",
        about: "A small status label.",
        Story: BadgeStory,
      },
      {
        id: "breadcrumbs",
        name: "Breadcrumbs",
        about: "The trail of parent pages in the header.",
        Story: BreadcrumbsStory,
      },
      {
        id: "button",
        name: "Button",
        about:
          "The one button: outline, solid or choice, with an optional icon.",
        Story: ButtonStory,
      },
      {
        id: "button-icon",
        name: "Button icon",
        about: "The icon inside a button, sized to it.",
        Story: ButtonIconStory,
      },
      {
        id: "card",
        name: "Card",
        about: "A plain bordered surface.",
        Story: CardStory,
      },
      {
        id: "checkbox",
        name: "Checkbox",
        about: "A checkbox with checked, indeterminate and disabled states.",
        Story: CheckboxStory,
      },
      {
        id: "drawer",
        name: "Drawer",
        about: "A panel sliding in from the right.",
        Story: DrawerStory,
      },
      {
        id: "input",
        name: "Input",
        about:
          "A labelled text field with required, error and disabled states.",
        Story: InputStory,
      },
      {
        id: "logo",
        name: "Logo",
        about: "The brand mark.",
        Story: LogoStory,
      },
      {
        id: "markdown",
        name: "Markdown",
        about: "Rendered markdown for trusted content.",
        Story: MarkdownStory,
      },
      {
        id: "modal",
        name: "Modal",
        about: "A dialog over a dimmed page.",
        Story: ModalStory,
      },
      {
        id: "module-title",
        name: "Module title",
        about: "Module heading with an optional subtitle.",
        Story: ModuleTitleStory,
      },
      {
        id: "nested-checkbox-select",
        name: "Nested checkbox select",
        about:
          "Parent checkboxes that expand to their children, with a mixed state.",
        Story: NestedCheckboxSelectStory,
      },
      {
        id: "search-highlight",
        name: "Search highlight",
        about: "Highlights the words of a query inside a text.",
        Story: SearchHighlightStory,
      },
      {
        id: "search-table",
        name: "Search table",
        about: "A table that loads more rows as you scroll.",
        Story: SearchTableStory,
      },
      {
        id: "select",
        name: "Select",
        about: "A labelled dropdown with required and disabled states.",
        Story: SelectStory,
      },
      {
        id: "slider-with-input",
        name: "Slider with input",
        about: "A number field and a range slider kept in sync.",
        Story: SliderWithInputStory,
      },
      {
        id: "theme-toggle",
        name: "Theme toggle",
        about: "The light and dark switch.",
        Story: ThemeToggleStory,
      },
      {
        id: "wordmark",
        name: "Wordmark",
        about: "The brand name next to the mark.",
        Story: WordmarkStory,
      },
    ],
  },
  {
    title: "Community",
    stories: [
      {
        id: "account-button",
        name: "Account button",
        about: "Sign in, the account menu and the sidebar account rows.",
        Story: AccountButtonStory,
      },
      {
        id: "account-modal",
        name: "Account modal",
        about: "The sign in dialog.",
        Story: AccountModalStory,
      },
      {
        id: "comment-markdown",
        name: "Comment markdown",
        about: "Markdown for user comments, with headings and images stripped.",
        Story: CommentMarkdownStory,
      },
      {
        id: "question-comments",
        name: "Question comments",
        about: "The comment thread of a question.",
        Story: QuestionCommentsStory,
      },
    ],
  },
  {
    title: "Public",
    stories: [
      {
        id: "typical",
        name: "Typical",
        about: "The typewriter headline.",
        Story: TypicalStory,
      },
    ],
  },
  {
    title: "Question bank",
    stories: [
      {
        id: "chapter-navigation",
        name: "Chapter navigation",
        about: "The chapter list: a card on small screens, rows in a sidebar.",
        Story: ChapterNavigationStory,
      },
      {
        id: "annex-modal",
        name: "Annex modal",
        about: "The viewer for a question annex.",
        Story: AnnexModalStory,
      },
      {
        id: "annex-mrjt-load-trim-sheet",
        name: "Annex MRJT load and trim sheet",
        about: "The fillable Load and Trim Sheet used by MRJT questions.",
        Story: AnnexMrjtLoadTrimSheetStory,
      },
      {
        id: "annex-buffet-onset-chart",
        name: "Annex buffet onset chart",
        about: "The buffet onset boundary chart with solved overlay lines.",
        Story: AnnexBuffetOnsetChartStory,
      },
      {
        id: "learning-objective-table",
        name: "Learning objective table",
        about: "Learning objectives as a collapsible, searchable tree.",
        Story: LearningObjectiveTableStory,
      },
      {
        id: "question-preview",
        name: "Question preview",
        about: "A question with its header, explanation and comments.",
        Story: QuestionPreviewStory,
      },
    ],
  },
  {
    title: "Tests",
    stories: [
      {
        id: "question-multiple-choice",
        name: "Question multiple choice",
        about: "A question with options; pick one to see the result.",
        Story: QuestionMultipleChoiceStory,
      },
      {
        id: "test-header",
        name: "Test header",
        about: "The top bar of a running test.",
        Story: TestHeaderStory,
      },
      {
        id: "test-maker",
        name: "Test maker",
        about:
          "The form that configures a new test: mode, subject, chapters, size.",
        Story: TestMakerStory,
      },
      {
        id: "test-navigation",
        name: "Test navigation",
        about: "The grid to jump between the questions of a test.",
        Story: TestNavigationStory,
      },
      {
        id: "test-resume-banner",
        name: "Test resume banner",
        about: "Warns that a new test erases the one in progress.",
        Story: TestResumeBannerStory,
      },
      {
        id: "test-review",
        name: "Test review",
        about: "The result of a finished test.",
        Story: TestReviewStory,
      },
      {
        id: "test-runner",
        name: "Test runner",
        about: "The running test, full screen.",
        Story: TestRunnerStory,
      },
    ],
  },
];

const STORIES = GROUPS.flatMap((group) => group.stories);

const DesignSystemPage: FC = () => {
  const { story: storyId } = Route.useParams();
  const currentStory = STORIES.find(({ id }) => id === storyId) ?? STORIES[0];

  return (
    <div className="grid min-h-dvh bg-canvas text-ink md:grid-cols-[240px_1fr]">
      <aside
        className={cn(
          "border-b border-rule bg-paper p-4 md:sticky md:top-0 md:h-dvh",
          "md:overflow-y-auto md:border-r md:border-b-0",
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <Link
            to="/design-system/{-$story}"
            className={cn(
              "flex items-center gap-2 text-[15px] font-bold text-ink",
              "no-underline",
            )}
          >
            <Logo className="size-5" />
            Design system
          </Link>
          <ThemeToggle />
        </div>
        <nav className="flex flex-col gap-4">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <h2
                className={cn(
                  "mt-0 mb-1.5 text-[11px] font-semibold tracking-[.06em]",
                  "text-muted uppercase",
                )}
              >
                {group.title}
              </h2>
              <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
                {group.stories.map(({ id, name }) => (
                  <li key={id}>
                    <Link
                      to="/design-system/{-$story}"
                      params={{ story: id }}
                      className={
                        id === currentStory.id
                          ? cn(
                              "block rounded-md bg-accent-soft px-2.5",
                              "py-1.5 text-[13px] font-semibold",
                              "text-accent no-underline",
                            )
                          : cn(
                              "block rounded-md px-2.5 py-1.5 text-[13px]",
                              "font-semibold text-muted no-underline",
                              "hover:text-ink",
                            )
                      }
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
        <header>
          <h1 className="m-0 text-2xl font-bold">{currentStory.name}</h1>
          <p className="mt-1 mb-0 text-sm text-muted">{currentStory.about}</p>
        </header>
        <currentStory.Story />
      </main>
    </div>
  );
};

export const Route = createFileRoute("/design-system/{-$story}")({
  beforeLoad: ({ params }) => {
    if (params.story && !STORIES.some(({ id }) => id === params.story)) {
      throw redirect({
        to: "/design-system/{-$story}",
        params: { story: undefined },
      });
    }
  },
  head: () => ({
    meta: [{ title: "Design system" }, { name: "robots", content: "noindex" }],
  }),
  component: DesignSystemPage,
});
