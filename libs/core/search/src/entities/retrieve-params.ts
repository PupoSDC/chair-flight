import { z } from "zod";
import { questionBankNameSchema } from "@chair-flight/core/question-bank";

export const retrieveParams = z.object({
  questionBank: questionBankNameSchema,
  ids: z.string().array(),
});
