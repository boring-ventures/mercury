/*
  Warnings:

  - You are about to drop the column `user_id` on the `companies` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_user_id_fkey";

-- DropIndex
DROP INDEX "companies_user_id_idx";

-- DropIndex
DROP INDEX "companies_user_id_key";

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "company_id" TEXT;

-- CreateIndex
CREATE INDEX "profiles_company_id_idx" ON "profiles"("company_id");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
