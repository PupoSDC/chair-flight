CREATE TABLE "chair_flight"."atpl_learning_objective_courses" (
	"learning_objective_id" text NOT NULL,
	"course_id" text NOT NULL,
	CONSTRAINT "atpl_learning_objective_courses_learning_objective_id_course_id_pk" PRIMARY KEY("learning_objective_id","course_id")
);--> statement-breakpoint
CREATE TABLE "chair_flight"."atpl_question_learning_objectives" (
	"question_id" text NOT NULL,
	"learning_objective_id" text NOT NULL,
	CONSTRAINT "atpl_question_learning_objectives_question_id_learning_objective_id_pk" PRIMARY KEY("question_id","learning_objective_id")
);--> statement-breakpoint
CREATE TABLE "chair_flight"."atpl_questions_to_questions" (
	"question_id" text NOT NULL,
	"related_question_id" text NOT NULL,
	CONSTRAINT "atpl_questions_to_questions_question_id_related_question_id_pk" PRIMARY KEY("question_id","related_question_id")
);--> statement-breakpoint
CREATE TABLE "chair_flight"."atpl_questions_to_annexes" (
	"question_id" text NOT NULL,
	"annex_id" text NOT NULL,
	CONSTRAINT "atpl_questions_to_annexes_question_id_annex_id_pk" PRIMARY KEY("question_id","annex_id")
);--> statement-breakpoint
INSERT INTO "chair_flight"."atpl_learning_objective_courses" ("learning_objective_id", "course_id")
SELECT DISTINCT lo."id", course FROM "chair_flight"."atpl_learning_objectives" lo, unnest(lo."courses") AS course
WHERE course IN (SELECT "id" FROM "chair_flight"."atpl_courses");--> statement-breakpoint
INSERT INTO "chair_flight"."atpl_question_learning_objectives" ("question_id", "learning_objective_id")
SELECT DISTINCT q."id", lo_id FROM "chair_flight"."atpl_questions" q, unnest(q."learning_objectives") AS lo_id
WHERE lo_id IN (SELECT "id" FROM "chair_flight"."atpl_learning_objectives");--> statement-breakpoint
INSERT INTO "chair_flight"."atpl_questions_to_questions" ("question_id", "related_question_id")
SELECT DISTINCT q."id", related_id FROM "chair_flight"."atpl_questions" q, unnest(q."related_questions") AS related_id
WHERE related_id IN (SELECT "id" FROM "chair_flight"."atpl_questions");--> statement-breakpoint
INSERT INTO "chair_flight"."atpl_questions_to_annexes" ("question_id", "annex_id")
SELECT DISTINCT q."id", annex_id FROM "chair_flight"."atpl_questions" q, unnest(q."annexes") AS annex_id
WHERE annex_id IN (SELECT "id" FROM "chair_flight"."atpl_annexes");--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_learning_objectives" ALTER COLUMN "doc_id" DROP NOT NULL;--> statement-breakpoint
UPDATE "chair_flight"."atpl_learning_objectives" SET "doc_id" = NULL WHERE "doc_id" NOT IN (SELECT "id" FROM "chair_flight"."atpl_docs");--> statement-breakpoint
UPDATE "chair_flight"."atpl_learning_objectives" SET "parent_id" = NULL WHERE "parent_id" IS NOT NULL AND "parent_id" NOT IN (SELECT "id" FROM "chair_flight"."atpl_learning_objectives");--> statement-breakpoint
UPDATE "chair_flight"."atpl_docs" SET "parent_id" = NULL WHERE "parent_id" IS NOT NULL AND "parent_id" NOT IN (SELECT "id" FROM "chair_flight"."atpl_docs");--> statement-breakpoint
UPDATE "chair_flight"."atpl_docs" SET "subject" = NULL WHERE "subject" IS NOT NULL AND "subject" NOT IN (SELECT "id" FROM "chair_flight"."atpl_subjects");--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_subjects" DROP COLUMN "number_of_questions";--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_learning_objectives" DROP COLUMN "courses", DROP COLUMN "number_of_questions";--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_questions" DROP COLUMN "subjects", DROP COLUMN "learning_objectives", DROP COLUMN "annexes", DROP COLUMN "related_questions";--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_annexes" DROP COLUMN "subjects", DROP COLUMN "learning_objectives", DROP COLUMN "questions", DROP COLUMN "docs";--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_docs" ADD CONSTRAINT "atpl_docs_parent_id_atpl_docs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "chair_flight"."atpl_docs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_docs" ADD CONSTRAINT "atpl_docs_subject_atpl_subjects_id_fk" FOREIGN KEY ("subject") REFERENCES "chair_flight"."atpl_subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_learning_objectives" ADD CONSTRAINT "atpl_learning_objectives_parent_id_atpl_learning_objectives_id_fk" FOREIGN KEY ("parent_id") REFERENCES "chair_flight"."atpl_learning_objectives"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_learning_objectives" ADD CONSTRAINT "atpl_learning_objectives_subject_atpl_subjects_id_fk" FOREIGN KEY ("subject") REFERENCES "chair_flight"."atpl_subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_learning_objectives" ADD CONSTRAINT "atpl_learning_objectives_doc_id_atpl_docs_id_fk" FOREIGN KEY ("doc_id") REFERENCES "chair_flight"."atpl_docs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_questions" ADD CONSTRAINT "atpl_questions_doc_id_atpl_docs_id_fk" FOREIGN KEY ("doc_id") REFERENCES "chair_flight"."atpl_docs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_learning_objective_courses" ADD CONSTRAINT "atpl_learning_objective_courses_learning_objective_id_atpl_learning_objectives_id_fk" FOREIGN KEY ("learning_objective_id") REFERENCES "chair_flight"."atpl_learning_objectives"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_learning_objective_courses" ADD CONSTRAINT "atpl_learning_objective_courses_course_id_atpl_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "chair_flight"."atpl_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_question_learning_objectives" ADD CONSTRAINT "atpl_question_learning_objectives_question_id_atpl_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "chair_flight"."atpl_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_question_learning_objectives" ADD CONSTRAINT "atpl_question_learning_objectives_learning_objective_id_atpl_learning_objectives_id_fk" FOREIGN KEY ("learning_objective_id") REFERENCES "chair_flight"."atpl_learning_objectives"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_questions_to_questions" ADD CONSTRAINT "atpl_questions_to_questions_question_id_atpl_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "chair_flight"."atpl_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_questions_to_questions" ADD CONSTRAINT "atpl_questions_to_questions_related_question_id_atpl_questions_id_fk" FOREIGN KEY ("related_question_id") REFERENCES "chair_flight"."atpl_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_questions_to_annexes" ADD CONSTRAINT "atpl_questions_to_annexes_question_id_atpl_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "chair_flight"."atpl_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_questions_to_annexes" ADD CONSTRAINT "atpl_questions_to_annexes_annex_id_atpl_annexes_id_fk" FOREIGN KEY ("annex_id") REFERENCES "chair_flight"."atpl_annexes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "atpl_learning_objectives_subject_index" ON "chair_flight"."atpl_learning_objectives" USING btree ("subject");--> statement-breakpoint
CREATE INDEX "atpl_question_learning_objectives_learning_objective_id_index" ON "chair_flight"."atpl_question_learning_objectives" USING btree ("learning_objective_id");--> statement-breakpoint
DROP TABLE IF EXISTS "chair_flight"."atpl_flashcards";
--> statement-breakpoint
CREATE TABLE "chair_flight"."atpl_external_ids" (
	"id" text PRIMARY KEY NOT NULL
);--> statement-breakpoint
CREATE TABLE "chair_flight"."atpl_questions_to_external_ids" (
	"question_id" text NOT NULL,
	"external_id" text NOT NULL,
	CONSTRAINT "atpl_questions_to_external_ids_question_id_external_id_pk" PRIMARY KEY("question_id","external_id")
);--> statement-breakpoint
INSERT INTO "chair_flight"."atpl_external_ids" ("id")
SELECT DISTINCT external_id FROM "chair_flight"."atpl_questions" q, unnest(q."external_ids") AS external_id;--> statement-breakpoint
INSERT INTO "chair_flight"."atpl_questions_to_external_ids" ("question_id", "external_id")
SELECT DISTINCT q."id", external_id FROM "chair_flight"."atpl_questions" q, unnest(q."external_ids") AS external_id;--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_questions" DROP COLUMN "external_ids";--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_questions" RENAME COLUMN "variant" TO "template";--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_questions_to_external_ids" ADD CONSTRAINT "atpl_questions_to_external_ids_question_id_atpl_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "chair_flight"."atpl_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_questions_to_external_ids" ADD CONSTRAINT "atpl_questions_to_external_ids_external_id_atpl_external_ids_id_fk" FOREIGN KEY ("external_id") REFERENCES "chair_flight"."atpl_external_ids"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "atpl_questions_to_external_ids_external_id_index" ON "chair_flight"."atpl_questions_to_external_ids" USING btree ("external_id");
