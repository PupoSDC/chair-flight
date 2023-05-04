// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { NotFoundError } from "@chair-flight/base/errors";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import type {
  QuestionBankRepository,
  LearningObjective,
  QuestionTemplate,
  QuestionTemplateId,
  LearningObjectiveId,
  LearningObjectiveSummary,
} from "@chair-flight/base/types";

export abstract class QuestionBankBaseRepository
  implements QuestionBankRepository
{
  protected allQuestionTemplates: QuestionTemplate[] = [];
  protected allLearningObjectives: LearningObjective[] = [];
  private allQuestionTemplatesMap?: Record<
    QuestionTemplateId,
    QuestionTemplate
  >;
  private allLearningObjectivesMap?: Record<
    LearningObjectiveId,
    LearningObjective
  >;

  abstract getAllLearningObjectives(): Promise<LearningObjective[]>;
  abstract getAllQuestionTemplates(): Promise<QuestionTemplate[]>;
  abstract writeLearningObjectives(los: LearningObjective[]): Promise<void>;
  abstract writeQuestions(questions: QuestionTemplate[]): Promise<void>;

  async getQuestionTemplate(questionId: string) {
    if (!this.allQuestionTemplatesMap) {
      const questions = await this.getAllQuestionTemplates();
      this.allQuestionTemplatesMap = questions.reduce((acc, question) => {
        acc[question.id] = question;
        return acc;
      }, {} as Record<QuestionTemplateId, QuestionTemplate>);
    }
    const question = this.allQuestionTemplatesMap[questionId];
    if (!question) {
      throw new NotFoundError(`Question with id ${questionId} not found`);
    }
    return question;
  }

  async getLearningObjectives(learningObjectiveIds: string[]) {
    if (!this.allLearningObjectivesMap) {
      const learningObjectives = await this.getAllLearningObjectives();
      this.allLearningObjectivesMap = learningObjectives.reduce((acc, lo) => {
        acc[lo.id] = lo;
        return acc;
      }, {} as Record<LearningObjectiveId, LearningObjective>);
    }
    return learningObjectiveIds.map((id) => {
      const learningObjective = this.allLearningObjectivesMap?.[id];
      if (!learningObjective) {
        throw new NotFoundError(`Learning Objective with id ${id} not found`);
      }
      return learningObjective;
    });
  }

  async getSubjects() {
    const allLearningObjectives = await this.getAllLearningObjectives();
    return allLearningObjectives.reduce<LearningObjectiveSummary[]>(
      (acc, lo) => {
        const path = lo.id
          .split(".")
          .map((_, index, arr) => arr.slice(0, index + 1).join("."));

        if (path.length == 1) {
          acc.push({
            id: lo.id,
            text: lo.text,
            numberOfQuestions: lo.questions.length,
            numberOfLearningObjectives: 0,
          });
          return acc;
        }

        const subject = acc.find((s) => {
          const key = path[0] === "071" ? "070" : path[0];
          return s.id === key;
        });

        if (!subject) throw new Error(`${path[0]} should be defined!`);

        if (path.length === 2) {
          subject.numberOfLearningObjectives += 1;
          subject.numberOfQuestions += lo.questions.length;
          subject.children ??= [];
          subject.children.push({
            id: lo.id,
            text: lo.text,
            numberOfQuestions: lo.questions.length,
            numberOfLearningObjectives: 0,
          });
          return acc;
        }

        const chapter = subject.children?.find((t) => t.id === path[1]);
        if (!chapter) throw new Error(`${path[1]} should be defined!`);
        if (path.length === 3) {
          chapter.numberOfLearningObjectives += 1;
          chapter.numberOfQuestions += lo.questions.length;
          chapter.children ??= [];
          chapter.children.push({
            id: lo.id,
            text: lo.text,
            numberOfQuestions: lo.questions.length,
            numberOfLearningObjectives: 0,
          });
          return acc;
        }

        const topic = chapter.children?.find((t) => t.id === path[2]);
        if (!topic) throw new Error(`${path[2]} should be defined!`);
        topic.numberOfLearningObjectives += 1;
        topic.numberOfQuestions += lo.questions.length;

        return acc;
      },
      []
    );
  }

  async getLearningObjective(learningObjectiveId: string) {
    const learningObjectives = await this.getAllLearningObjectives();
    const learningObjective = learningObjectives.find(
      (lo) => lo.id === learningObjectiveId
    );

    if (!learningObjective) {
      throw new NotFoundError(
        `Learning Objective with id ${learningObjectiveId} not found`
      );
    }
    return learningObjective;
  }
}
