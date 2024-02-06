import { z } from "zod";

export const questionBankNameSchema = z.enum(["type", "atpl", "prep"]);
export type QuestionBankName = z.infer<typeof questionBankNameSchema>;
