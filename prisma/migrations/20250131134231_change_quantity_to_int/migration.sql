/*
  Warnings:

  - You are about to drop the column `amount` on the `SupplyItem` table. All the data in the column will be lost.
  - You are about to alter the column `quantity` on the `SupplyItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "SupplyItem" DROP COLUMN "amount",
ALTER COLUMN "quantity" SET DATA TYPE INTEGER;
