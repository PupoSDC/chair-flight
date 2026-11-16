CREATE TABLE "chair_flight"."atpl_subjects" (
	"id" text NOT NULL,
	"long_name" text NOT NULL,
	"short_name" text NOT NULL,
	"number_of_exam_questions" integer NOT NULL,
	"number_of_exam_minutes" integer NOT NULL,
	"number_of_questions" integer NOT NULL,
	CONSTRAINT "atpl_subjects_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."atpl_courses" (
	"id" text NOT NULL,
	"text" text NOT NULL,
	CONSTRAINT "atpl_courses_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."atpl_learning_objectives" (
	"id" text NOT NULL,
	"parent_id" text,
	"subject" text NOT NULL,
	"doc_id" text NOT NULL,
	"courses" text[] NOT NULL,
	"text" text NOT NULL,
	"source" text NOT NULL,
	"number_of_questions" integer NOT NULL,
	CONSTRAINT "atpl_learning_objectives_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."atpl_docs" (
	"id" text NOT NULL,
	"parent_id" text,
	"subject" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"content" text NOT NULL,
	"empty" boolean NOT NULL,
	CONSTRAINT "atpl_docs_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."atpl_questions" (
	"id" text NOT NULL,
	"doc_id" text NOT NULL,
	"subjects" text[] NOT NULL,
	"learning_objectives" text[] NOT NULL,
	"annexes" text[] NOT NULL,
	"related_questions" text[] NOT NULL,
	"external_ids" text[] NOT NULL,
	"explanation" text NOT NULL,
	"preview" text NOT NULL,
	"variant" jsonb NOT NULL,
	CONSTRAINT "atpl_questions_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."atpl_annexes" (
	"id" text NOT NULL,
	"href" text NOT NULL,
	"format" text NOT NULL,
	"description" text NOT NULL,
	"source" text NOT NULL,
	"subjects" text[] NOT NULL,
	"learning_objectives" text[] NOT NULL,
	"questions" text[] NOT NULL,
	"docs" text[] NOT NULL,
	CONSTRAINT "atpl_annexes_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."atpl_flashcards" (
	"collection_id" text NOT NULL,
	"id" text NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	CONSTRAINT "atpl_flashcards_collection_id_id_pk" PRIMARY KEY("collection_id","id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."a320_subjects" (
	"id" text NOT NULL,
	"long_name" text NOT NULL,
	"short_name" text NOT NULL,
	"number_of_exam_questions" integer NOT NULL,
	"number_of_exam_minutes" integer NOT NULL,
	"number_of_questions" integer NOT NULL,
	CONSTRAINT "a320_subjects_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."a320_courses" (
	"id" text NOT NULL,
	"text" text NOT NULL,
	CONSTRAINT "a320_courses_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."a320_learning_objectives" (
	"id" text NOT NULL,
	"parent_id" text,
	"subject" text NOT NULL,
	"doc_id" text NOT NULL,
	"courses" text[] NOT NULL,
	"text" text NOT NULL,
	"source" text NOT NULL,
	"number_of_questions" integer NOT NULL,
	CONSTRAINT "a320_learning_objectives_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."a320_docs" (
	"id" text NOT NULL,
	"parent_id" text,
	"subject" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"content" text NOT NULL,
	"empty" boolean NOT NULL,
	CONSTRAINT "a320_docs_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."a320_questions" (
	"id" text NOT NULL,
	"doc_id" text NOT NULL,
	"subjects" text[] NOT NULL,
	"learning_objectives" text[] NOT NULL,
	"annexes" text[] NOT NULL,
	"related_questions" text[] NOT NULL,
	"external_ids" text[] NOT NULL,
	"explanation" text NOT NULL,
	"preview" text NOT NULL,
	"variant" jsonb NOT NULL,
	CONSTRAINT "a320_questions_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."a320_annexes" (
	"id" text NOT NULL,
	"href" text NOT NULL,
	"format" text NOT NULL,
	"description" text NOT NULL,
	"source" text NOT NULL,
	"subjects" text[] NOT NULL,
	"learning_objectives" text[] NOT NULL,
	"questions" text[] NOT NULL,
	"docs" text[] NOT NULL,
	CONSTRAINT "a320_annexes_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."a320_flashcards" (
	"collection_id" text NOT NULL,
	"id" text NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	CONSTRAINT "a320_flashcards_collection_id_id_pk" PRIMARY KEY("collection_id","id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."b737_subjects" (
	"id" text NOT NULL,
	"long_name" text NOT NULL,
	"short_name" text NOT NULL,
	"number_of_exam_questions" integer NOT NULL,
	"number_of_exam_minutes" integer NOT NULL,
	"number_of_questions" integer NOT NULL,
	CONSTRAINT "b737_subjects_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."b737_courses" (
	"id" text NOT NULL,
	"text" text NOT NULL,
	CONSTRAINT "b737_courses_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."b737_learning_objectives" (
	"id" text NOT NULL,
	"parent_id" text,
	"subject" text NOT NULL,
	"doc_id" text NOT NULL,
	"courses" text[] NOT NULL,
	"text" text NOT NULL,
	"source" text NOT NULL,
	"number_of_questions" integer NOT NULL,
	CONSTRAINT "b737_learning_objectives_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."b737_docs" (
	"id" text NOT NULL,
	"parent_id" text,
	"subject" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"content" text NOT NULL,
	"empty" boolean NOT NULL,
	CONSTRAINT "b737_docs_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."b737_questions" (
	"id" text NOT NULL,
	"doc_id" text NOT NULL,
	"subjects" text[] NOT NULL,
	"learning_objectives" text[] NOT NULL,
	"annexes" text[] NOT NULL,
	"related_questions" text[] NOT NULL,
	"external_ids" text[] NOT NULL,
	"explanation" text NOT NULL,
	"preview" text NOT NULL,
	"variant" jsonb NOT NULL,
	CONSTRAINT "b737_questions_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."b737_annexes" (
	"id" text NOT NULL,
	"href" text NOT NULL,
	"format" text NOT NULL,
	"description" text NOT NULL,
	"source" text NOT NULL,
	"subjects" text[] NOT NULL,
	"learning_objectives" text[] NOT NULL,
	"questions" text[] NOT NULL,
	"docs" text[] NOT NULL,
	CONSTRAINT "b737_annexes_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."b737_flashcards" (
	"collection_id" text NOT NULL,
	"id" text NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	CONSTRAINT "b737_flashcards_collection_id_id_pk" PRIMARY KEY("collection_id","id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."prep_subjects" (
	"id" text NOT NULL,
	"long_name" text NOT NULL,
	"short_name" text NOT NULL,
	"number_of_exam_questions" integer NOT NULL,
	"number_of_exam_minutes" integer NOT NULL,
	"number_of_questions" integer NOT NULL,
	CONSTRAINT "prep_subjects_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."prep_courses" (
	"id" text NOT NULL,
	"text" text NOT NULL,
	CONSTRAINT "prep_courses_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."prep_learning_objectives" (
	"id" text NOT NULL,
	"parent_id" text,
	"subject" text NOT NULL,
	"doc_id" text NOT NULL,
	"courses" text[] NOT NULL,
	"text" text NOT NULL,
	"source" text NOT NULL,
	"number_of_questions" integer NOT NULL,
	CONSTRAINT "prep_learning_objectives_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."prep_docs" (
	"id" text NOT NULL,
	"parent_id" text,
	"subject" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"content" text NOT NULL,
	"empty" boolean NOT NULL,
	CONSTRAINT "prep_docs_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."prep_questions" (
	"id" text NOT NULL,
	"doc_id" text NOT NULL,
	"subjects" text[] NOT NULL,
	"learning_objectives" text[] NOT NULL,
	"annexes" text[] NOT NULL,
	"related_questions" text[] NOT NULL,
	"external_ids" text[] NOT NULL,
	"explanation" text NOT NULL,
	"preview" text NOT NULL,
	"variant" jsonb NOT NULL,
	CONSTRAINT "prep_questions_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."prep_annexes" (
	"id" text NOT NULL,
	"href" text NOT NULL,
	"format" text NOT NULL,
	"description" text NOT NULL,
	"source" text NOT NULL,
	"subjects" text[] NOT NULL,
	"learning_objectives" text[] NOT NULL,
	"questions" text[] NOT NULL,
	"docs" text[] NOT NULL,
	CONSTRAINT "prep_annexes_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."prep_flashcards" (
	"collection_id" text NOT NULL,
	"id" text NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	CONSTRAINT "prep_flashcards_collection_id_id_pk" PRIMARY KEY("collection_id","id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."atpl_learning_objective_versions" (
	"id" text NOT NULL,
	"position" integer NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"ecqb_release" text,
	"source_file" text NOT NULL,
	"number_of_learning_objectives" integer NOT NULL,
	CONSTRAINT "atpl_learning_objective_versions_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."atpl_learning_objective_revisions" (
	"version" text NOT NULL,
	"id" text NOT NULL,
	"parent_id" text,
	"subject" text NOT NULL,
	"level" integer NOT NULL,
	"text" text NOT NULL,
	"items" text[] NOT NULL,
	"original_text" text NOT NULL,
	"source" text NOT NULL,
	"courses" text[] NOT NULL,
	"previous_ids" text[] NOT NULL,
	"next_ids" text[] NOT NULL,
	"change" text,
	CONSTRAINT "atpl_learning_objective_revisions_version_id_pk" PRIMARY KEY("version","id")
);
--> statement-breakpoint
CREATE INDEX "atpl_learning_objectives_parent_id_index" ON "chair_flight"."atpl_learning_objectives" USING btree ("parent_id");
--> statement-breakpoint
CREATE INDEX "atpl_learning_objectives_doc_id_index" ON "chair_flight"."atpl_learning_objectives" USING btree ("doc_id");
--> statement-breakpoint
CREATE INDEX "atpl_docs_parent_id_index" ON "chair_flight"."atpl_docs" USING btree ("parent_id");
--> statement-breakpoint
CREATE INDEX "atpl_questions_doc_id_index" ON "chair_flight"."atpl_questions" USING btree ("doc_id");
--> statement-breakpoint
CREATE INDEX "atpl_questions_learning_objectives_index" ON "chair_flight"."atpl_questions" USING gin ("learning_objectives");
--> statement-breakpoint
CREATE INDEX "atpl_questions_subjects_index" ON "chair_flight"."atpl_questions" USING gin ("subjects");
--> statement-breakpoint
CREATE INDEX "a320_learning_objectives_parent_id_index" ON "chair_flight"."a320_learning_objectives" USING btree ("parent_id");
--> statement-breakpoint
CREATE INDEX "a320_learning_objectives_doc_id_index" ON "chair_flight"."a320_learning_objectives" USING btree ("doc_id");
--> statement-breakpoint
CREATE INDEX "a320_docs_parent_id_index" ON "chair_flight"."a320_docs" USING btree ("parent_id");
--> statement-breakpoint
CREATE INDEX "a320_questions_doc_id_index" ON "chair_flight"."a320_questions" USING btree ("doc_id");
--> statement-breakpoint
CREATE INDEX "a320_questions_learning_objectives_index" ON "chair_flight"."a320_questions" USING gin ("learning_objectives");
--> statement-breakpoint
CREATE INDEX "a320_questions_subjects_index" ON "chair_flight"."a320_questions" USING gin ("subjects");
--> statement-breakpoint
CREATE INDEX "b737_learning_objectives_parent_id_index" ON "chair_flight"."b737_learning_objectives" USING btree ("parent_id");
--> statement-breakpoint
CREATE INDEX "b737_learning_objectives_doc_id_index" ON "chair_flight"."b737_learning_objectives" USING btree ("doc_id");
--> statement-breakpoint
CREATE INDEX "b737_docs_parent_id_index" ON "chair_flight"."b737_docs" USING btree ("parent_id");
--> statement-breakpoint
CREATE INDEX "b737_questions_doc_id_index" ON "chair_flight"."b737_questions" USING btree ("doc_id");
--> statement-breakpoint
CREATE INDEX "b737_questions_learning_objectives_index" ON "chair_flight"."b737_questions" USING gin ("learning_objectives");
--> statement-breakpoint
CREATE INDEX "b737_questions_subjects_index" ON "chair_flight"."b737_questions" USING gin ("subjects");
--> statement-breakpoint
CREATE INDEX "prep_learning_objectives_parent_id_index" ON "chair_flight"."prep_learning_objectives" USING btree ("parent_id");
--> statement-breakpoint
CREATE INDEX "prep_learning_objectives_doc_id_index" ON "chair_flight"."prep_learning_objectives" USING btree ("doc_id");
--> statement-breakpoint
CREATE INDEX "prep_docs_parent_id_index" ON "chair_flight"."prep_docs" USING btree ("parent_id");
--> statement-breakpoint
CREATE INDEX "prep_questions_doc_id_index" ON "chair_flight"."prep_questions" USING btree ("doc_id");
--> statement-breakpoint
CREATE INDEX "prep_questions_learning_objectives_index" ON "chair_flight"."prep_questions" USING gin ("learning_objectives");
--> statement-breakpoint
CREATE INDEX "prep_questions_subjects_index" ON "chair_flight"."prep_questions" USING gin ("subjects");
--> statement-breakpoint
CREATE INDEX "atpl_learning_objective_revisions_version_parent_id_index" ON "chair_flight"."atpl_learning_objective_revisions" USING btree ("version","parent_id");
--> statement-breakpoint
CREATE INDEX "atpl_learning_objective_revisions_version_subject_index" ON "chair_flight"."atpl_learning_objective_revisions" USING btree ("version","subject");
--> statement-breakpoint
INSERT INTO "chair_flight"."atpl_subjects" ("id", "long_name", "short_name", "number_of_exam_questions", "number_of_exam_minutes", "number_of_questions") SELECT "id", "long_name", "short_name", "number_of_exam_questions", "number_of_exam_minutes", "number_of_questions" FROM "chair_flight"."subjects" WHERE "question_bank" = 'atpl';
--> statement-breakpoint
INSERT INTO "chair_flight"."atpl_courses" ("id", "text") SELECT "id", "text" FROM "chair_flight"."courses" WHERE "question_bank" = 'atpl';
--> statement-breakpoint
INSERT INTO "chair_flight"."atpl_learning_objectives" ("id", "parent_id", "subject", "doc_id", "courses", "text", "source", "number_of_questions") SELECT "id", "parent_id", "subject", "doc_id", "courses", "text", "source", "number_of_questions" FROM "chair_flight"."learning_objectives" WHERE "question_bank" = 'atpl';
--> statement-breakpoint
INSERT INTO "chair_flight"."atpl_docs" ("id", "parent_id", "subject", "title", "description", "content", "empty") SELECT "id", "parent_id", "subject", "title", "description", "content", "empty" FROM "chair_flight"."docs" WHERE "question_bank" = 'atpl';
--> statement-breakpoint
INSERT INTO "chair_flight"."atpl_questions" ("id", "doc_id", "subjects", "learning_objectives", "annexes", "related_questions", "external_ids", "explanation", "preview", "variant") SELECT "id", "doc_id", "subjects", "learning_objectives", "annexes", "related_questions", "external_ids", "explanation", "preview", "variant" FROM "chair_flight"."questions" WHERE "question_bank" = 'atpl';
--> statement-breakpoint
INSERT INTO "chair_flight"."atpl_annexes" ("id", "href", "format", "description", "source", "subjects", "learning_objectives", "questions", "docs") SELECT "id", "href", "format", "description", "source", "subjects", "learning_objectives", "questions", "docs" FROM "chair_flight"."annexes" WHERE "question_bank" = 'atpl';
--> statement-breakpoint
INSERT INTO "chair_flight"."atpl_flashcards" ("collection_id", "id", "question", "answer") SELECT "collection_id", "id", "question", "answer" FROM "chair_flight"."flashcards" WHERE "question_bank" = 'atpl';
--> statement-breakpoint
INSERT INTO "chair_flight"."a320_subjects" ("id", "long_name", "short_name", "number_of_exam_questions", "number_of_exam_minutes", "number_of_questions") SELECT "id", "long_name", "short_name", "number_of_exam_questions", "number_of_exam_minutes", "number_of_questions" FROM "chair_flight"."subjects" WHERE "question_bank" = 'a320';
--> statement-breakpoint
INSERT INTO "chair_flight"."a320_courses" ("id", "text") SELECT "id", "text" FROM "chair_flight"."courses" WHERE "question_bank" = 'a320';
--> statement-breakpoint
INSERT INTO "chair_flight"."a320_learning_objectives" ("id", "parent_id", "subject", "doc_id", "courses", "text", "source", "number_of_questions") SELECT "id", "parent_id", "subject", "doc_id", "courses", "text", "source", "number_of_questions" FROM "chair_flight"."learning_objectives" WHERE "question_bank" = 'a320';
--> statement-breakpoint
INSERT INTO "chair_flight"."a320_docs" ("id", "parent_id", "subject", "title", "description", "content", "empty") SELECT "id", "parent_id", "subject", "title", "description", "content", "empty" FROM "chair_flight"."docs" WHERE "question_bank" = 'a320';
--> statement-breakpoint
INSERT INTO "chair_flight"."a320_questions" ("id", "doc_id", "subjects", "learning_objectives", "annexes", "related_questions", "external_ids", "explanation", "preview", "variant") SELECT "id", "doc_id", "subjects", "learning_objectives", "annexes", "related_questions", "external_ids", "explanation", "preview", "variant" FROM "chair_flight"."questions" WHERE "question_bank" = 'a320';
--> statement-breakpoint
INSERT INTO "chair_flight"."a320_annexes" ("id", "href", "format", "description", "source", "subjects", "learning_objectives", "questions", "docs") SELECT "id", "href", "format", "description", "source", "subjects", "learning_objectives", "questions", "docs" FROM "chair_flight"."annexes" WHERE "question_bank" = 'a320';
--> statement-breakpoint
INSERT INTO "chair_flight"."a320_flashcards" ("collection_id", "id", "question", "answer") SELECT "collection_id", "id", "question", "answer" FROM "chair_flight"."flashcards" WHERE "question_bank" = 'a320';
--> statement-breakpoint
INSERT INTO "chair_flight"."b737_subjects" ("id", "long_name", "short_name", "number_of_exam_questions", "number_of_exam_minutes", "number_of_questions") SELECT "id", "long_name", "short_name", "number_of_exam_questions", "number_of_exam_minutes", "number_of_questions" FROM "chair_flight"."subjects" WHERE "question_bank" = 'b737';
--> statement-breakpoint
INSERT INTO "chair_flight"."b737_courses" ("id", "text") SELECT "id", "text" FROM "chair_flight"."courses" WHERE "question_bank" = 'b737';
--> statement-breakpoint
INSERT INTO "chair_flight"."b737_learning_objectives" ("id", "parent_id", "subject", "doc_id", "courses", "text", "source", "number_of_questions") SELECT "id", "parent_id", "subject", "doc_id", "courses", "text", "source", "number_of_questions" FROM "chair_flight"."learning_objectives" WHERE "question_bank" = 'b737';
--> statement-breakpoint
INSERT INTO "chair_flight"."b737_docs" ("id", "parent_id", "subject", "title", "description", "content", "empty") SELECT "id", "parent_id", "subject", "title", "description", "content", "empty" FROM "chair_flight"."docs" WHERE "question_bank" = 'b737';
--> statement-breakpoint
INSERT INTO "chair_flight"."b737_questions" ("id", "doc_id", "subjects", "learning_objectives", "annexes", "related_questions", "external_ids", "explanation", "preview", "variant") SELECT "id", "doc_id", "subjects", "learning_objectives", "annexes", "related_questions", "external_ids", "explanation", "preview", "variant" FROM "chair_flight"."questions" WHERE "question_bank" = 'b737';
--> statement-breakpoint
INSERT INTO "chair_flight"."b737_annexes" ("id", "href", "format", "description", "source", "subjects", "learning_objectives", "questions", "docs") SELECT "id", "href", "format", "description", "source", "subjects", "learning_objectives", "questions", "docs" FROM "chair_flight"."annexes" WHERE "question_bank" = 'b737';
--> statement-breakpoint
INSERT INTO "chair_flight"."b737_flashcards" ("collection_id", "id", "question", "answer") SELECT "collection_id", "id", "question", "answer" FROM "chair_flight"."flashcards" WHERE "question_bank" = 'b737';
--> statement-breakpoint
INSERT INTO "chair_flight"."prep_subjects" ("id", "long_name", "short_name", "number_of_exam_questions", "number_of_exam_minutes", "number_of_questions") SELECT "id", "long_name", "short_name", "number_of_exam_questions", "number_of_exam_minutes", "number_of_questions" FROM "chair_flight"."subjects" WHERE "question_bank" = 'prep';
--> statement-breakpoint
INSERT INTO "chair_flight"."prep_courses" ("id", "text") SELECT "id", "text" FROM "chair_flight"."courses" WHERE "question_bank" = 'prep';
--> statement-breakpoint
INSERT INTO "chair_flight"."prep_learning_objectives" ("id", "parent_id", "subject", "doc_id", "courses", "text", "source", "number_of_questions") SELECT "id", "parent_id", "subject", "doc_id", "courses", "text", "source", "number_of_questions" FROM "chair_flight"."learning_objectives" WHERE "question_bank" = 'prep';
--> statement-breakpoint
INSERT INTO "chair_flight"."prep_docs" ("id", "parent_id", "subject", "title", "description", "content", "empty") SELECT "id", "parent_id", "subject", "title", "description", "content", "empty" FROM "chair_flight"."docs" WHERE "question_bank" = 'prep';
--> statement-breakpoint
INSERT INTO "chair_flight"."prep_questions" ("id", "doc_id", "subjects", "learning_objectives", "annexes", "related_questions", "external_ids", "explanation", "preview", "variant") SELECT "id", "doc_id", "subjects", "learning_objectives", "annexes", "related_questions", "external_ids", "explanation", "preview", "variant" FROM "chair_flight"."questions" WHERE "question_bank" = 'prep';
--> statement-breakpoint
INSERT INTO "chair_flight"."prep_annexes" ("id", "href", "format", "description", "source", "subjects", "learning_objectives", "questions", "docs") SELECT "id", "href", "format", "description", "source", "subjects", "learning_objectives", "questions", "docs" FROM "chair_flight"."annexes" WHERE "question_bank" = 'prep';
--> statement-breakpoint
INSERT INTO "chair_flight"."prep_flashcards" ("collection_id", "id", "question", "answer") SELECT "collection_id", "id", "question", "answer" FROM "chair_flight"."flashcards" WHERE "question_bank" = 'prep';
--> statement-breakpoint
DROP TABLE "chair_flight"."subjects";
--> statement-breakpoint
DROP TABLE "chair_flight"."courses";
--> statement-breakpoint
DROP TABLE "chair_flight"."learning_objectives";
--> statement-breakpoint
DROP TABLE "chair_flight"."docs";
--> statement-breakpoint
DROP TABLE "chair_flight"."questions";
--> statement-breakpoint
DROP TABLE "chair_flight"."annexes";
--> statement-breakpoint
DROP TABLE "chair_flight"."flashcards";

