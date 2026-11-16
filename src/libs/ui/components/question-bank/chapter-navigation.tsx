import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import type { LinkProps } from "@tanstack/react-router";
import type { FC } from "react";

export const ChapterNavigation: FC<{
  chapters: {
    id: string;
    title: string;
    numberOfQuestions: number;
  }[];
  selectedChapterId?: string;
  chapterLink: (chapterId: string) => LinkProps;
}> = ({ chapters, selectedChapterId, chapterLink }) => (
  <div className="@container">
    <ol
      className={cn(
        "m-0 flex list-none flex-col overflow-hidden p-0",
        "rounded-xl border border-rule-strong bg-paper",
        "@max-xs:rounded-none @max-xs:border-0",
      )}
    >
      {chapters.map((chapter) => (
        <li
          key={chapter.id}
          className="border-b border-rule last:border-0 @max-xs:border-0"
        >
          <Link
            {...chapterLink(chapter.id)}
            className={cn(
              "flex items-center gap-4 px-4 py-3.5 no-underline",
              "@max-xs:gap-3 @max-xs:border-b @max-xs:border-l-4",
              "@max-xs:border-rule @max-xs:px-2 @max-xs:py-2.5",
              "hover:text-accent",
              chapter.id === selectedChapterId
                ? "text-accent @max-xs:border-l-accent"
                : "text-ink @max-xs:border-l-transparent",
            )}
          >
            <span
              className={cn(
                "w-7 flex-none text-xl font-light text-accent tabular-nums",
                "@max-xs:w-5 @max-xs:text-right @max-xs:text-sm",
                "@max-xs:font-semibold",
              )}
            >
              {Number(chapter.id)}
            </span>
            <span
              className={cn("flex min-w-0 flex-1 flex-col text-sm font-medium")}
            >
              <span>{chapter.title}</span>
              <span className="text-xs font-normal text-muted">
                {chapter.numberOfQuestions} questions
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  </div>
);
