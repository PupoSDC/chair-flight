import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper";
import type {
  QuestionBankName,
  QuestionBankQuestionTemplate,
  QuestionId,
} from "@chair-flight/base/types";

type Props = {
  questionBank: QuestionBankName;
  questionIds: QuestionId[];
};

type Params = {
  questionBank: QuestionBankName;
  questionIds: QuestionId[];
};

type Data = {
  questions: QuestionBankQuestionTemplate[];
};

export const QuestionList = container<Props, Params, Data>(
  ({ questionBank, questionIds }) => {
    const params = { questionBank, questionIds };
    const { questions } = QuestionList.useData(params);
    console.log(questions);
    return null;
  },
);

QuestionList.getData = async ({ helper, params }) => {
  const questionBank = getRequiredParam(params, "questionBank");
  const questionIds = getRequiredParam(params, "questionIds");

  return await helper.questionBank.getQuestions.fetch({
    questionBank,
    questionIds,
  });
};

QuestionList.useData = (params) => {
  const questionBank = getRequiredParam(params, "questionBank");
  const questionIds = getRequiredParam(params, "questionIds");

  return trpc.questionBank.getQuestions.useSuspenseQuery({
    questionBank,
    questionIds,
  })[0];
};
