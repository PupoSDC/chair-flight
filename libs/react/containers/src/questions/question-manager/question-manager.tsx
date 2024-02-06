import { FormProvider } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { NoSsr } from "@mui/base";
import { Stack } from "@mui/joy";
import { container, getRequiredParam } from "../../wraper/container";
import { VerticalDivider } from "../components/vertical-divider";
import { useQuestionEditor } from "../hooks/use-question-editor";
import { QuestionManagerChangesList } from "./components/question-manager-changes-list";
import { QuestionManagerQuestionSearch } from "./components/question-manager-question-search";
import { useQuestionEditorData } from "./hooks/use-question-editor-data";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { SearchListProps } from "@chair-flight/react/components";
import type { AppRouterOutput } from "@chair-flight/trpc/client";

type Props = {
  questionBank: QuestionBankName;
  forceMode?: SearchListProps<{ id: string }>["forceMode"];
};

type Params = {
  questionBank: QuestionBankName;
};

type Data = AppRouterOutput["containers"]["questions"]["getQuestionManager"];

export const QuestionManager = container<Props, Params, Data>(
  ({ sx, component = "section", questionBank }) => {
    const questionEditor = useQuestionEditor({ questionBank });

    return (
      <Stack direction="row" component={component} sx={sx}>
        <FormProvider {...questionEditor.form}>
          <QuestionManagerQuestionSearch questionBank={questionBank} />
          <VerticalDivider />
          <QuestionManagerChangesList />
          <NoSsr>
            <DevTool control={questionEditor.form.control} />
          </NoSsr>
        </FormProvider>
      </Stack>
    );
  },
);

QuestionManager.displayName = "QuestionManager";

QuestionManager.getData = async ({ helper, params }) => {
  const router = helper.containers.questions;
  const questionBank = getRequiredParam(params, "questionBank");
  return await router.getQuestionManager.fetch({ questionBank });
};

QuestionManager.useData = useQuestionEditorData;
