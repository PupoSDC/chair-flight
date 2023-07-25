import {
  InvalidEnvVariableError,
  MissingEnvVariableError,
} from "@chair-flight/base/errors";

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

export type EnvQuestionBankProvider = "redis" | "local";

export const getEnvQuestionBankProvider = (): EnvQuestionBankProvider => {
  const env = getEnvVariableOrDefault("QUESTION_BANK_PROVIDER", "local");
  if (env === "redis" || env === "local") return env;
  throw new InvalidEnvVariableError("QUESTION_BANK_PROVIDER", env);
};
