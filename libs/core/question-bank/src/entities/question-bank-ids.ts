import { z } from "zod";

export const questionBankNameSchema = z.enum(["type", "atpl", "prep"]);
export const annexIdSchema = z.string();
export const contentIdSchema = z.string().length(8);
export const courseIdSchema = z.string().min(2);
export const docIdSchema = z.string().min(3);
export const externalQuestionIdSchema = z.string();
export const flashcardIdSchema = z.string().length(8);
export const flashcardCollectionIdSchema = z.string().length(8);
export const learningObjectiveIdSchema = z.string().min(3);
export const questionOptionIdSchema = z.string().length(8);
export const questionTemplateIdSchema = z.string();
export const subjectIdSchema = z.string().min(3);

export type QuestionBankName = z.infer<typeof questionBankNameSchema>;
export type AnnexId = z.infer<typeof annexIdSchema>;
export type ContentId = z.infer<typeof contentIdSchema>;
export type CourseId = z.infer<typeof courseIdSchema>;
export type DocId = z.infer<typeof docIdSchema>;
export type ExternalQuestionId = z.infer<typeof externalQuestionIdSchema>;
export type FlashcardId = z.infer<typeof flashcardIdSchema>;
export type FlashcardCollectionId = z.infer<typeof flashcardCollectionIdSchema>;
export type LearningObjectiveId = z.infer<typeof learningObjectiveIdSchema>;
export type QuestionOptionId = z.infer<typeof questionOptionIdSchema>;
export type QuestionTemplateId = z.infer<typeof questionTemplateIdSchema>;
export type SubjectId = z.infer<typeof subjectIdSchema>;
