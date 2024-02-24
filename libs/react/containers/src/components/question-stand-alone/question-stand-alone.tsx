import type { FunctionComponent } from "react";
import { QuestionBank } from "@cf/providers/question-bank";
import { createTestQuestion } from "@cf/core/tests";
import { QuestionStandAloneClient, QuestionStandAloneClientProps } from "./question-stand-alone-client";

export type QuestionStandAloneProps = Omit<
  QuestionStandAloneClientProps, 
  "question" | "correctOptionId" | "options" | "annexes"
>;

export const QuestionStandAlone: FunctionComponent<QuestionStandAloneProps> = async (props) => {
  const id = props.questionId;
  const bankName = props.questionBank;
  const bank = QuestionBank.get(bankName);
  const template = await bank.getOne("questions", id);
  const rawAnnexes = await bank.getSome("annexes", template.annexes);
  const rawQuestion = createTestQuestion(template, { seed: props.seed });
  const annexes = rawAnnexes.map((a) => ({ id: a.id, href: a.href }));
  const MDXRemote = await import("@daviereid/next-mdx-remote/rsc")
    .then(m => m.MDXRemote);

  return (
    <QuestionStandAloneClient
      {...props}
      annexes={annexes}
      question={<MDXRemote source={rawQuestion.question} />}
      correctOptionId={rawQuestion.correctOptionId}
      options={rawQuestion.options.map((o) => ({
        ...o,
        text: <MDXRemote source={o.text} />,
      }))}
    />
  );
}
