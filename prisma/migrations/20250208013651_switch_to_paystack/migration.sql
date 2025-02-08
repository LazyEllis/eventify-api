-- AlterEnum
ALTER TYPE "TicketStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "paymentReference" TEXT;
