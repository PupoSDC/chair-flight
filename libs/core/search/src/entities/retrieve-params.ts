import { z } from "zod";
import { questionBankNameSchema } from "@cf/core/content";

export const retrieveParams = z.object({
  questionBank: questionBankNameSchema,
  ids: z.string().array(),
});
