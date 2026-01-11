/*
  Warnings:

  - The values [RETRIEVE] on the enum `task_types` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "task_types_new" AS ENUM ('park', 'Retrieve');
ALTER TABLE "parkings" ALTER COLUMN "taskType" DROP DEFAULT;
ALTER TABLE "parkings" ALTER COLUMN "taskType" TYPE "task_types_new" USING ("taskType"::text::"task_types_new");
ALTER TYPE "task_types" RENAME TO "task_types_old";
ALTER TYPE "task_types_new" RENAME TO "task_types";
DROP TYPE "task_types_old";
ALTER TABLE "parkings" ALTER COLUMN "taskType" SET DEFAULT 'park';
COMMIT;
