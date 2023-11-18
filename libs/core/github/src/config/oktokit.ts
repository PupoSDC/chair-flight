import { Octokit } from "octokit";
import {
  getEnvVariableOrDefault,
  getEnvVariableOrThrow,
} from "@chair-flight/base/env";

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
  const upstreamOwner = getEnvVariableOrThrow(
    "PROVIDER_GITHUB_PROJECT_UPSTREAM_OWNER",
  );
  const upstreamRepo = getEnvVariableOrThrow(
    "PROVIDER_GITHUB_PROJECT_UPSTREAM_REPO",
  );
  const originOwner = getEnvVariableOrDefault(
    "PROVIDER_GITHUB_PROJECT_ORIGIN_OWNER",
    upstreamOwner,
  );
  const originRepo = getEnvVariableOrDefault(
    "PROVIDER_GITHUB_PROJECT_ORIGIN_REPO",
    upstreamRepo,
  );

  return { octokit, originOwner, originRepo, upstreamOwner, upstreamRepo };
};
