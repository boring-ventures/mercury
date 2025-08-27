/*
  Warnings:

  - You are about to drop the column `ruc` on the `Company` table. All the data in the column will be lost.
  - The `bankingDetails` column on the `Provider` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `bankingDetails` on the `RegistrationRequest` table. All the data in the column will be lost.
  - You are about to drop the column `ruc` on the `RegistrationRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nit]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyType` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nit` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `RegistrationRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyType` to the `RegistrationRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nit` to the `RegistrationRequest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('UNIPERSONAL', 'SRL', 'SA');

-- DropIndex
DROP INDEX "Company_ruc_idx";

-- DropIndex
DROP INDEX "Company_ruc_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "ruc",
ADD COLUMN     "companyType" "CompanyType" NOT NULL,
ADD COLUMN     "nit" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Provider" DROP COLUMN "bankingDetails",
ADD COLUMN     "bankingDetails" JSONB;

-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "rejectionReason" TEXT;

-- AlterTable
ALTER TABLE "RegistrationRequest" DROP COLUMN "bankingDetails",
DROP COLUMN "ruc",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "companyType" "CompanyType" NOT NULL,
ADD COLUMN     "nit" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "rejectionCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Company_nit_key" ON "Company"("nit");

-- CreateIndex
CREATE INDEX "Company_nit_idx" ON "Company"("nit");
