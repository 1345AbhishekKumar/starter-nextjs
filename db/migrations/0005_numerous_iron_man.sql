CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"template_id" text NOT NULL,
	"variables" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"priority" text DEFAULT 'normal' NOT NULL,
	"delivery" jsonb DEFAULT '{"inApp":true,"email":false,"push":false}'::jsonb NOT NULL,
	"deduplication_key" text,
	"read_at" timestamp with time zone,
	"archived_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"deliver_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "notifications_user_id_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notifications_user_unread_idx" ON "notifications" USING btree ("user_id","read_at");--> statement-breakpoint
CREATE INDEX "notifications_deliver_at_idx" ON "notifications" USING btree ("deliver_at");--> statement-breakpoint
CREATE INDEX "notifications_dedup_idx" ON "notifications" USING btree ("user_id","deduplication_key","created_at");--> statement-breakpoint
CREATE INDEX "posts_user_id_idx" ON "posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "uploadcare_files_user_id_idx" ON "uploadcare_files" USING btree ("user_id");