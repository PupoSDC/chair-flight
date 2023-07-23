import { DataError } from "./generic-errors";
import type { QuestionTemplate } from "@chair-flight/base/types";

export class BadQuestionError extends DataError {
  question: QuestionTemplate;
  configurationParams: Record<string, unknown>;
  constructor(
    question: QuestionTemplate,
    configurationParams: Record<string, unknown>,
  ) {
    super(
      `Question ${
        question.id
      } is misconfigured with configuration params: ${JSON.stringify(
        configurationParams,
      )}`,
    );
    this.question = question;
    this.configurationParams = configurationParams;
  }
}
