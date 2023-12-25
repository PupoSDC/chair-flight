import { MissingEnvVariableError } from "@chair-flight/base/errors";

export const getEnvVariableOrThrow = (name: string): string => {
  if (process.env[name]) return process.env[name] as string;
  throw new MissingEnvVariableError(name);
};

export const getEnvVariableOrDefault = (
  name: string,
  defaultValue: string,
): string => {
  if (process.env[name]) return process.env[name] as string;
  return defaultValue;
};

export const getUrlPathOnServer = () => {
  const VERCEL_URL = getEnvVariableOrThrow("VERCEL_URL");
  const PROTOCOL = VERCEL_URL.includes("localhost") ? "http" : "https";
  return `${PROTOCOL}://${VERCEL_URL}`;
};

export const getRepositoryUrl = () => {
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

  return `https://github.com/${originOwner}/${originRepo}`;
};
