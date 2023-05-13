import { Redis } from "@upstash/redis";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";

let redis: Redis;

export const getRedis = (): Redis => {
  if (!redis) {
    redis = new Redis({
      url: getEnvVariableOrThrow("UPSTASH_URL"),
      token: getEnvVariableOrThrow("UPSTASH_TOKEN"),
    });
  }
  return redis;
};

export { Redis };
