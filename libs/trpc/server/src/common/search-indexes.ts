import { default as MiniSearch } from "minisearch";
import type {
  QuestionSearchResult,
  QuestionSearchDocument,
  QuestionSearchField,
  AnnexSearchResult,
  AnnexSearchDocument,
  AnnexSearchField,
  DocSearchResult,
  DocSearchDocument,
  DocSearchField,
  LearningObjectiveSearchResult as LoSearchResult,
  learningObjectiveSearchDocument as LoSearchDocument,
  LearningObjectiveSearchField as LoSearchField,
} from "@chair-flight/core/search";

export const learningObjectiveSearchResults = new Map<string, LoSearchResult>();
export const questionSearchResults = new Map<string, QuestionSearchResult>();
export const annexSearchResults = new Map<string, AnnexSearchResult>();
export const docSearchResults = new Map<string, DocSearchResult>();

export const learningObjectiveSearchIndex = new MiniSearch<LoSearchDocument>({
  fields: [
    // force multiline
    "id",
    "text",
  ] satisfies LoSearchField[],
  storeFields: [
    // force multiline
    "id",
    "text",
  ] satisfies LoSearchField[],
});

export const questionSearchIndex = new MiniSearch<QuestionSearchDocument>({
  fields: [
    // force multiline
    "id",
    "questionId",
    "questionBank",
    "subjects",
    "learningObjectives",
    "text",
    "externalIds",
  ] satisfies QuestionSearchField[],
  storeFields: [
    // force multiline
    "id",
    "questionId",
  ] satisfies QuestionSearchField[],
});

export const annexSearchIndex = new MiniSearch<AnnexSearchDocument>({
  fields: [
    // force multiline
    "id",
    "description",
  ] satisfies AnnexSearchField[],
  storeFields: [
    // force multiline
    "id",
    "description",
  ] satisfies AnnexSearchField[],
});

export const docSearchIndex = new MiniSearch<DocSearchDocument>({
  fields: [
    // force multiline
    "id",
    "learningObjectiveId",
    "content",
    "title",
  ] satisfies DocSearchField[],
  storeFields: [
    // force multiline
    "id",
  ] satisfies DocSearchField[],
});
