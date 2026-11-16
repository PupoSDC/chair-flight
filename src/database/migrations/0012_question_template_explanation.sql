UPDATE "chair_flight"."atpl_questions" SET "template" = jsonb_set("template", '{explanation}', to_jsonb("explanation"));--> statement-breakpoint
ALTER TABLE "chair_flight"."atpl_questions" DROP COLUMN "explanation";--> statement-breakpoint
UPDATE "chair_flight"."a320_questions" SET "template" = jsonb_set("template", '{explanation}', to_jsonb("explanation"));--> statement-breakpoint
ALTER TABLE "chair_flight"."a320_questions" DROP COLUMN "explanation";--> statement-breakpoint
UPDATE "chair_flight"."b737_questions" SET "template" = jsonb_set("template", '{explanation}', to_jsonb("explanation"));--> statement-breakpoint
ALTER TABLE "chair_flight"."b737_questions" DROP COLUMN "explanation";--> statement-breakpoint
