CREATE TABLE "sessionChatTable" (
	"id" serial PRIMARY KEY NOT NULL,
	"sessionId" varchar(300) NOT NULL,
	"notes" text,
	"conversion" json,
	"report" json,
	"createdBy" varchar(200),
	"createdOn" varchar(200),
	"selectedDoctor" json
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"credits" integer,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
