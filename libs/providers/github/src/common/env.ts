import { getEnvVariableOrDefault, getEnvVariableOrThrow } from "@cf/base/env";

export const upstreamOwner = getEnvVariableOrThrow(
  "PROVIDER_GITHUB_PROJECT_UPSTREAM_OWNER",
);

export const upstreamRepo = getEnvVariableOrThrow(
  "PROVIDER_GITHUB_PROJECT_UPSTREAM_REPO",
);

export const originOwner = getEnvVariableOrDefault(
  "PROVIDER_GITHUB_PROJECT_ORIGIN_OWNER",
  upstreamOwner,
);

export const originRepo = getEnvVariableOrDefault(
  "PROVIDER_GITHUB_PROJECT_ORIGIN_REPO",
  upstreamRepo,
);

export const originBranch = getEnvVariableOrDefault(
  "PROVIDER_GITHUB_PROJECT_ORIGIN_BRANCH",
  getEnvVariableOrDefault("VERCEL_GIT_COMMIT_REF", "main"),
);
