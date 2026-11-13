import { createFileRoute, Link } from "@tanstack/react-router";
import { Markdown } from "../../libs/ui/components/base/markdown";
import { QuestionList } from "../../libs/ui/components/question-bank/question-list";
import { ChevronLeftIcon } from "../../libs/ui/icons/chevron-left-icon";
import { fetchLearningObjective } from "../-server-functions/question-bank/fetch-learning-objective";
import { fetchLearningObjectives } from "../-server-functions/question-bank/fetch-learning-objectives";
import { fetchQuestions } from "../-server-functions/question-bank/fetch-questions";
import type { FC } from "react";

const LearningObjectivePage: FC = () => {
  const { questionBank } = Route.useParams();
  const { learningObjective, children, firstPage } = Route.useLoaderData();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4">
      <div>
        {learningObjective.parentId && (
          <Link
            to="/modules/$questionBank/learning-objectives/$learningObjectiveId"
            params={{
              questionBank,
              learningObjectiveId: learningObjective.parentId,
            }}
            className="flex items-center gap-1 text-sm text-muted no-underline"
          >
            <ChevronLeftIcon /> {learningObjective.parentId}
          </Link>
        )}
        <h1 className="m-0 mt-1 text-2xl font-bold">{learningObjective.id}</h1>
      </div>
      <Markdown>{learningObjective.text}</Markdown>
      {learningObjective.source && (
        <section>
          <h2 className="m-0 mb-2 text-base font-bold">Source</h2>
          <Markdown className="text-sm">{learningObjective.source}</Markdown>
        </section>
      )}
      {learningObjective.courses.length > 0 && (
        <p className="m-0 flex flex-wrap gap-1">
          {learningObjective.courses.map((course) => (
            <span
              key={course.id}
              className="rounded-md bg-accent-soft px-2 py-0.5 text-xs text-accent"
            >
              {course.text}
            </span>
          ))}
        </p>
      )}
      <Link
        to="/modules/$questionBank/docs/$docId"
        params={{ questionBank, docId: learningObjective.docId }}
        className="text-sm text-accent"
      >
        Read the docs for {learningObjective.docId}
      </Link>
      {children.items.length > 0 && (
        <section>
          <h2 className="m-0 mb-2 text-base font-bold">Learning Objectives</h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm">
            {children.items.map((child) => (
              <li key={child.id} className="flex gap-3">
                <Link
                  to="/modules/$questionBank/learning-objectives/$learningObjectiveId"
                  params={{ questionBank, learningObjectiveId: child.id }}
                  className="flex-none font-semibold text-accent"
                >
                  {child.id}
                </Link>
                <Markdown className="min-w-0 flex-1">{child.text}</Markdown>
                <span className="flex-none text-xs text-muted">
                  {child.numberOfQuestions}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section>
        <h2 className="m-0 mb-2 text-base font-bold">
          Questions ({learningObjective.numberOfQuestions})
        </h2>
        <QuestionList
          questionBank={questionBank}
          filters={{ learningObjective: learningObjective.id }}
          firstPage={firstPage}
        />
      </section>
    </div>
  );
};

export const Route = createFileRoute(
  "/(modules)/modules/$questionBank/learning-objectives/$learningObjectiveId",
)({
  loader: async ({ params }) => {
    const { questionBank, learningObjectiveId } = params;
    const [learningObjective, children, firstPage] = await Promise.all([
      fetchLearningObjective({ data: params }),
      fetchLearningObjectives({
        data: { questionBank, parentId: learningObjectiveId },
      }),
      fetchQuestions({
        data: { questionBank, learningObjective: learningObjectiveId },
      }),
    ]);
    return { learningObjective, children, firstPage };
  },
  component: LearningObjectivePage,
});
