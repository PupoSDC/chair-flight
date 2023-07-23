import { type inferAsyncReturnType } from "@trpc/server";
import { getQuestionBank } from "@chair-flight/question-bank/providers";

export const createContext = async () => {
  const questionBank = getQuestionBank();
  return { questionBank };
};

export type Context = inferAsyncReturnType<typeof createContext>;
