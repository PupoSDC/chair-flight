CREATE SCHEMA IF NOT EXISTS "chair_flight";
--> statement-breakpoint
CREATE TABLE "chair_flight"."annexes" (
	"question_bank" text NOT NULL,
	"id" text NOT NULL,
	"href" text NOT NULL,
	"format" text NOT NULL,
	"description" text NOT NULL,
	"source" text NOT NULL,
	"subjects" text[] NOT NULL,
	"learning_objectives" text[] NOT NULL,
	"questions" text[] NOT NULL,
	"docs" text[] NOT NULL,
	CONSTRAINT "annexes_question_bank_id_pk" PRIMARY KEY("question_bank","id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."courses" (
	"question_bank" text NOT NULL,
	"id" text NOT NULL,
	"text" text NOT NULL,
	CONSTRAINT "courses_question_bank_id_pk" PRIMARY KEY("question_bank","id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."docs" (
	"question_bank" text NOT NULL,
	"id" text NOT NULL,
	"parent_id" text,
	"subject" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"content" text NOT NULL,
	"empty" boolean NOT NULL,
	CONSTRAINT "docs_question_bank_id_pk" PRIMARY KEY("question_bank","id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."flashcards" (
	"question_bank" text NOT NULL,
	"collection_id" text NOT NULL,
	"id" text NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	CONSTRAINT "flashcards_question_bank_collection_id_id_pk" PRIMARY KEY("question_bank","collection_id","id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."learning_objectives" (
	"question_bank" text NOT NULL,
	"id" text NOT NULL,
	"parent_id" text,
	"subject" text NOT NULL,
	"doc_id" text NOT NULL,
	"courses" text[] NOT NULL,
	"text" text NOT NULL,
	"source" text NOT NULL,
	"number_of_questions" integer NOT NULL,
	CONSTRAINT "learning_objectives_question_bank_id_pk" PRIMARY KEY("question_bank","id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."questions" (
	"question_bank" text NOT NULL,
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
	CONSTRAINT "questions_question_bank_id_pk" PRIMARY KEY("question_bank","id")
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."subjects" (
	"question_bank" text NOT NULL,
	"id" text NOT NULL,
	"long_name" text NOT NULL,
	"short_name" text NOT NULL,
	"number_of_exam_questions" integer NOT NULL,
	"number_of_exam_minutes" integer NOT NULL,
	"number_of_questions" integer NOT NULL,
	CONSTRAINT "subjects_question_bank_id_pk" PRIMARY KEY("question_bank","id")
);
--> statement-breakpoint
CREATE INDEX "docs_question_bank_parent_id_index" ON "chair_flight"."docs" USING btree ("question_bank","parent_id");--> statement-breakpoint
CREATE INDEX "learning_objectives_question_bank_parent_id_index" ON "chair_flight"."learning_objectives" USING btree ("question_bank","parent_id");--> statement-breakpoint
CREATE INDEX "learning_objectives_question_bank_doc_id_index" ON "chair_flight"."learning_objectives" USING btree ("question_bank","doc_id");--> statement-breakpoint
CREATE INDEX "questions_question_bank_doc_id_index" ON "chair_flight"."questions" USING btree ("question_bank","doc_id");--> statement-breakpoint
CREATE INDEX "questions_learning_objectives_index" ON "chair_flight"."questions" USING gin ("learning_objectives");--> statement-breakpoint
CREATE INDEX "questions_subjects_index" ON "chair_flight"."questions" USING gin ("subjects");