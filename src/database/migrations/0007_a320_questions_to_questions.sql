CREATE TABLE "chair_flight"."a320_questions_to_questions" (
	"question_id" text NOT NULL,
	"related_question_id" text NOT NULL,
	CONSTRAINT "a320_questions_to_questions_question_id_related_question_id_pk" PRIMARY KEY("question_id","related_question_id")
);--> statement-breakpoint
ALTER TABLE "chair_flight"."a320_questions_to_questions" ADD CONSTRAINT "a320_questions_to_questions_question_id_a320_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "chair_flight"."a320_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."a320_questions_to_questions" ADD CONSTRAINT "a320_questions_to_questions_related_question_id_a320_questions_id_fk" FOREIGN KEY ("related_question_id") REFERENCES "chair_flight"."a320_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."a320_questions" DROP COLUMN "related_questions";
