import {
  getEnvVariableOrDefault,
  getEnvVariableOrThrow,
} from "@chair-flight/base/env";

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
