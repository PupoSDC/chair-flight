import { Configuration, OpenAIApi } from "openai";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";

let openAi: OpenAIApi;

export const getOpenAi = (): OpenAIApi => {
  if (!openAi) {
    const configuration = new Configuration({
      apiKey: getEnvVariableOrThrow("OPENAI_API_KEY"),
    });
    openAi = new OpenAIApi(configuration);
  }
  return openAi;
};

export type { OpenAIApi };
