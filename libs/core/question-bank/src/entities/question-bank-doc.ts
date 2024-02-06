import { z } from "zod";
import { assertType } from "@chair-flight/base/utils";
import type {
  DocId,
  LearningObjectiveId,
  QuestionTemplateId,
  SubjectId,
} from "./ids";
import type { IsEqual } from "@chair-flight/base/utils";

export type Doc = {
  id: DocId;
  parent?: DocId;
  title: string;

  // Inferred data
  subject: SubjectId;
  learningObjectives: LearningObjectiveId[];
  questions: QuestionTemplateId[];
  children: DocId[];
  fileName: string;
  content: string;
  empty: boolean;
};

export const docSchema = z.object({
  id: z.string(),
  parentId: z.string().optional(),
  title: z.string(),
  subject: z.string(),
  learningObjectives: z.string().array(),
  questions: z.string().array(),
  children: z.string().array(),
  fileName: z.string(),
  content: z.string(),
  empty: z.boolean(),
});

type IDoc = z.infer<typeof docSchema>;
assertType<IsEqual<IDoc, Doc>>();
