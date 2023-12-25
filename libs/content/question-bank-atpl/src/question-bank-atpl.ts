import { NotFoundError } from "@chair-flight/base/errors";
import {
  API_PATH_LOS,
  API_PATH_QUESTIONS,
  API_PATH_SUBJECTS,
  READ_PATH_LOS,
  READ_PATH_QUESTIONS,
  READ_PATH_SUBJECTS,
} from "./contants";
import type {
  QuestionBankQuestionTemplate,
  QuestionBank,
  QuestionBankSubject,
  QuestionsMap,
  QuestionBankLearningObjective,
  LearningObjectivesMap,
  QuestionBankMedia,
} from "@chair-flight/base/types";

export class QuestionBankAtpl implements QuestionBank {
  private static questions: QuestionBankQuestionTemplate[];
  private static questionsMap: QuestionsMap;
  private static learningObjectives: QuestionBankLearningObjective[];
  private static learningObjectivesMap: LearningObjectivesMap;
  private static subjects: QuestionBankSubject[];
  private static media: QuestionBankMedia[];

  public async getAllSubjects() {
    if (!QuestionBankAtpl.subjects) {
      const response = await fetch(API_PATH_SUBJECTS);
      QuestionBankAtpl.subjects =
        (await response.json()) as QuestionBankSubject[];
    }
    return QuestionBankAtpl.subjects;
  }

  public async getAllQuestionTemplates() {
    if (!QuestionBankAtpl.questions) {
      const response = await fetch(API_PATH_QUESTIONS);
      QuestionBankAtpl.questions =
        (await response.json()) as QuestionBankQuestionTemplate[];
    }
    return QuestionBankAtpl.questions;
  }

  public async getAllQuestionTemplatesMap() {
    if (!QuestionBankAtpl.questionsMap) {
      const questions = await this.getAllQuestionTemplates();
      QuestionBankAtpl.questionsMap = questions.reduce<QuestionsMap>((s, q) => {
        s[q.id] = q;
        return s;
      }, {});
    }
    return QuestionBankAtpl.questionsMap;
  }

  public async getAllLearningObjectives() {
    if (!QuestionBankAtpl.learningObjectives) {
      const response = await fetch(API_PATH_LOS);
      QuestionBankAtpl.learningObjectives =
        (await response.json()) as QuestionBankLearningObjective[];
    }
    return QuestionBankAtpl.learningObjectives;
  }

  public async getAllLearningObjectivesMap() {
    if (!QuestionBankAtpl.learningObjectivesMap) {
      const learningObjectives = await this.getAllLearningObjectives();
      QuestionBankAtpl.learningObjectivesMap =
        learningObjectives.reduce<LearningObjectivesMap>(
          (s, lo) => {
            s[lo.id] = lo;
            return s;
          },
          {} as typeof QuestionBankAtpl.learningObjectivesMap,
        );
    }

    return QuestionBankAtpl.learningObjectivesMap;
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
    const questions = await this.getAllQuestionTemplatesMap();
    const question = questions[args.questionId];
    if (!question)
      throw new NotFoundError(`Question "${args.questionId}" not Found!`);
    return question;
  }

  public async getSomeQuestionTemplates(args: { questionIds: string[] }) {
    const map = await this.getAllQuestionTemplatesMap();
    return args.questionIds.map((id) => map[id]).filter(Boolean);
  }

  public async getLearningObjective(args: { learningObjectiveId: string }) {
    const map = await this.getAllLearningObjectivesMap();
    const learningObjective = map[args.learningObjectiveId];
    if (!learningObjective) {
      throw new NotFoundError(
        `learningObjective "${args.learningObjectiveId}" not Found!`,
      );
    }
    return learningObjective;
  }

  public async getSomeLearningObjectives(args: { questionId: string }) {
    const learningObjectives = await this.getAllLearningObjectivesMap();
    const question = await this.getQuestionTemplate(args);
    return question.learningObjectives
      .map((id) => learningObjectives[id])
      .filter(Boolean);
  }

  public async preloadQuestionBankForStaticRender({
    readFile,
  }: {
    readFile: (path: string, string: "utf-8") => Promise<string>;
  }) {
    await Promise.all([
      (async () => {
        const path = `${process.cwd()}${READ_PATH_SUBJECTS}`;
        const file = JSON.parse(await readFile(path, "utf-8"));
        QuestionBankAtpl.subjects = file as QuestionBankSubject[];
      })(),
      (async () => {
        const path = `${process.cwd()}${READ_PATH_QUESTIONS}`;
        const file = JSON.parse(await readFile(path, "utf-8"));
        QuestionBankAtpl.questions = file as QuestionBankQuestionTemplate[];
      })(),
      (async () => {
        const path = `${process.cwd()}${READ_PATH_LOS}`;
        const file = JSON.parse(await readFile(path, "utf-8"));
        QuestionBankAtpl.learningObjectives =
          file as QuestionBankLearningObjective[];
      })(),
    ]);
  }
}
