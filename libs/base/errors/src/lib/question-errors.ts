import { DataError } from "./generic-errors";

export class BadQuestionError extends DataError {
  question: { id: string };
  configurationParams: Record<string, unknown>;
  constructor(
    question: { id: string },
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
