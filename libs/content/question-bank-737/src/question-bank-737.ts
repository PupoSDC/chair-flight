import { NotFoundError } from "@chair-flight/base/errors";
import {
  API_PATH_QUESTIONS,
  API_PATH_SUBJECT,
  READ_PATH_QUESTIONS,
  READ_PATH_SUBJECT,
} from "./constants";
import type {
  QuestionBankLearningObjective,
  QuestionBank,
  QuestionBankQuestionTemplate,
  QuestionsMap,
  QuestionBankSubject,
} from "@chair-flight/base/types";

export class QuestionBank737 implements QuestionBank {
  private static questions: QuestionBankQuestionTemplate[];
  private static questionsMap: QuestionsMap;
  private static subject: QuestionBankSubject;

  public async getAllSubjects() {
    if (!QuestionBank737.subject) {
      const response = await fetch(API_PATH_SUBJECT);
      QuestionBank737.subject = (await response.json()) as QuestionBankSubject;
    }
    return [QuestionBank737.subject];
  }

  public async getAllLearningObjectives() {
    return [];
  }

  public async getAllLearningObjectivesMap() {
    return {};
  }

  public async getAllQuestionTemplates() {
    if (!QuestionBank737.questions) {
      const response = await fetch(API_PATH_QUESTIONS);
      QuestionBank737.questions =
        (await response.json()) as QuestionBankQuestionTemplate[];
    }
    return QuestionBank737.questions;
  }

  public async getAllQuestionTemplatesMap() {
    if (!QuestionBank737.questionsMap) {
      const questions = await this.getAllQuestionTemplates();
      QuestionBank737.questionsMap = questions.reduce<QuestionsMap>((s, q) => {
        s[q.id] = q;
        return s;
      }, {});
    }
    return QuestionBank737.questionsMap;
  }

  public async getAllMedia() {
    return [];
  }

  public async getSubject(args: { subjectId: string }) {
    const subjects = await this.getAllSubjects();
    const subject = subjects.find((s) => s.id === args.subjectId);
    if (!subject)
      throw new NotFoundError(`Subject "${args.subjectId}" not Found!`);
    return subject;
  }

  public async getQuestionTemplate(args: { questionId: string }) {
    const map = await this.getAllQuestionTemplatesMap();
    const question = map[args.questionId];
    if (!question) {
      throw new NotFoundError(`Question "${args.questionId}" not Found!`);
    }
    return question;
  }

  public async getSomeQuestionTemplates(args: { questionIds: string[] }) {
    const map = await this.getAllQuestionTemplatesMap();
    return args.questionIds
      .map((id) => map[id])
      .filter(Boolean) as QuestionBankQuestionTemplate[];
  }

  public async getLearningObjective(): Promise<QuestionBankLearningObjective> {
    throw new NotFoundError(`QuestionBank has no LearningObjectives`);
  }

  public async getSomeLearningObjectives() {
    return [];
  }

  public async preloadQuestionBankForStaticRender({
    readFile,
  }: {
    readFile: (path: string, string: "utf-8") => Promise<string>;
  }) {
    await Promise.all([
      (async () => {
        const path = `${process.cwd()}${READ_PATH_SUBJECT}`;
        const file = JSON.parse(await readFile(path, "utf-8"));
        QuestionBank737.subject = file as QuestionBankSubject;
      })(),
      (async () => {
        const path = `${process.cwd()}${READ_PATH_QUESTIONS}`;
        const file = JSON.parse(await readFile(path, "utf-8"));
        QuestionBank737.questions = file as QuestionBankQuestionTemplate[];
      })(),
    ]);
  }
}
