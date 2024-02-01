import { z } from "zod";
import { assertType } from "@chair-flight/base/utils";
import type { Annex } from "../types/question-bank-types";
import type { IsEqual } from "@chair-flight/base/utils";

export const annexSchema = z.object({
  id: z.string(),
  doc: z.string(),
  format: z.enum(["jpg"]),
  description: z.string(),
  questions: z.array(z.string().min(3)),
  subjects: z.array(z.string().min(3)),
  learningObjectives: z.array(z.string().min(3)),
});

type IAnnex = z.infer<typeof annexSchema>;
assertType<IsEqual<Annex, IAnnex>>();
