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
      auth: getEnvVariableOrThrow("PROVIDER_GITHUB_TOKEN"),
    });
  }
  const owner = getEnvVariableOrThrow("PROVIDER_GITHUB_PROJECT_OWNER");
  const repo = getEnvVariableOrThrow("PROVIDER_GITHUB_PROJECT_NAME");
  return { octokit, owner, repo };
};
