import { z } from "zod";
import { assertType } from "@chair-flight/base/utils";
import { questionBankNameSchema } from "./question-bank-name";
import type {
  AnnexId,
  DocId,
  LearningObjectiveId,
  QuestionTemplateId,
  SubjectId,
} from "./ids";
import type { QuestionBankName } from "./question-bank-name";
import type { IsEqual } from "@chair-flight/base/utils";

export type AnnexFormat = "jpg";

export type Annex = {
  id: AnnexId;
  href: string;
  doc: DocId;
  questionBank: QuestionBankName;
  format: AnnexFormat;
  description: string;
  questions: QuestionTemplateId[];
  subjects: SubjectId[];
  learningObjectives: LearningObjectiveId[];
};

export const annexSchema = z.object({
  id: z.string(),
  href: z.string(),
  doc: z.string(),
  questionBank: questionBankNameSchema,
  format: z.enum(["jpg"]),
  description: z.string(),
  questions: z.array(z.string().min(3)),
  subjects: z.array(z.string().min(3)),
  learningObjectives: z.array(z.string().min(3)),
});

type IAnnex = z.infer<typeof annexSchema>;
assertType<IsEqual<Annex, IAnnex>>();
