import { createFileRoute } from "@tanstack/react-router";
import { ButtonLink } from "../../libs/ui/components/base/button-link";
import { Typical } from "../../libs/ui/components/public/typical";
import { ChevronRightIcon } from "../../libs/ui/icons/chevron-right-icon";
import { cn } from "../../libs/ui/utils/cn";
import type { FC } from "react";

const HEADLINE_STEPS = [
  "Community Built",
  2000,
  "Minimalistic",
  2000,
  "Free",
  2000,
];

const HomePage: FC = () => (
  <main
    className={cn(
      "mx-auto flex w-full max-w-310 flex-1 flex-col items-center",
      "justify-center gap-6 p-4 text-center md:p-8",
    )}
  >
    <div>
      <h1
        className={cn(
          "m-0 text-3xl leading-tight font-bold tracking-tighter",
          "md:text-6xl",
        )}
      >
        Chair Flight is <br />
        <Typical
          steps={HEADLINE_STEPS}
          className="inline-block whitespace-nowrap text-brand"
        />
      </h1>
      <h2 className="m-0 mt-2 text-xl font-semibold">
        Built by students for students.
      </h2>
    </div>
    <ButtonLink to="/modules" variant="primary" size="large">
      Start studying
      <ChevronRightIcon />
    </ButtonLink>
  </main>
);

export const Route = createFileRoute("/(public)/")({
  component: HomePage,
});
