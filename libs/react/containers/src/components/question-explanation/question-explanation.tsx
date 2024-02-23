import { MDXRemote } from "@daviereid/next-mdx-remote/rsc";
import { Stack } from "@mui/joy";
import { markdownPlugins } from "@cf/core/markdown";
import { QuestionBank } from "@cf/providers/question-bank";
import { markdownComponents } from "@cf/react/markdown";
import type { QuestionBankName } from "@cf/core/question-bank";
import type { QuestionId } from "@cf/core/tests";
import type { FunctionComponent } from "react";

export type QuestionExplanationProps = {
  questionBank: QuestionBankName;
  questionId: QuestionId;
};

export const QuestionExplanation: FunctionComponent<
  QuestionExplanationProps
> = async ({ questionBank, questionId }) => {
  const bank = QuestionBank.get(questionBank);
  const template = await bank.getOne("questions", questionId);
  const explanation = template.explanation;
  return (
    <Stack component="main" sx={{ maxWidth: "md", mx: "auto " }}>
      <MDXRemote
        source={explanation}
        components={markdownComponents}
        {...markdownPlugins}
      />
      <h1>Potato</h1>
    </Stack>
  );
};
