import { z } from "zod";
import { assertType } from "@cf/base/utils";
import { questionBankNameSchema } from "./question-bank-name";
import type {
  AnnexId,
  DocId,
  LearningObjectiveId,
  QuestionTemplateId,
  SubjectId,
} from "./ids";
import type { QuestionBankName } from "./question-bank-name";
import type { IsEqual } from "@cf/base/utils";

export type AnnexFormat = "jpg";

export type Annex = {
  id: AnnexId;
  href: string;
  source: string;
  srcLocation: string;
  questionBank: QuestionBankName;
  format: AnnexFormat;
  description: string;
  docs: DocId[];
  questions: QuestionTemplateId[];
  subjects: SubjectId[];
  learningObjectives: LearningObjectiveId[];
};

export const annexSchema = z.object({
  id: z.string(),
  href: z.string(),
  srcLocation: z.string(),
  source: z.string(),
  questionBank: questionBankNameSchema,
  format: z.enum(["jpg"]),
  description: z.string(),
  docs: z.array(z.string().min(3)),
  questions: z.array(z.string().min(3)),
  subjects: z.array(z.string().min(3)).min(1),
  learningObjectives: z.array(z.string().min(3)).min(1),
});

type IAnnex = z.infer<typeof annexSchema>;
assertType<IsEqual<Annex, IAnnex>>();
