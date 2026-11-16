CREATE TABLE "chair_flight"."a320_questions_to_annexes" (
	"question_id" text NOT NULL,
	"annex_id" text NOT NULL,
	CONSTRAINT "a320_questions_to_annexes_question_id_annex_id_pk" PRIMARY KEY("question_id","annex_id")
);--> statement-breakpoint
ALTER TABLE "chair_flight"."a320_questions_to_annexes" ADD CONSTRAINT "a320_questions_to_annexes_question_id_a320_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "chair_flight"."a320_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."a320_questions_to_annexes" ADD CONSTRAINT "a320_questions_to_annexes_annex_id_a320_annexes_id_fk" FOREIGN KEY ("annex_id") REFERENCES "chair_flight"."a320_annexes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."a320_questions" DROP COLUMN "annexes";--> statement-breakpoint
ALTER TABLE "chair_flight"."a320_annexes" DROP COLUMN "questions";
