/*
  Warnings:

  - You are about to drop the column `baseAmount` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `fees` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `taxes` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Quotation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "baseAmount",
DROP COLUMN "fees",
DROP COLUMN "taxes",
DROP COLUMN "totalAmount",
ADD COLUMN     "exchangeRate" DECIMAL(10,4) NOT NULL DEFAULT 0,
ADD COLUMN     "financialExpenseBs" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "financialExpenseUSD" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "managementServiceBs" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "managementServicePercentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "totalInBs" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "valueInBs" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "valueToSendUSD" DECIMAL(15,2) NOT NULL DEFAULT 0;
