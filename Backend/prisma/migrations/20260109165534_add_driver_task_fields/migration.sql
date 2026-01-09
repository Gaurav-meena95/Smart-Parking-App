-- CreateEnum
CREATE TYPE "task_types" AS ENUM ('PARK', 'RETRIEVE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "parking_status" ADD VALUE 'pending';
ALTER TYPE "parking_status" ADD VALUE 'in_progress';

-- AlterTable
ALTER TABLE "parkings" ADD COLUMN     "assignedAt" TIMESTAMP(3),
ADD COLUMN     "parkingSlot" TEXT,
ADD COLUMN     "taskType" "task_types" NOT NULL DEFAULT 'PARK';
