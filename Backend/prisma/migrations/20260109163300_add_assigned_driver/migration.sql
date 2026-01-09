-- AlterTable
ALTER TABLE "parkings" ADD COLUMN     "assignedDriverId" TEXT;

-- AddForeignKey
ALTER TABLE "parkings" ADD CONSTRAINT "parkings_assignedDriverId_fkey" FOREIGN KEY ("assignedDriverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
