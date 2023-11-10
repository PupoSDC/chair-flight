import { Octokit } from "octokit";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";

let octokit: Octokit;

export const getOctokit = (): {
  octokit: Octokit;
  originOwner: string;
  originRepo: string;
  upstreamOwner: string;
  upstreamRepo: string;
} => {
  if (!octokit) {
    octokit = new Octokit({
      auth: getEnvVariableOrThrow("PROVIDER_GITHUB_TOKEN"),
    });
  }
  const originOwner = getEnvVariableOrThrow(
    "PROVIDER_GITHUB_PROJECT_ORIGIN_OWNER",
  );
  const originRepo = getEnvVariableOrThrow(
    "PROVIDER_GITHUB_PROJECT_ORIGIN_REPO",
  );
  const upstreamOwner = getEnvVariableOrThrow(
    "PROVIDER_GITHUB_PROJECT_UPSTREAM_OWNER",
  );
  const upstreamRepo = getEnvVariableOrThrow(
    "PROVIDER_GITHUB_PROJECT_UPSTREAM_REPO",
  );
  return { octokit, originOwner, originRepo, upstreamOwner, upstreamRepo };
};
