/*
  Warnings:

  - The values [USER,MANAGER,DRIVER,ADMIN] on the enum `user_roles` will be removed. If these variants are still used in the database, this will fail.
  - The values [CAR,BIKE,SUV] on the enum `vehicle_types` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "user_roles_new" AS ENUM ('user', 'manager', 'driver', 'admin');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "user_roles_new" USING ("role"::text::"user_roles_new");
ALTER TYPE "user_roles" RENAME TO "user_roles_old";
ALTER TYPE "user_roles_new" RENAME TO "user_roles";
DROP TYPE "user_roles_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "vehicle_types_new" AS ENUM ('car', 'bike', 'suv');
ALTER TABLE "vehicles" ALTER COLUMN "vehicleType" DROP DEFAULT;
ALTER TABLE "vehicles" ALTER COLUMN "vehicleType" TYPE "vehicle_types_new" USING ("vehicleType"::text::"vehicle_types_new");
ALTER TYPE "vehicle_types" RENAME TO "vehicle_types_old";
ALTER TYPE "vehicle_types_new" RENAME TO "vehicle_types";
DROP TYPE "vehicle_types_old";
ALTER TABLE "vehicles" ALTER COLUMN "vehicleType" SET DEFAULT 'car';
COMMIT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';

-- AlterTable
ALTER TABLE "vehicles" ALTER COLUMN "vehicleType" SET DEFAULT 'car';
