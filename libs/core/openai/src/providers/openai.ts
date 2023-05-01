import { Configuration, OpenAIApi } from "openai";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";

const configuration = new Configuration({
  apiKey: getEnvVariableOrThrow("OPENAI_API_KEY"),
});

export const openAi = new OpenAIApi(configuration);
