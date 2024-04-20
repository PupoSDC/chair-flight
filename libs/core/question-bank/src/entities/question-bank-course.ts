import { z } from "zod";
import { courseIdSchema } from "./question-bank-ids";

export const courseSchema = z.object({
  id: courseIdSchema,
  text: z.string(),
});

export type Course = z.infer<typeof courseSchema>;
