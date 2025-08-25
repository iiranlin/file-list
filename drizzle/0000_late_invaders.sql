CREATE TABLE "audio_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"artist" varchar(255) NOT NULL,
	"duration" varchar(20) NOT NULL,
	"genre" varchar(100) NOT NULL,
	"src" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "image_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"src" text NOT NULL,
	"category" varchar(100) NOT NULL,
	"tags" text NOT NULL,
	"upload_date" varchar(20) NOT NULL,
	"dimensions" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tutorials" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"category" varchar(100) NOT NULL,
	"difficulty" varchar(20) NOT NULL,
	"read_time" varchar(50) NOT NULL,
	"author" varchar(255) NOT NULL,
	"publish_date" varchar(20) NOT NULL,
	"tags" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "video_files" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"duration" varchar(20) NOT NULL,
	"category" varchar(100) NOT NULL,
	"thumbnail" text NOT NULL,
	"src" text NOT NULL,
	"views" varchar(20) NOT NULL,
	"upload_date" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
