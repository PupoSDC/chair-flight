import { QuestionBankDoc } from "@chair-flight/base/types";
import { z } from "zod";


export const QuestionBankDocSchema: z.ZodSchema<QuestionBankDoc> = z.object({
    id: z.string(),
    title: z.string(),
    fileName: z.string(),
    learningObjectiveId: z.string(),
    /** TODO MAKE THIS NOT OPTIONAL */
    empty: z.boolean().optional(),
    parentId: z.string().optional(),
    content: z.string(),
})