import { createFileRoute, Link } from "@tanstack/react-router";
import { A320Front } from "../../libs/ui/outlines/a320-front";
import { B737Front } from "../../libs/ui/outlines/b737-front";
import { CessnaProfile } from "../../libs/ui/outlines/cessna-profile";
import { cn } from "../../libs/ui/utils/cn";
import { fetchModuleCounts } from "../-server-functions/question-banks/fetch-module-counts";
import type { FC } from "react";

const MODULES = [
  {
    name: "atpl",
    kind: "ATPL",
    title: "ECQB 2026",
    outlineClassName: "max-md:!-bottom-2",
    Outline: CessnaProfile,
  },
  {
    name: "a320",
    kind: "Type rating",
    title: "A320",
    outlineClassName: "max-md:!bottom-6",
    Outline: A320Front,
  },
  {
    name: "b737",
    kind: "Type rating",
    title: "737",
    outlineClassName: "max-md:!bottom-6",
    Outline: B737Front,
  },
] as const;

const ModulePickerPage: FC = () => {
  const counts = Route.useLoaderData();

  return (
    <main
      className={cn(
        "mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10",
        "sm:py-16",
      )}
    >
      <h1 className="m-0 text-3xl font-semibold tracking-tight sm:text-4xl">
        Choose a module
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {MODULES.map(({ name, kind, title, outlineClassName, Outline }) => (
          <Link
            key={name}
            to={`/modules/${name}`}
            preload="intent"
            className={cn(
              "group relative isolate flex h-40 flex-col overflow-hidden md:h-64",
              "rounded-xl border border-rule bg-paper/80 p-5 text-ink md:p-6",
              "no-underline backdrop-blur transition-colors",
              "hover:border-brand",
            )}
          >
            <span className="text-xs font-medium tracking-widest text-muted">
              {kind.toUpperCase()}
            </span>
            <span className="mt-1 text-2xl font-semibold tracking-tight">
              {title}
            </span>
            <Outline
              className={cn(
                "aircraft-module-outline !bottom-12 !opacity-50",
                "transition-opacity group-hover:!opacity-80",
                "text-brand",
                outlineClassName,
              )}
            />
            <span className="mt-auto flex items-center justify-between">
              <span className="text-sm text-muted">
                {counts[name] ?? 0} questions
              </span>
              <span className="text-sm font-medium text-brand">Open →</span>
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
};

export const Route = createFileRoute("/(public)/modules/")({
  loader: () => fetchModuleCounts(),
  head: () => ({ meta: [{ title: "Modules · Chair Flight" }] }),
  component: ModulePickerPage,
});
