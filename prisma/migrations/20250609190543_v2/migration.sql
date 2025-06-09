/*
  Warnings:

  - The `status` column on the `contratos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `cotizaciones` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `pagos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `email` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `profiles` table. All the data in the column will be lost.
  - The `status` column on the `solicitudes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `pagos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('DRAFT', 'PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "QuotationStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('DEPOSIT', 'PARTIAL', 'FINAL', 'REFUND');

-- DropIndex
DROP INDEX "profiles_email_idx";

-- DropIndex
DROP INDEX "profiles_email_key";

-- AlterTable
ALTER TABLE "contratos" DROP COLUMN "status",
ADD COLUMN     "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "cotizaciones" DROP COLUMN "status",
ADD COLUMN     "status" "QuotationStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "pagos" DROP COLUMN "type",
ADD COLUMN     "type" "PaymentType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "email",
DROP COLUMN "password";

-- AlterTable
ALTER TABLE "solicitudes" DROP COLUMN "status",
ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "ContratoStatus";

-- DropEnum
DROP TYPE "CotizacionStatus";

-- DropEnum
DROP TYPE "PagoStatus";

-- DropEnum
DROP TYPE "PagoType";

-- DropEnum
DROP TYPE "SolicitudStatus";

-- CreateIndex
CREATE INDEX "contratos_status_idx" ON "contratos"("status");

-- CreateIndex
CREATE INDEX "cotizaciones_status_idx" ON "cotizaciones"("status");

-- CreateIndex
CREATE INDEX "pagos_status_idx" ON "pagos"("status");

-- CreateIndex
CREATE INDEX "solicitudes_status_idx" ON "solicitudes"("status");
