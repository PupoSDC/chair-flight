import { createFileRoute } from "@tanstack/react-router";
import { Markdown } from "../../libs/ui/components/base/markdown";
import { cn } from "../../libs/ui/utils/cn";
import type { FC } from "react";

const CONTENT = `Built by students for students.

Here you will find study materials for your ATPL theory exams, and for your 737 or A320 type rating course.

## Open source

The code and the questions are public on [GitHub](https://github.com/PupoSDC/chair-flight) under a non-commercial licence. If you spot a mistake, or want to contribute a question, open an issue or a pull request.

## A note of caution

Chair Flight is a study aid. It is not affiliated with EASA, any airline, or any aircraft manufacturer, and it does not replace official training material. Always check the official documentation of your aircraft and training organisation.`;

const AboutPage: FC = () => (
  <main
    className={cn(
      "mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10",
      "sm:py-16",
    )}
  >
    <article
      className={cn(
        "flex flex-col gap-6 rounded-2xl border border-rule bg-paper/85 p-5",
        "backdrop-blur sm:p-10",
      )}
    >
      <h1
        className={cn(
          "m-0 text-3xl leading-tight font-bold tracking-tighter sm:text-4xl",
        )}
      >
        About
      </h1>
      <Markdown className="text-base leading-7">{CONTENT}</Markdown>
    </article>
  </main>
);

export const Route = createFileRoute("/(public)/about")({
  head: () => ({ meta: [{ title: "About · Chair Flight" }] }),
  component: AboutPage,
});
