import { createTestQuestion } from "@cf/core/tests";
import { MdxRemote } from "@cf/next/ui";
import { QuestionBank } from "@cf/providers/question-bank";
import { QuestionStandAloneClient } from "./question-stand-alone-client";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { StackProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export type QuestionStandAloneProps = {
  questionBank: QuestionBankName;
  questionId: string;
  seed: string;
  component?: StackProps["component"];
  sx?: StackProps["sx"];
};

export const QuestionStandAlone: FunctionComponent<
  QuestionStandAloneProps
> = async ({ questionBank, questionId, seed, component = "div", sx }) => {
  const bank = new QuestionBank(questionBank);
  const template = await bank.getOne("questions", questionId);
  const rawAnnexes = await bank.getSome("annexes", template.annexes);
  const question = createTestQuestion(template, { seed });
  const annexes = rawAnnexes.map((a) => ({ id: a.id, href: a.href }));

  return (
    <QuestionStandAloneClient
      sx={sx}
      component={component}
      question={<MdxRemote source={question.question} />}
      correctOptionId={question.correctOptionId}
      annexes={annexes.map((a) => a.href)}
      seed={seed}
      options={question.options.map((opt) => ({
        id: opt.id,
        text: <MdxRemote source={opt.text} />,
      }))}
    />
  );
};
