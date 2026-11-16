CREATE TABLE "chair_flight"."comment_votes" (
	"comment_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"value" smallint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "comment_votes_comment_id_user_id_pk" PRIMARY KEY("comment_id","user_id"),
	CONSTRAINT "comment_votes_value_check" CHECK ("value" IN (-1, 1))
);
--> statement-breakpoint
ALTER TABLE "chair_flight"."comment_votes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "chair_flight"."comment_votes" ADD CONSTRAINT "comment_votes_comment_id_question_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "chair_flight"."question_comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chair_flight"."comment_votes" ADD CONSTRAINT "comment_votes_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "chair_flight"."profiles"("id") ON DELETE cascade ON UPDATE no action;
