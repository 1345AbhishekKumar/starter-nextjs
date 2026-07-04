CREATE TABLE "uploadcare_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_id" text NOT NULL,
	"file_url" text NOT NULL,
	"file_name" text NOT NULL,
	"file_size" integer NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uploadcare_files_file_id_unique" UNIQUE("file_id")
);
--> statement-breakpoint
ALTER TABLE "uploadcare_files" ADD CONSTRAINT "uploadcare_files_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;