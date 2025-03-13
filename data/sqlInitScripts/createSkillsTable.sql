CREATE TABLE "public"."Skills" (
    "id" integer GENERATED ALWAYS AS IDENTITY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unlocked" BOOLEAN DEFAULT FALSE,
    "subskills" TEXT,
    PRIMARY KEY ("id")
);