import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { getRandomId } from "../../libs/base/get-random-id";
import { createTestQuestion } from "../../libs/core/tests/create-test-question";
import { Button } from "../../libs/ui/components/base/button";
import { Markdown } from "../../libs/ui/components/base/markdown";
import { AnnexModal } from "../../libs/ui/components/question-bank/annex-modal";
import { QuestionMultipleChoice } from "../../libs/ui/components/tests/question-multiple-choice";
import { ShuffleIcon } from "../../libs/ui/icons/shuffle-icon";
import { fetchQuestion } from "../-server-functions/question-bank/fetch-question";
import type { FC } from "react";

const QuestionPractice: FC = () => {
  const { questionBank } = Route.useParams();
  const template = Route.useLoaderData();
  const [seed, setSeed] = useState(template.id);
  const [selectedOptionId, setSelectedOptionId] = useState<string>();
  const [annexHref, setAnnexHref] = useState<string>();
  const question = useMemo(() => {
    if (template.variant.type === "multiple-correct") return null;
    return createTestQuestion(
      {
        id: template.id,
        explanation: template.explanation,
        variant: template.variant,
        annexes: template.annexes.map((annex) => annex.href),
      },
      seed,
    );
  }, [template, seed]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4">
      {question ? (
        <QuestionMultipleChoice
          question={question.question}
          options={question.options}
          annexes={question.annexes}
          selectedOptionId={selectedOptionId}
          correctOptionId={question.correctOptionId}
          showResult={Boolean(selectedOptionId)}
          disabled={Boolean(selectedOptionId)}
          onOptionClick={setSelectedOptionId}
          onAnnexClick={setAnnexHref}
        />
      ) : (
        <Markdown>{template.preview}</Markdown>
      )}
      <Button
        className="self-start"
        onClick={() => {
          setSeed(getRandomId());
          setSelectedOptionId(undefined);
        }}
      >
        <ShuffleIcon /> Shuffle
      </Button>
      {template.explanation && (
        <section>
          <h2 className="m-0 mb-2 text-base font-bold">Explanation</h2>
          <Markdown>{template.explanation}</Markdown>
        </section>
      )}
      {template.learningObjectives.length > 0 && (
        <section>
          <h2 className="m-0 mb-2 text-base font-bold">Learning Objectives</h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm">
            {template.learningObjectives.map((learningObjective) => (
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
      {template.relatedQuestions.length > 0 && (
        <section>
          <h2 className="m-0 mb-2 text-base font-bold">Related Questions</h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm">
            {template.relatedQuestions.map((related) => (
              <li key={related.id} className="flex gap-3">
                <Link
                  to="/modules/$questionBank/questions/$questionId"
                  params={{ questionBank, questionId: related.id }}
                  className="flex-none font-semibold text-accent"
                >
                  {related.id}
                </Link>
                <Markdown>{related.preview}</Markdown>
              </li>
            ))}
          </ul>
        </section>
      )}
      {template.externalIds.length > 0 && (
        <section>
          <h2 className="m-0 mb-2 text-base font-bold">External References</h2>
          <p className="m-0 text-sm text-muted">
            {template.externalIds.join(", ")}
          </p>
        </section>
      )}
      {annexHref && (
        <AnnexModal href={annexHref} onClose={() => setAnnexHref(undefined)} />
      )}
    </div>
  );
};

const QuestionPage: FC = () => {
  const { questionId } = Route.useParams();

  return <QuestionPractice key={questionId} />;
};

export const Route = createFileRoute(
  "/(modules)/modules/$questionBank/questions/$questionId",
)({
  loader: ({ params }) => fetchQuestion({ data: params }),
  component: QuestionPage,
});
