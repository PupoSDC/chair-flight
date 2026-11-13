import { createFileRoute, Link } from "@tanstack/react-router";
import { Markdown } from "../../libs/ui/components/base/markdown";
import { QuestionList } from "../../libs/ui/components/question-bank/question-list";
import { ChevronLeftIcon } from "../../libs/ui/icons/chevron-left-icon";
import { cn } from "../../libs/ui/utils/cn";
import { fetchDoc } from "../-server-functions/question-bank/fetch-doc";
import { fetchQuestions } from "../-server-functions/question-bank/fetch-questions";
import type { FC } from "react";

const DocPage: FC = () => {
  const { questionBank } = Route.useParams();
  const { doc, firstPage } = Route.useLoaderData();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4">
      <div>
        {doc.parent && (
          <Link
            to="/modules/$questionBank/docs/$docId"
            params={{ questionBank, docId: doc.parent.id }}
            className="flex items-center gap-1 text-sm text-muted no-underline"
          >
            <ChevronLeftIcon /> {doc.parent.title}
          </Link>
        )}
        <h1 className="m-0 mt-1 text-2xl font-bold">{doc.title}</h1>
      </div>
      {doc.empty ? (
        <p className="m-0 text-sm text-muted">
          This page has not been written yet.
        </p>
      ) : (
        <Markdown>{doc.content}</Markdown>
      )}
      {doc.children.length > 0 && (
        <section>
          <h2 className="m-0 mb-2 text-base font-bold">Chapters</h2>
          <ul className="m-0 flex list-none flex-col gap-1 p-0 text-sm">
            {doc.children.map((child) => (
              <li key={child.id}>
                <Link
                  to="/modules/$questionBank/docs/$docId"
                  params={{ questionBank, docId: child.id }}
                  className={cn("text-accent", child.empty && "opacity-60")}
                >
                  {child.id} {child.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      {doc.learningObjectives.length > 0 && (
        <section>
          <h2 className="m-0 mb-2 text-base font-bold">Learning Objectives</h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm">
            {doc.learningObjectives.map((learningObjective) => (
              <li key={learningObjective.id} className="flex gap-3">
                <Link
                  to="/modules/$questionBank/learning-objectives/$learningObjectiveId"
                  params={{
                    questionBank,
                    learningObjectiveId: learningObjective.id,
                  }}
                  className="flex-none font-semibold text-accent"
                >
                  {learningObjective.id}
                </Link>
                <Markdown>{learningObjective.text}</Markdown>
              </li>
            ))}
          </ul>
        </section>
      )}
      {doc.numberOfQuestions > 0 && (
        <section>
          <h2 className="m-0 mb-2 text-base font-bold">
            Questions ({doc.numberOfQuestions})
          </h2>
          <QuestionList
            questionBank={questionBank}
            filters={{ docId: doc.id }}
            firstPage={firstPage}
          />
        </section>
      )}
    </div>
  );
};

export const Route = createFileRoute(
  "/(modules)/modules/$questionBank/docs/$docId",
)({
  loader: async ({ params }) => {
    const [doc, firstPage] = await Promise.all([
      fetchDoc({ data: params }),
      fetchQuestions({ data: params }),
    ]);
    return { doc, firstPage };
  },
  component: DocPage,
});
