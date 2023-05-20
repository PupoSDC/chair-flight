import { Octokit } from "octokit";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";

let octokit: Octokit;

export const getOctokit = (): {
  octokit: Octokit;
  owner: string;
  repo: string;
} => {
  if (!octokit) {
    octokit = new Octokit({
      auth: getEnvVariableOrThrow("GITHUB_TOKEN"),
    });
  }
  const owner = getEnvVariableOrThrow("GITHUB_PROJECT_OWNER");
  const repo = getEnvVariableOrThrow("GITHUB_PROJECT_NAME");
  return { octokit, owner, repo };
};
