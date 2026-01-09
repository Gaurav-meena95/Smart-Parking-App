-- CreateEnum
CREATE TYPE "approval_status" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "approvalStatus" "approval_status" DEFAULT 'pending';
