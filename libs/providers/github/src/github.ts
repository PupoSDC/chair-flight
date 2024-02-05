import { Octokit } from "octokit";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";
import { createNewIssue } from "./functions/create-new-issue";
import { createNewQuestionPr } from "./functions/create-new-question-pr";
import type { NewIssue, QuestionEdit } from "@chair-flight/core/github";

interface GithubProvider {
  createNewQuestionPr(newQuestion: QuestionEdit): Promise<{ url: string }>;
  createNewIssue(newIssue: NewIssue): Promise<{ url: string }>;
}

export class Github implements GithubProvider {
  private static octokit: Octokit;

  constructor() {
    Github.octokit = new Octokit({
      auth: getEnvVariableOrThrow("PROVIDER_GITHUB_TOKEN"),
    });
  }

  async createNewQuestionPr(newQuestion: QuestionEdit) {
    return await createNewQuestionPr(Github.octokit, newQuestion);
  }

  async createNewIssue(newIssue: NewIssue) {
    return await createNewIssue(Github.octokit, newIssue);
  }
}
