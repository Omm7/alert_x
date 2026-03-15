-- AlterTable
ALTER TABLE "User" ADD COLUMN     "branch" TEXT NOT NULL DEFAULT 'Computer Science',
ADD COLUMN     "collegeName" TEXT NOT NULL DEFAULT 'Unknown College',
ADD COLUMN     "graduationYear" INTEGER NOT NULL DEFAULT 2025;

-- CreateTable
CREATE TABLE "EmailVerification" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerification_email_key" ON "EmailVerification"("email");

-- CreateIndex
CREATE INDEX "EmailVerification_email_expiresAt_idx" ON "EmailVerification"("email", "expiresAt");
