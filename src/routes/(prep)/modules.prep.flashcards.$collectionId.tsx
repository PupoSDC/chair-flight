import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { formatSlugAsTitle } from "../../libs/base/format-values";
import { Markdown } from "../../libs/ui/components/base/markdown";
import { cn } from "../../libs/ui/utils/cn";
import { fetchPrepFlashcards } from "../-server-functions/prep/fetch-prep-flashcards";
import type { FC } from "react";

const Flashcard: FC<{
  question: string;
  answer: string;
}> = ({ question, answer }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={flipped}
      className={cn(
        "flex min-h-48 cursor-pointer flex-col gap-2 rounded-lg border p-4",
        "text-left text-ink hover:border-accent",
        flipped ? "border-accent bg-accent-soft" : "border-rule bg-paper",
      )}
      onClick={() => setFlipped(!flipped)}
    >
      <span className="text-xs font-semibold text-muted uppercase">
        {flipped ? "Answer" : "Question"}
      </span>
      <Markdown className="text-sm">{flipped ? answer : question}</Markdown>
    </button>
  );
};

const FlashcardsPage: FC = () => {
  const { collectionId } = Route.useParams();
  const flashcards = Route.useLoaderData();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4">
      <h1 className="m-0 text-2xl font-bold">
        {formatSlugAsTitle(collectionId)}
      </h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {flashcards.map((flashcard) => (
          <Flashcard
            key={flashcard.id}
            question={flashcard.question}
            answer={flashcard.answer}
          />
        ))}
      </div>
    </div>
  );
};

export const Route = createFileRoute(
  "/(prep)/modules/prep/flashcards/$collectionId",
)({
  loader: async ({ params }) => {
    const flashcards = await fetchPrepFlashcards({
      data: { ...params },
    });
    if (flashcards.length === 0) throw notFound();
    return flashcards;
  },
  component: FlashcardsPage,
});
