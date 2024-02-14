import { z } from "zod";
import { assertType } from "@cf/base/utils";
import { questionBankNameSchema } from "./question-bank-name";
import type {
  DocId,
  LearningObjectiveId,
  SubjectId,
} from "./ids";
import type { QuestionBankName } from "./question-bank-name";
import type { IsEqual } from "@cf/base/utils";

export type Doc = {
  id: DocId;
  parent?: DocId;
  title: string;
  questionBank: QuestionBankName;

  // Inferred data
  subject?: SubjectId;
  learningObjective?: LearningObjectiveId;
  children: DocId[];
  fileName: string;
  content: string;
  empty: boolean;
};

export const docSchema = z.object({
  id: z.string(),
  parentId: z.string().optional(),
  title: z.string(),
  questionBank: questionBankNameSchema,
  learningObjective: z.string().optional(),
  subject: z.string().optional(),
  children: z.string().array(),
  fileName: z.string(),
  content: z.string(),
  empty: z.boolean(),
});

type IDoc = z.infer<typeof docSchema>;
assertType<IsEqual<IDoc, Doc>>();
