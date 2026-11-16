CREATE TABLE "chair_flight"."profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_role_check" CHECK ("role" IN ('user', 'admin'))
);
--> statement-breakpoint
CREATE TABLE "chair_flight"."question_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_bank" text NOT NULL,
	"question_id" text NOT NULL,
	"parent_id" uuid,
	"depth" smallint NOT NULL,
	"author_id" uuid NOT NULL,
	"body" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone,
	"reviewed_by" uuid,
	CONSTRAINT "question_comments_depth_check" CHECK ("depth" BETWEEN 1 AND 3),
	CONSTRAINT "question_comments_status_check" CHECK ("status" IN ('pending', 'approved', 'rejected'))
);
--> statement-breakpoint
ALTER TABLE "chair_flight"."profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "chair_flight"."question_comments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "chair_flight"."question_comments" ADD CONSTRAINT "question_comments_parent_id_question_comments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "chair_flight"."question_comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."question_comments" ADD CONSTRAINT "question_comments_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "chair_flight"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."question_comments" ADD CONSTRAINT "question_comments_reviewed_by_profiles_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "chair_flight"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_username_index" ON "chair_flight"."profiles" USING btree (lower("username"));--> statement-breakpoint
CREATE INDEX "question_comments_question_bank_question_id_created_at_index" ON "chair_flight"."question_comments" USING btree ("question_bank","question_id","created_at");--> statement-breakpoint
CREATE INDEX "question_comments_status_created_at_index" ON "chair_flight"."question_comments" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "question_comments_author_id_index" ON "chair_flight"."question_comments" USING btree ("author_id");
