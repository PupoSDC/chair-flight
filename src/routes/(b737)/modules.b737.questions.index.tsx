import { createFileRoute } from "@tanstack/react-router";
import { cn } from "../../libs/ui/utils/cn";
import type { FC } from "react";

const QuestionsPage: FC = () => (
  <div
    className={cn(
      "flex h-full flex-col items-center justify-center gap-3 p-8",
      "max-lg:pb-6",
      "text-center",
    )}
  >
    <h1
      className={cn(
        "m-0 bg-linear-to-b from-ink to-accent bg-clip-text text-8xl",
        "font-bold tracking-tight text-transparent",
      )}
    >
      737
    </h1>
    <span
      className={cn(
        "text-xs font-semibold tracking-widest text-accent uppercase",
      )}
    >
      Questions
    </span>
  </div>
);

export const Route = createFileRoute("/(b737)/modules/b737/questions/")({
  staticData: { breadcrumbs: () => [{ label: "Questions" }] },
  component: QuestionsPage,
});
