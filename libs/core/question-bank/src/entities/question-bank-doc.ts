import { z } from "zod";
import { assertType } from "@cf/base/utils";
import { questionBankNameSchema } from "./question-bank-name";
import type { DocId, LearningObjectiveId, SubjectId } from "./ids";
import type { QuestionBankName } from "./question-bank-name";
import type { IsEqual } from "@cf/base/utils";

export type Doc = {
  id: DocId;
  parentId?: DocId;
  subject?: SubjectId;
  description?: string;
  title: string;
  questionBank: QuestionBankName;

  fileName: string;
  content: string;
  empty: boolean;
  /**
   * Learning objectives covered by this doc specifically.
   * For example "010" could be just "010", if all children have their own doc.
   * In other words, this is a 1 to 1 mapping.
   */
  learningObjectives: LearningObjectiveId[];
  /**
   * Docs contained below this Doc directly.
   */
  docs: DocId[];
};

export const docSchema = z.object({
  id: z.string(),
  parentId: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  questionBank: questionBankNameSchema,
  subject: z.string().optional(),
  fileName: z.string(),
  content: z.string(),
  empty: z.boolean(),
  learningObjectives: z.string().array(),
  docs: z.string().array(),
});

type IDoc = z.infer<typeof docSchema>;
assertType<IsEqual<IDoc, Doc>>();
