import { QuestionBankName } from "@chair-flight/core/question-bank";
import { AppRouterOutput } from "@chair-flight/trpc/server";
import { container } from "../../wraper";
import { useQuestionEditor } from "../hooks/use-question-editor";

type Props = {
  questionId: string;
  questionBank: QuestionBankName;
};

type Params = Props;

type Data =
  AppRouterOutput["containers"]["questions"]["getQuestionEditorAnnexes"];

export const QuestionEditorAnnexes = container<Props, Params, Data>(
  ({ questionId, questionBank }) => {
    const { form } = useQuestionEditor({ questionBank });
    const los = form.watch(`editedQuestions.${questionId}.learningObjectives`);

    return (
      <FormProvider {...form}>
        <Stack direction="row" height="100%"></Stack>
      </FormProvider>
    );
  },
);

QuestionEditorAnnexes.displayName = "QuestionEditorAnnexes";
QuestionEditorAnnexes.getData = async () => ({});
QuestionEditorAnnexes.useData = () => ({});
