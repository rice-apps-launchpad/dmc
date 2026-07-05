-- Convert the response columns from text[] to boolean[] in place.
-- The USING casts preserve existing rows ("true"/"false" strings become booleans),
-- unlike the drop-and-recreate Prisma generates by default.
ALTER TABLE "submissions"
  ALTER COLUMN "checkout_responses" SET DATA TYPE BOOLEAN[] USING "checkout_responses"::boolean[],
  ALTER COLUMN "checkin_responses" SET DATA TYPE BOOLEAN[] USING "checkin_responses"::boolean[];
