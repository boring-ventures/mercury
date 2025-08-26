-- Migration: Add new payment statuses for complete payment workflow
-- This migration adds new statuses to handle the complete payment review and provider payment process

-- Add new PaymentStatus values
ALTER TYPE "PaymentStatus" ADD VALUE 'PENDING_REVIEW';
ALTER TYPE "PaymentStatus" ADD VALUE 'APPROVED';
ALTER TYPE "PaymentStatus" ADD VALUE 'PROVIDER_PAID';
ALTER TYPE "PaymentStatus" ADD VALUE 'FINALIZED';

-- Add new DocumentType for provider payment proof
ALTER TYPE "DocumentType" ADD VALUE 'COMPROBANTE_PAGO_PROVEEDOR';

-- Add new ContractStatus for payment workflow
ALTER TYPE "ContractStatus" ADD VALUE 'PAYMENT_PENDING';
ALTER TYPE "ContractStatus" ADD VALUE 'PAYMENT_REVIEWED';
ALTER TYPE "ContractStatus" ADD VALUE 'PROVIDER_PAID';
ALTER TYPE "ContractStatus" ADD VALUE 'PAYMENT_COMPLETED';

-- Add comment explaining the new workflow
COMMENT ON TYPE "PaymentStatus" IS 'Payment workflow: PENDING -> PENDING_REVIEW -> APPROVED -> PROVIDER_PAID -> FINALIZED';
COMMENT ON TYPE "ContractStatus" IS 'Contract workflow: DRAFT -> COMPLETED -> PAYMENT_PENDING -> PAYMENT_REVIEWED -> PROVIDER_PAID -> PAYMENT_COMPLETED';
