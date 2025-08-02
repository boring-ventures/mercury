-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "Provider_userId_idx" ON "Provider"("userId");

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
