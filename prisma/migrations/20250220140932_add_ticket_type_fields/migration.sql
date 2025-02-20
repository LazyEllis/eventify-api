/*
  Warnings:

  - Added the required column `saleEndDate` to the `TicketType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saleStartDate` to the `TicketType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TicketType" ADD COLUMN     "maxPerUser" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "saleEndDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "saleStartDate" TIMESTAMP(3) NOT NULL;
