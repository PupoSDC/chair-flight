import { type QuestionBankName } from "@chair-flight/core/question-bank";
import { SearchList } from "@chair-flight/react/components";
import { type AppRouterOutput } from "@chair-flight/trpc/client";
import { container } from "../../wraper/container";
import { useQuestionEditor } from "../hooks/use-question-editor";
import { QuestionEditorDiffListItem } from "./question-editor-diff-list-item";

type Props = {
  questionBank: QuestionBankName;
};

type Params = Props;

type Data = AppRouterOutput["containers"]["questions"]["getQuestionEditorDiff"];

export const QuestionEditorDiff = container<Props, Params, Data>(
  ({ sx, component = "div", questionBank }) => {
    const items = useQuestionEditor((s) =>
      s.getQuestionsWithADiff({
        questionBank,
      }),
    );

    return (
      <SearchList
        component={component}
        sx={sx}
        forceMode="mobile"
        items={items.map((id) => ({ id, questionBank, questionId: id }))}
        noDataMessage={"No changes so far!"}
        renderThead={() => null}
        renderTableRow={() => null}
        renderListItemContent={QuestionEditorDiffListItem}
      />
    );
  },
);

QuestionEditorDiff.displayName = "QuestionEditorDiff";

QuestionEditorDiff.getData = async () => ({});

QuestionEditorDiff.useData = () => ({});
