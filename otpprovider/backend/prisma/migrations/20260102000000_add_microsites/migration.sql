-- CreateEnum
CREATE TYPE "SiteStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "MicroSite" (
    "id" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "metaDescription" TEXT,
    "status" "SiteStatus" NOT NULL DEFAULT 'DRAFT',
    "htmlContent" TEXT NOT NULL,
    "customCss" TEXT,
    "customJs" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MicroSite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MicroSite_subdomain_key" ON "MicroSite"("subdomain");

-- AddForeignKey
ALTER TABLE "MicroSite" ADD CONSTRAINT "MicroSite_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
