import { Analytics } from "@chair-flight/providers/analytics";
import { Blog } from "@chair-flight/providers/blog";
import { Github } from "@chair-flight/providers/github";
import { QuestionBank } from "@chair-flight/providers/question-bank";
import type { QuestionBankName } from "@chair-flight/core/question-bank";

export const questionBanks: Record<QuestionBankName, QuestionBank> = {
  type: new QuestionBank("type"),
  atpl: new QuestionBank("atpl"),
  prep: new QuestionBank("prep"),
};

export const blog = new Blog();

export const github = new Github();

export const analytics = new Analytics();
