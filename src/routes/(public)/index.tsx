import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PublicHeader } from "../../libs/ui/components/base/public-header";
import { CountUp } from "../../libs/ui/components/public/count-up";
import { ModuleSelectionButton } from "../../libs/ui/components/public/module-selection-button";
import { SlidingImages } from "../../libs/ui/components/public/sliding-images";
import { Typical } from "../../libs/ui/components/public/typical";
import { useQuestionBankTheme } from "../../libs/ui/hooks/use-question-bank-theme";
import { CardsIcon } from "../../libs/ui/icons/cards-icon";
import { ChevronRightIcon } from "../../libs/ui/icons/chevron-right-icon";
import { PlaneIcon } from "../../libs/ui/icons/plane-icon";
import { PlaneTakeoffIcon } from "../../libs/ui/icons/plane-takeoff-icon";
import { cn } from "../../libs/ui/utils/cn";
import { fetchModuleCounts } from "../-server-functions/question-bank/fetch-module-counts";
import type { FC, ReactNode } from "react";
import type { QuestionBankName } from "../../libs/core/question-bank/question-banks";

const HEADLINE_STEPS = [
  "Community Built",
  2000,
  "Minimalistic",
  2000,
  "Free",
  2000,
];

const BUTTON_CLASS_NAME = cn(
  "flex h-11 items-center justify-center rounded-md bg-brand px-4",
  "font-semibold text-white no-underline hover:opacity-90",
);

const HeroTitle: FC<{ children: ReactNode }> = ({ children }) => (
  <h2 className="m-0 text-3xl leading-tight font-bold tracking-tighter md:text-6xl">
    {children}
  </h2>
);

const HeroLink: FC<{ to: string; children: string }> = ({ to, children }) => (
  <Link to={to} className={BUTTON_CLASS_NAME}>
    {children}
  </Link>
);

const HomePage: FC = () => {
  const counts = Route.useLoaderData();
  const [questionBank, setQuestionBank] = useState<QuestionBankName>();
  useQuestionBankTheme(questionBank);

  return (
    <div
      data-bank={questionBank}
      className="flex min-h-dvh flex-col bg-canvas text-ink"
    >
      <PublicHeader />
      <SlidingImages />
      <main
        className={cn(
          "mx-auto flex w-full max-w-310 flex-1 flex-col gap-8 p-4 md:flex-row",
          "md:p-8",
        )}
      >
        <section
          className={cn(
            "flex flex-none flex-col justify-center gap-4 md:w-115 lg:w-155",
          )}
        >
          <div className="text-center md:text-left">
            <h1 className="m-0 text-3xl leading-tight font-bold tracking-tighter md:text-6xl">
              Chair Flight is <br />
              <Typical steps={HEADLINE_STEPS} className="text-brand" />
            </h1>
            <h2 className="m-0 mt-2 text-xl font-semibold">
              Built by students for students.
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            <ModuleSelectionButton
              color="blue"
              questionBank="atpl"
              title="ATPL theory"
              description="Explore questions, learning objectives, and theory reviews from the EASA QB ATPL exams."
              icon={<PlaneIcon size={32} />}
              active={questionBank === "atpl"}
              onSelect={() => setQuestionBank("atpl")}
            />
            <ModuleSelectionButton
              color="teal"
              questionBank="prep"
              title="Interview Prep"
              description="Use our flash cards to practice answering open ended questions and secure your first job."
              icon={<CardsIcon size={32} />}
              active={questionBank === "prep"}
              onSelect={() => setQuestionBank("prep")}
            />
            <ModuleSelectionButton
              color="rose"
              questionBank="type"
              title="Type Rating"
              description={`Prepare or review your theory knowledge for a type rating on the Boeing 737 or the Airbus A320 with ${counts.type} questions.`}
              icon={<PlaneTakeoffIcon size={32} />}
              active={questionBank === "type"}
              onSelect={() => setQuestionBank("type")}
            />
          </div>
          <Link
            to="/blog/$postId"
            params={{ postId: "000-about-us" }}
            className="inline-flex items-center justify-center gap-1 text-accent"
          >
            About This Project
            <ChevronRightIcon />
          </Link>
        </section>
        {questionBank && (
          <section
            key={questionBank}
            className="flex flex-1 flex-col justify-center gap-4"
          >
            {questionBank === "atpl" && (
              <>
                <HeroTitle>
                  Explore{" "}
                  <CountUp
                    end={counts.atpl}
                    duration={2000}
                    className="inline-block w-[3.2em] text-right text-brand"
                  />{" "}
                  questions
                  <br />
                  In infinite combinations
                </HeroTitle>
                <p className="m-0 text-xl font-medium tracking-tight">
                  Chair Flight&apos;s questions are organised into variants,
                  enabling you to practise challenging questions repeatedly and
                  promptly skip variants of questions you already comprehend.
                </p>
                <div className="grid gap-2 lg:grid-cols-2">
                  <HeroLink to="/modules/atpl/learning-objectives">
                    Explore Learning Objectives
                  </HeroLink>
                  <HeroLink to="/modules/atpl/questions">
                    Explore Questions
                  </HeroLink>
                  <HeroLink to="/modules/atpl/tests/create">
                    Create a Test
                  </HeroLink>
                  <HeroLink to="/modules/atpl/docs">Read the Docs</HeroLink>
                </div>
              </>
            )}
            {questionBank === "prep" && (
              <>
                <HeroTitle>
                  Prepare your next interview with{" "}
                  <CountUp
                    end={counts.prep}
                    duration={2000}
                    className="inline-block w-[1.8em] text-right text-brand"
                  />{" "}
                  flashcards
                </HeroTitle>
                <p className="m-0 text-xl font-medium tracking-tight">
                  When you get to your first job interview, you won&apos;t have
                  the benefit of being able to select the best out of 4 answers.
                  You will have to explain the topics you have learned in the
                  theory classes without any crutches. <br />
                  Use our flash cards to practise answering open ended questions
                  and secure your first job.
                </p>
                <HeroLink to="/modules/prep/flashcards">
                  Explore Flash Cards
                </HeroLink>
              </>
            )}
            {questionBank === "type" && (
              <>
                <HeroTitle>Prepare your next Type Rating exam</HeroTitle>
                <p className="m-0 text-xl font-medium tracking-tight">
                  Review the most commonly asked tech knowledge questions for
                  the 2 most popular aircraft in the world: the Airbus A320 and
                  Boeing 737
                </p>
                <div className="grid gap-2">
                  <HeroLink to="/modules/type/questions">
                    Explore Type Rating Questions
                  </HeroLink>
                  <HeroLink to="/modules/type/tests/create">
                    Create Type Rating Test
                  </HeroLink>
                </div>
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export const Route = createFileRoute("/(public)/")({
  loader: () => fetchModuleCounts(),
  component: HomePage,
});
