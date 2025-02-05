-- CreateEnum
CREATE TYPE "LpoRejected" AS ENUM ('NO', 'YES');

-- AlterTable
ALTER TABLE "Lpo" ADD COLUMN     "rejected" "LpoRejected" NOT NULL DEFAULT 'NO';
