import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";

const createPrismaClient = () => {
  if (typeof window !== "undefined" || process.env.NEXT_RUNTIME === "edge") {
    return null as unknown as PrismaClient;
  }

  try {
    const { Pool } = require("pg");
    const { PrismaPg } = require("@prisma/adapter-pg");
    
    // We use a dummy pool if we don't have a real connection string to satisfy Prisma 7 requirements
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } catch (error) {
    console.error("Failed to initialize Prisma with PG adapter:", error);
    // Fallback to a plain client which might still fail in Prisma 7, 
    // but at least we tried to use the adapter.
    return new PrismaClient() as any; 
  }
};

export const db = globalThis.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production" && db) globalThis.prisma = db;
