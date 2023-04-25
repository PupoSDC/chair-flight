import { Redis } from "@upstash/redis";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";

export const redis = new Redis({
  url: getEnvVariableOrThrow("UPSTASH_URL"),
  token: getEnvVariableOrThrow("UPSTASH_TOKEN"),
});
