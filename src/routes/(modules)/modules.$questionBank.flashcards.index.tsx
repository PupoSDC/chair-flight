import { createFileRoute, Link } from "@tanstack/react-router";
import { formatSlugAsTitle } from "../../libs/base/format-values";
import { cn } from "../../libs/ui/utils/cn";
import { fetchFlashcardCollections } from "../-server-functions/question-bank/fetch-flashcard-collections";
import type { FC } from "react";

const FlashcardCollectionsPage: FC = () => {
  const { questionBank } = Route.useParams();
  const collections = Route.useLoaderData();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4">
      <h1 className="m-0 text-2xl font-bold">Flashcards</h1>
      {collections.length === 0 && (
        <p className="p-6 text-center text-sm text-muted">No flashcards</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            to="/modules/$questionBank/flashcards/$collectionId"
            params={{ questionBank, collectionId: collection.id }}
            className={cn(
              "group flex flex-col overflow-hidden rounded-lg border",
              "border-rule bg-paper text-ink no-underline hover:border-accent",
            )}
          >
            <img
              src={`/images/flashcards/${collection.id}.png`}
              alt=""
              className="aspect-video w-full object-cover"
            />
            <span className="flex flex-col gap-0.5 p-3">
              <span className="font-semibold group-hover:text-accent">
                {formatSlugAsTitle(collection.id)}
              </span>
              <span className="text-sm text-muted">
                {collection.numberOfFlashcards} Flashcards
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const Route = createFileRoute(
  "/(modules)/modules/$questionBank/flashcards/",
)({
  loader: ({ params }) => fetchFlashcardCollections({ data: params }),
  component: FlashcardCollectionsPage,
});
