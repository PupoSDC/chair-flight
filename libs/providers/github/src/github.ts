import { Octokit } from "octokit";
import { getEnvVariableOrThrow } from "@cf/base/env";
import { originRepo, upstreamOwner } from "./common/env";
import { createEditQuestionsPr } from "./functions/create-edit-questions-pr";
import { createNewIssue } from "./functions/create-new-issue";
import type { NewIssue, EditQuestionsPr } from "@cf/core/github";

interface GithubProvider {
  createEditQuestionsPr(newPr: EditQuestionsPr): Promise<{ url: string }>;
  createNewIssue(newIssue: NewIssue): Promise<{ url: string }>;
}

export class Github implements GithubProvider {
  private static octokit: Octokit;

  constructor() {
    Github.octokit = new Octokit({
      auth: getEnvVariableOrThrow("PROVIDER_GITHUB_TOKEN"),
    });
  }

  getRepositoryUrl() {
    return `https://github.com/${upstreamOwner}/${originRepo}`;
  }

  async createEditQuestionsPr(newPr: EditQuestionsPr) {
    return await createEditQuestionsPr(Github.octokit, newPr);
  }

  async createNewIssue(newIssue: NewIssue) {
    return await createNewIssue(Github.octokit, newIssue);
  }
}
