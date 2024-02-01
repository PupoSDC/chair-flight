import { z } from "zod";
import { Doc } from "../types";
import { assertType, IsEqual } from "@chair-flight/base/utils";

export const docSchema = z.object({
  id: z.string(),
  parentId: z.string().optional(),
  title: z.string(),

  subject: z.string(),
  learningObjectives: z.string().array(),
  questions:z.string().array(),
  children: z.string().array(),
  fileName: z.string(),
  content:  z.string(),
  empty: z.boolean(),
});

type IDoc = z.infer<typeof docSchema>;
assertType<IsEqual<IDoc, Doc>>();