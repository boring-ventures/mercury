-- CreateEnum
CREATE TYPE "CashierTransactionStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'CAJERO';

-- CreateTable
CREATE TABLE "cashier_accounts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dailyLimitBs" DECIMAL(15,2) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cashier_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cashier_assignments" (
    "id" TEXT NOT NULL,
    "cashierId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cashier_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cashier_transactions" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "cashierId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "assignedAmountBs" DECIMAL(15,2) NOT NULL,
    "suggestedExchangeRate" DECIMAL(10,4) NOT NULL,
    "expectedUsdt" DECIMAL(15,6) NOT NULL,
    "deliveredUsdt" DECIMAL(15,6),
    "status" "CashierTransactionStatus" NOT NULL DEFAULT 'PENDING',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cashier_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cashier_assignments_cashierId_idx" ON "cashier_assignments"("cashierId");

-- CreateIndex
CREATE INDEX "cashier_assignments_accountId_idx" ON "cashier_assignments"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "cashier_assignments_cashierId_accountId_key" ON "cashier_assignments"("cashierId", "accountId");

-- CreateIndex
CREATE INDEX "cashier_transactions_quotationId_idx" ON "cashier_transactions"("quotationId");

-- CreateIndex
CREATE INDEX "cashier_transactions_cashierId_idx" ON "cashier_transactions"("cashierId");

-- CreateIndex
CREATE INDEX "cashier_transactions_accountId_idx" ON "cashier_transactions"("accountId");

-- CreateIndex
CREATE INDEX "cashier_transactions_status_idx" ON "cashier_transactions"("status");

-- AddForeignKey
ALTER TABLE "cashier_assignments" ADD CONSTRAINT "cashier_assignments_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashier_assignments" ADD CONSTRAINT "cashier_assignments_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "cashier_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashier_transactions" ADD CONSTRAINT "cashier_transactions_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashier_transactions" ADD CONSTRAINT "cashier_transactions_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashier_transactions" ADD CONSTRAINT "cashier_transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "cashier_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
