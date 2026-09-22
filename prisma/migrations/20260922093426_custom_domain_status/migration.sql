-- CreateEnum
CREATE TYPE "DomainStatus" AS ENUM ('PENDING', 'VERIFIED');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "customDomainStatus" "DomainStatus" NOT NULL DEFAULT 'PENDING';
