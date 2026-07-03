ALTER TABLE "posts" ADD COLUMN "category" text DEFAULT 'nature' NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "tags" text[] DEFAULT ARRAY[]::text[] NOT NULL;