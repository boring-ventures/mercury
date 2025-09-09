-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ContractStatus" ADD VALUE 'PAYMENT_PENDING';
ALTER TYPE "ContractStatus" ADD VALUE 'PAYMENT_REVIEWED';
ALTER TYPE "ContractStatus" ADD VALUE 'PROVIDER_PAID';
ALTER TYPE "ContractStatus" ADD VALUE 'PAYMENT_COMPLETED';

-- AlterEnum
ALTER TYPE "DocumentType" ADD VALUE 'COMPROBANTE_PAGO_PROVEEDOR';

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "documentInfo" TEXT;
