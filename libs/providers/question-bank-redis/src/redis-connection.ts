import { Redis } from "@upstash/redis";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";

let redis: Redis;

export const getRedis = (): Redis => {
  if (!redis) {
    redis = new Redis({
      url: getEnvVariableOrThrow("PROVIDER_QUESTION_BANK_REDIS_UPSTASH_URL"),
      token: getEnvVariableOrThrow(
        "PROVIDER_QUESTION_BANK_REDIS_UPSTASH_TOKEN",
      ),
    });
  }
  return redis;
};

export const QUESTION = "QB-READ-ONLY-QUESTION-";
export const LEARNING_OBJECTIVE = "QB-READ-ONLY-LEARNING-OBJECTIVE-";
export const SUBJECTS = "QB-READ-ONLY-SUBJECTS";
export const FLASH_CARDS = "QB-READ-ONLY-FLASH-CARDS";

export { Redis };
