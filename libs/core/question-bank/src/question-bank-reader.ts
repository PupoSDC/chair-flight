import { getUrlPathOnServer } from "@chair-flight/base/env";
import { NotFoundError } from "@chair-flight/base/errors";
import type {
  QuestionBankQuestionTemplate,
  QuestionBank,
  QuestionBankSubject,
  QuestionBankMedia,
  QuestionsMap,
  QuestionBankLearningObjective,
  LearningObjectivesMap,
  QuestionBankName,
  QuestionBankFlashcardContent,
  QuestionBankFlashcardCollection,
} from "@chair-flight/base/types";

export class QuestionBankReader implements QuestionBank {
  private questions: QuestionBankQuestionTemplate[] | undefined;
  private questionsMap: QuestionsMap | undefined;
  private learningObjectives: QuestionBankLearningObjective[] | undefined;
  private learningObjectivesMap: LearningObjectivesMap | undefined;
  private subjects: QuestionBankSubject[] | undefined;
  private media: QuestionBankMedia[] | undefined;
  private flashcards: QuestionBankFlashcardCollection[] | undefined;

  private apiPathSubjects: string;
  private apiPathQuestions: string;
  private apiPathLos: string;
  private apiPathMedia: string;
  private apiPathFlashcards: string;

  private readPathSubjects: string;
  private readPathQuestions: string;
  private readPathLos: string;
  private readPathMedia: string;
  private readPathFlashcards: string;

  constructor({ questionBankName }: { questionBankName: QuestionBankName }) {
    const urlPath = getUrlPathOnServer();
    const readPath = "/apps/next-app/public";
    const bankPath = `/content/content-question-bank-${questionBankName}`;
    const baseApiPath = `${urlPath}${bankPath}`;
    const baseReadPath = `${readPath}${bankPath}`;

    this.questions = [];
    this.questionsMap = {};
    this.learningObjectives = [];
    this.learningObjectivesMap = {};
    this.subjects = [];
    this.media = [];

    this.apiPathSubjects = `${baseApiPath}/subjects.json`;
    this.apiPathQuestions = `${baseApiPath}/questions.json`;
    this.apiPathLos = `${baseApiPath}/learning-objectives.json`;
    this.apiPathMedia = `${baseApiPath}/media.json`;
    this.apiPathFlashcards = `${baseApiPath}/flashcards.json`;

    this.readPathSubjects = `${baseReadPath}/subjects.json`;
    this.readPathQuestions = `${baseReadPath}/questions.json`;
    this.readPathLos = `${baseReadPath}/learning-objectives.json`;
    this.readPathMedia = `${baseReadPath}/media.json`;
    this.readPathFlashcards = `${baseReadPath}/flashcards.json`;
  }

  public async getAllSubjects() {
    if (!this.subjects) {
      const response = await fetch(this.apiPathSubjects);
      const json = await response.json();
      this.subjects = json as QuestionBankSubject[];
    }
    return this.subjects;
  }

  public async getAllQuestionTemplates() {
    if (!this.questions) {
      const response = await fetch(this.apiPathQuestions);
      const json = await response.json();
      this.questions = json as QuestionBankQuestionTemplate[];
    }
    return this.questions;
  }

  public async getAllQuestionTemplatesMap() {
    if (!this.questionsMap) {
      const questions = await this.getAllQuestionTemplates();
      this.questionsMap = questions.reduce<QuestionsMap>((s, q) => {
        s[q.id] = q;
        return s;
      }, {});
    }
    return this.questionsMap;
  }

  public async getAllLearningObjectives() {
    if (!this.learningObjectives) {
      const response = await fetch(this.apiPathLos);
      const json = await response.json();
      this.learningObjectives = json as QuestionBankLearningObjective[];
    }
    return this.learningObjectives;
  }

  public async getAllLearningObjectivesMap() {
    if (!this.learningObjectivesMap) {
      const learningObjectives = await this.getAllLearningObjectives();
      this.learningObjectivesMap =
        learningObjectives.reduce<LearningObjectivesMap>((s, lo) => {
          s[lo.id] = lo;
          return s;
        }, {});
    }

    return this.learningObjectivesMap;
  }

  public async getAllMedia() {
    if (!this.media) {
      const response = await fetch(this.apiPathMedia);
      const json = await response.json();
      this.media = json as QuestionBankMedia[];
    }
    return this.media;
  }

  public async getAllFlashcardCollections() {
    if (!this.flashcards) {
      const response = await fetch(this.apiPathFlashcards);
      const json = await response.json();
      this.flashcards = json as QuestionBankFlashcardCollection[];
    }
    return this.flashcards;
  }

  public async getSubject(args: { subjectId: string }) {
    const subjects = await this.getAllSubjects();
    const subject = subjects.find((s) => s.id === args.subjectId);
    if (!subject)
      throw new NotFoundError(`Subject "${args.subjectId}" not Found!`);
    return subject;
  }

  public async getFlashCardCollection(args: { collectionId: string }) {
    const flashcards = await this.getAllFlashcardCollections();
    const flashcard = flashcards.find((s) => s.id === args.collectionId);
    if (!flashcard) {
      throw new NotFoundError(
        `Flashcard Collection "${args.collectionId}" not Found!`,
      );
    }
    return flashcard;
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
        const path = `${process.cwd()}${this.readPathSubjects}`;
        const file = JSON.parse(await readFile(path, "utf-8"));
        this.subjects = file as QuestionBankSubject[];
      })(),
      (async () => {
        const path = `${process.cwd()}${this.readPathQuestions}`;
        const file = JSON.parse(await readFile(path, "utf-8"));
        this.questions = file as QuestionBankQuestionTemplate[];
      })(),
      (async () => {
        const path = `${process.cwd()}${this.readPathLos}`;
        const file = JSON.parse(await readFile(path, "utf-8"));
        this.learningObjectives = file as QuestionBankLearningObjective[];
      })(),
      (async () => {
        const path = `${process.cwd()}${this.readPathMedia}`;
        const file = JSON.parse(await readFile(path, "utf-8"));
        this.media = file as QuestionBankMedia[];
      })(),
    ]);
  }
}
