CREATE TABLE "public"."skills" (
    "id" integer GENERATED ALWAYS AS IDENTITY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unlocked" BOOLEAN DEFAULT FALSE,
    "subskills" TEXT,
    PRIMARY KEY ("id")
);