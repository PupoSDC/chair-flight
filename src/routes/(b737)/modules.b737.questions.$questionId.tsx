import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { getRandomId } from "../../libs/base/get-random-id";
import { QuestionPreview } from "../../libs/ui/components/question-bank/question-preview";
import { getB737QuestionDemo } from "../-server-functions/question-banks/get-b737-question-demo";
import type { FC } from "react";
import type { Breadcrumb } from "../../libs/ui/components/base/breadcrumbs";

const QuestionPage: FC = () => {
  const demo = Route.useLoaderData();
  const navigate = useNavigate();
  const index = demo.chapterQuestionIds.indexOf(demo.id);
  const previousId = demo.chapterQuestionIds[index - 1];
  const nextId = demo.chapterQuestionIds[index + 1];
  const goTo = (questionId: string) =>
    navigate({
      to: "/modules/b737/questions/$questionId",
      params: { questionId },
    });

  return (
    <QuestionPreview
      key={demo.id}
      questionBank="b737"
      question={demo}
      relatedQuestions={demo.relatedQuestions}
      backLink={{
        to: "/modules/b737/questions/chapters/$chapterId",
        params: { chapterId: demo.chapter.id },
      }}
      position={
        index >= 0
          ? { index, total: demo.chapterQuestionIds.length }
          : undefined
      }
      onPrevious={previousId ? () => goTo(previousId) : undefined}
      onNext={nextId ? () => goTo(nextId) : undefined}
      onRefresh={() =>
        navigate({
          to: ".",
          search: { seed: getRandomId() },
          replace: true,
        })
      }
      relatedQuestionLink={(questionId) => ({
        to: "/modules/b737/questions/$questionId",
        params: { questionId },
      })}
    />
  );
};

export const Route = createFileRoute(
  "/(b737)/modules/b737/questions/$questionId",
)({
  staticData: {
    breadcrumbs: ({ params, loaderData }): Breadcrumb[] => {
      const chapterId = loaderData.chapter.id;
      return [
        { label: "Questions", link: { to: "/modules/b737/questions" } },
        {
          label: `Chapter ${Number(chapterId)}`,
          link: {
            to: "/modules/b737/questions/chapters/$chapterId",
            params: { chapterId },
          },
        },
        { label: decodeURIComponent(params.questionId) },
      ];
    },
  },
  validateSearch: z.object({
    seed: z
      .union([z.string(), z.number()])
      .optional()
      .transform((seed) => (seed === undefined ? undefined : String(seed))),
  }),
  loaderDeps: ({ search }) => ({ seed: search.seed ?? "0" }),
  loader: ({ params, deps }) =>
    getB737QuestionDemo({
      data: { questionId: params.questionId, seed: deps.seed },
    }),
  component: QuestionPage,
});
