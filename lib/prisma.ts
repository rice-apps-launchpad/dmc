import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  // TimeZone=UTC is required for correctness: the driver adapter exchanges
  // timestamps as naive UTC strings (no offset), so any other session zone
  // shifts every Date parameter Prisma sends — including @default(now()) —
  // by the UTC offset when stored.
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL!, options: '-c TimeZone=UTC' })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
