DO $$ BEGIN
 CREATE TYPE "filesystem-type" AS ENUM('FILE', 'FOLDER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user-role" AS ENUM('REGULAR', 'ADMIN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "filesystem" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ownerId" text NOT NULL,
	"parentId" uuid,
	"name" text DEFAULT 'root',
	"url" text,
	"type" "filesystem-type",
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"lastModified" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"username" text PRIMARY KEY NOT NULL,
	"userRole" "user-role" DEFAULT 'REGULAR' NOT NULL,
	"email" text NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text,
	"profilePic" text,
	"password" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"lastModified" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "parentIdIndx" ON "filesystem" ("parentId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "uniqueNameCompositeIndx" ON "filesystem" ("parentId","name","type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nameSearchIndx" ON "filesystem" ("name","ownerId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_email_unqiue_indx" ON "user" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "filesystem" ADD CONSTRAINT "filesystem_ownerId_user_username_fk" FOREIGN KEY ("ownerId") REFERENCES "user"("username") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "filesystem" ADD CONSTRAINT "filesystem_parentId_filesystem_id_fk" FOREIGN KEY ("parentId") REFERENCES "filesystem"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
