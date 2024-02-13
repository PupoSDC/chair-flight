import { z } from "zod";
import { questionBankNameSchema } from "@cf/core/question-bank";

export const retrieveParams = z.object({
  questionBank: questionBankNameSchema,
  ids: z.string().array(),
});
