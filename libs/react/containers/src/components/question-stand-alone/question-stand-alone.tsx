import { Suspense, type FunctionComponent } from "react";
import { QuestionBank } from "@cf/providers/question-bank";
import { createTestQuestion } from "@cf/core/tests";
import { QuestionStandAloneQuestion } from "./question-stand-alone-question";
import { Divider, Stack, Tab, TabList, TabPanel, Tabs, TabsProps, Typography } from "@mui/joy";
import { QuestionBankName, getQuestionPreview } from "@cf/core/question-bank";
import { MdxRemote } from "../mdx-remote";
import { wait } from "@cf/base/utils";
import { ContainerWrapper, QuestionMultipleChoice } from "@cf/react/components";

export type QuestionStandAloneProps = {
  questionId: string;
  questionBank: QuestionBankName;
  seed: string;
  component?: TabsProps["component"];
  sx?: TabsProps["sx"];
};

const Question: FunctionComponent<Pick<QuestionStandAloneProps, "questionId" | "questionBank" | "seed">> = async ({
  questionId,
  questionBank,
  seed,
}) => {
  const bank = QuestionBank.get(questionBank);
  const template = await bank.getOne("questions", questionId);
  const rawAnnexes = await bank.getSome("annexes", template.annexes);
  const rawQuestion = createTestQuestion(template, { seed });
  const annexes = rawAnnexes.map((a) => ({ id: a.id, href: a.href }));

  return (
    <QuestionStandAloneQuestion
      seed={seed}
      correctOptionId={rawQuestion.correctOptionId}
      annexes={annexes}
      question={<MdxRemote source={rawQuestion.question} />}
      options={rawQuestion.options.map((o) => ({
        ...o,
        text: <MdxRemote source={o.text} />,
      }))}
    />
  );
}

const Preview: FunctionComponent<Pick<QuestionStandAloneProps, "questionId" | "questionBank">> = async ({
  questionId,
  questionBank,
}) => {
  const bank = QuestionBank.get(questionBank);
  const template = await bank.getOne("questions", questionId);
  const preview = getQuestionPreview(template.variant);
  return (<MdxRemote source={preview} />);
}

const Explanation: FunctionComponent<Pick<QuestionStandAloneProps, "questionId" | "questionBank">> = async ({
  questionId,
  questionBank,
}) => {
  const bank = QuestionBank.get(questionBank);
  const template = await bank.getOne("questions", questionId);
  const explanation = template.explanation;
  return (<MdxRemote source={explanation} />);
}

export const QuestionStandAlone: FunctionComponent<QuestionStandAloneProps> = async ({
  component = "div",
  sx,
  seed,
  questionId,
  questionBank,
}) => (
  <Tabs
    component={component}
    defaultValue="question"
    variant="outlined"
    sx={{ borderRadius: 8, ...sx }}
  >
    <TabList >
      <Typography
        level="body-lg"
        component={"h2"}
        sx={{ display: "flex", alignItems: "center", pl: { xs: 1, sm: 2 } }}
        children={questionId}
      />
      <Tab
        sx={{ ml: "auto" }}
        value="question"
        children={"Question"}
      />
      <Tab
        value="explanation"
        children={"Explanation"}
      />
      <Tab
        value="meta"
        children={"Meta"}
        sx={{ borderTopRightRadius: 8 }}
      />
    </TabList>

    <TabPanel value="question" sx={{ p: { xs: 1, sm: 2 } }}>
      <Suspense fallback={<QuestionMultipleChoice loading />}>
        <Question
          questionBank={questionBank}
          questionId={questionId}
          seed={seed}
        />
      </Suspense>
    </TabPanel>

    <TabPanel value="explanation" sx={{ p: 0 }}>
      <Suspense fallback={<QuestionMultipleChoice loading />}>
        <Stack sx={{ px: { xs: 1, sm: 2 }, pb: 1, backgroundColor: "background.level1" }}>
          <Preview
            questionBank={questionBank}
            questionId={questionId}
          />
        </Stack>
        <Divider sx={{ mb: 1 }} />
        <Stack sx={{ p: { xs: 1, sm: 2 } }}>
          <Explanation
            questionBank={questionBank}
            questionId={questionId}
          />
        </Stack>
      </Suspense>
    </TabPanel>

  </Tabs>
);