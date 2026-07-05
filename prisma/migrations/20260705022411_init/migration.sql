-- CreateTable
CREATE TABLE "forms" (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "equipment_labels" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "equipment_images" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "netid" TEXT,
    "title" TEXT,
    "category" TEXT,
    "description" TEXT,
    "equipment_images" TEXT[],
    "equipment_labels" TEXT[],
    "checkout_responses" TEXT[],
    "due_date" DATE,
    "due_time" TIMETZ(6),
    "checkout_staff" TEXT,
    "checkin_responses" TEXT[],
    "checkin_staff" TEXT,
    "parts_working" BOOLEAN,
    "checkin_description" TEXT,
    "status" TEXT NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);
