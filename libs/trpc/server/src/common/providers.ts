import { Analytics } from "@cf/providers/analytics";
import { Github } from "@cf/providers/github";
import { QuestionBank } from "@cf/providers/question-bank";
import {
  AnnexSearch,
  DocSearch,
  LearningObjectiveSearch,
  QuestionSearch,
} from "@cf/providers/search";
import { UserProgress } from "@cf/providers/user-progress";
import type { QuestionBankName } from "@cf/core/question-bank";

export const questionBanks: Record<QuestionBankName, QuestionBank> = {
  type: new QuestionBank("type"),
  atpl: new QuestionBank("atpl"),
  prep: new QuestionBank("prep"),
};

export const github = new Github();

export const analytics = new Analytics();

export const userProgress = new UserProgress();

export const learningObjectiveSearch = new LearningObjectiveSearch();

export const annexSearch = new AnnexSearch();

export const questionSearch = new QuestionSearch();

export const docSearch = new DocSearch();
