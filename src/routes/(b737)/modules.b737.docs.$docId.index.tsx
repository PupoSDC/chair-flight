import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { Markdown } from "../../libs/ui/components/base/markdown";
import type { FC } from "react";

const DOC_ROUTE = getRouteApi("/(b737)/modules/b737/docs/$docId");

const DocNotesPage: FC = () => {
  const { chapter } = DOC_ROUTE.useLoaderData();
  return !chapter.content.trim() ? (
    <p className="m-0 text-sm text-muted">
      This page has not been written yet.
    </p>
  ) : (
    <Markdown>{chapter.content}</Markdown>
  );
};

export const Route = createFileRoute("/(b737)/modules/b737/docs/$docId/")({
  component: DocNotesPage,
});
