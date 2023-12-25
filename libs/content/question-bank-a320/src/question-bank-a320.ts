import { NotFoundError } from "@chair-flight/base/errors";
import {
  API_PATH_QUESTIONS,
  API_PATH_SUBJECT,
  READ_PATH_QUESTIONS,
  READ_PATH_SUBJECT,
} from "./constants";
import type {
  QuestionBank,
  QuestionBankLearningObjective,
  QuestionBankQuestionTemplate,
  QuestionsMap,
  QuestionBankSubject,
} from "@chair-flight/base/types";

export class QuestionBankA320 implements QuestionBank {
  private static questions: QuestionBankQuestionTemplate[];
  private static questionsMap: QuestionsMap;
  private static subject: QuestionBankSubject;

  public async getAllSubjects() {
    if (!QuestionBankA320.subject) {
      const response = await fetch(API_PATH_SUBJECT);
      QuestionBankA320.subject = (await response.json()) as QuestionBankSubject;
    }
    return [QuestionBankA320.subject];
  }

  public async getAllLearningObjectives() {
    return [];
  }

  public async getAllLearningObjectivesMap() {
    return {};
  }

  public async getAllQuestionTemplates() {
    if (!QuestionBankA320.questions) {
      const response = await fetch(API_PATH_QUESTIONS);
      QuestionBankA320.questions =
        (await response.json()) as QuestionBankQuestionTemplate[];
    }
    return QuestionBankA320.questions;
  }

  public async getAllQuestionTemplatesMap() {
    if (!QuestionBankA320.questionsMap) {
      const questions = await this.getAllQuestionTemplates();
      QuestionBankA320.questionsMap = questions.reduce<QuestionsMap>((s, q) => {
        s[q.id] = q;
        return s;
      }, {});
    }
    return QuestionBankA320.questionsMap;
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
    await this.getAllQuestionTemplatesMap(); // Ensure question templates are loaded
    const question = QuestionBankA320.questionsMap[args.questionId];
    if (!question)
      throw new NotFoundError(`Question "${args.questionId}" not Found!`);
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
        QuestionBankA320.subject = file as QuestionBankSubject;
      })(),
      (async () => {
        const path = `${process.cwd()}${READ_PATH_QUESTIONS}`;
        const file = JSON.parse(await readFile(path, "utf-8"));
        QuestionBankA320.questions = file as QuestionBankQuestionTemplate[];
      })(),
    ]);
  }
}
