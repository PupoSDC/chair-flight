import {  Stack, StackProps } from "@mui/joy";
import { MdxRemote } from "../mdx-remote";
import { QuestionBank } from "@cf/providers/question-bank";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { QuestionId } from "@cf/core/tests";
import type { FunctionComponent } from "react";
import { Ups } from "@cf/react/components";

export type QuestionExplanationProps = {
  questionBank: QuestionBankName;
  questionId: QuestionId;
  sx?: StackProps["sx"];
  component?: StackProps["component"];
}

export const QuestionExplanation: FunctionComponent<
  QuestionExplanationProps
> = async ({ questionBank, questionId, sx, component = "div" }) => {
  const bank = QuestionBank.get(questionBank);
  const template = await bank.getOne("questions", questionId);
  const explanation = template.explanation;

  return (
    <Stack sx={sx} component={component}>
      {template.explanation ? (
        <MdxRemote source={explanation} />
      ) : (
        <Ups message="No explanation to this Question is available" />
      )}
    </Stack>
  );
};
