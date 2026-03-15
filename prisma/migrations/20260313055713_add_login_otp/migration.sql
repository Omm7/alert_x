-- AlterTable
ALTER TABLE "User" ADD COLUMN     "loginOtpExpiry" TIMESTAMP(3),
ADD COLUMN     "loginOtpHash" TEXT;
