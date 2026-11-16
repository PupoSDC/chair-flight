DROP TABLE IF EXISTS "chair_flight"."a320_subjects";--> statement-breakpoint
DROP TABLE IF EXISTS "chair_flight"."a320_courses";--> statement-breakpoint
DROP TABLE IF EXISTS "chair_flight"."a320_learning_objectives";--> statement-breakpoint
DROP TABLE IF EXISTS "chair_flight"."a320_docs";--> statement-breakpoint
DROP TABLE IF EXISTS "chair_flight"."a320_flashcards";--> statement-breakpoint
DROP TABLE IF EXISTS "chair_flight"."a320_questions";--> statement-breakpoint
DROP TABLE IF EXISTS "chair_flight"."a320_annexes";--> statement-breakpoint
CREATE TABLE "chair_flight"."a320_chapters" (
	"id" text NOT NULL,
	"title" text NOT NULL,
	"number_of_questions" integer NOT NULL,
	CONSTRAINT "a320_chapters_id_pk" PRIMARY KEY("id")
);--> statement-breakpoint
CREATE TABLE "chair_flight"."a320_questions" (
	"id" text NOT NULL,
	"chapter" text NOT NULL,
	"annexes" text[] NOT NULL,
	"related_questions" text[] NOT NULL,
	"explanation" text NOT NULL,
	"preview" text NOT NULL,
	"template" jsonb NOT NULL,
	CONSTRAINT "a320_questions_id_pk" PRIMARY KEY("id")
);--> statement-breakpoint
CREATE TABLE "chair_flight"."a320_annexes" (
	"id" text NOT NULL,
	"href" text NOT NULL,
	"format" text NOT NULL,
	"description" text NOT NULL,
	"source" text NOT NULL,
	"questions" text[] NOT NULL,
	CONSTRAINT "a320_annexes_id_pk" PRIMARY KEY("id")
);--> statement-breakpoint
CREATE INDEX "a320_questions_chapter_index" ON "chair_flight"."a320_questions" USING btree ("chapter");
