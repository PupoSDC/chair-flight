import { QuestionBank } from "./providers/question-bank";
import { IQuestionBank, QuestionBankName } from "./types/question-bank-types";

export const questionBanks: Record<QuestionBankName, IQuestionBank> = {
    type: new QuestionBank("type"),
    atpl: new QuestionBank("atpl"),
    prep: new QuestionBank("prep"),
};

export * from "./providers/question-bank";
export * from "./questions/get-new-variant";
export * from "./questions/get-question-preview";
export * from "./schemas/question-template-schema";
export * from "./schemas/question-bank-enums-schema";
export * from "./types/question-bank-types";
export * from "./types/test-types";
export * from "./tests/create-test-question";
export * from "./tests/create-test";
export * from "./tests/process-test";

