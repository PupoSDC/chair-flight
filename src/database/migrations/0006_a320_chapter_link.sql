ALTER TABLE "chair_flight"."a320_chapters" DROP COLUMN "number_of_questions";--> statement-breakpoint
ALTER TABLE "chair_flight"."a320_questions" ADD CONSTRAINT "a320_questions_chapter_a320_chapters_id_fk" FOREIGN KEY ("chapter") REFERENCES "chair_flight"."a320_chapters"("id") ON DELETE no action ON UPDATE no action;
