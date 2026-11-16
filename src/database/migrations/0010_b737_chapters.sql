DROP TABLE IF EXISTS "chair_flight"."b737_subjects";--> statement-breakpoint
DROP TABLE IF EXISTS "chair_flight"."b737_courses";--> statement-breakpoint
DROP TABLE IF EXISTS "chair_flight"."b737_learning_objectives";--> statement-breakpoint
DROP TABLE IF EXISTS "chair_flight"."b737_docs";--> statement-breakpoint
DROP TABLE IF EXISTS "chair_flight"."b737_flashcards";--> statement-breakpoint
DROP TABLE IF EXISTS "chair_flight"."b737_questions";--> statement-breakpoint
DROP TABLE IF EXISTS "chair_flight"."b737_annexes";--> statement-breakpoint
CREATE TABLE "chair_flight"."b737_chapters" (
	"id" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	CONSTRAINT "b737_chapters_id_pk" PRIMARY KEY("id")
);--> statement-breakpoint
CREATE TABLE "chair_flight"."b737_questions" (
	"id" text NOT NULL,
	"chapter" text NOT NULL,
	"explanation" text NOT NULL,
	"preview" text NOT NULL,
	"template" jsonb NOT NULL,
	CONSTRAINT "b737_questions_id_pk" PRIMARY KEY("id")
);--> statement-breakpoint
CREATE TABLE "chair_flight"."b737_annexes" (
	"id" text NOT NULL,
	"href" text NOT NULL,
	"format" text NOT NULL,
	"description" text NOT NULL,
	"source" text NOT NULL,
	CONSTRAINT "b737_annexes_id_pk" PRIMARY KEY("id")
);--> statement-breakpoint
CREATE TABLE "chair_flight"."b737_questions_to_questions" (
	"question_id" text NOT NULL,
	"related_question_id" text NOT NULL,
	CONSTRAINT "b737_questions_to_questions_question_id_related_question_id_pk" PRIMARY KEY("question_id","related_question_id")
);--> statement-breakpoint
CREATE TABLE "chair_flight"."b737_questions_to_annexes" (
	"question_id" text NOT NULL,
	"annex_id" text NOT NULL,
	CONSTRAINT "b737_questions_to_annexes_question_id_annex_id_pk" PRIMARY KEY("question_id","annex_id")
);--> statement-breakpoint
ALTER TABLE "chair_flight"."b737_questions" ADD CONSTRAINT "b737_questions_chapter_b737_chapters_id_fk" FOREIGN KEY ("chapter") REFERENCES "chair_flight"."b737_chapters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."b737_questions_to_questions" ADD CONSTRAINT "b737_questions_to_questions_question_id_b737_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "chair_flight"."b737_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."b737_questions_to_questions" ADD CONSTRAINT "b737_questions_to_questions_related_question_id_b737_questions_id_fk" FOREIGN KEY ("related_question_id") REFERENCES "chair_flight"."b737_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."b737_questions_to_annexes" ADD CONSTRAINT "b737_questions_to_annexes_question_id_b737_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "chair_flight"."b737_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."b737_questions_to_annexes" ADD CONSTRAINT "b737_questions_to_annexes_annex_id_b737_annexes_id_fk" FOREIGN KEY ("annex_id") REFERENCES "chair_flight"."b737_annexes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "b737_questions_chapter_index" ON "chair_flight"."b737_questions" USING btree ("chapter");
