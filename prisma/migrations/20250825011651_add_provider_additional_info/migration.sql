/*
  Warnings:

  - You are about to drop the column `financialExpenseBs` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `financialExpenseUSD` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `valueInBs` on the `Quotation` table. All the data in the column will be lost.
  - You are about to drop the column `valueToSendUSD` on the `Quotation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "additionalData" JSONB;

-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "additionalInfo" TEXT;

-- AlterTable
ALTER TABLE "Quotation" DROP COLUMN "financialExpenseBs",
DROP COLUMN "financialExpenseUSD",
DROP COLUMN "valueInBs",
DROP COLUMN "valueToSendUSD",
ADD COLUMN     "amountInBs" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "correspondentBankBs" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "correspondentBankUSD" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "swiftBankBs" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "swiftBankUSD" DECIMAL(15,2) NOT NULL DEFAULT 0;
