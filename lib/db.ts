import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL;

const createPrismaClient = () => {
  // Standard PrismaClient for non-postgres or development without special adapters
  if (!connectionString || connectionString.includes("localhost") || process.env.NODE_ENV === "development") {
    return new PrismaClient();
  }

  // Production with PostgreSQL adapter (Node.js only)
  if (typeof window === "undefined" && process.env.NEXT_RUNTIME !== "edge") {
    try {
      // Dynamic import to keep Edge runtime happy
      const { Pool } = require("pg");
      const { PrismaPg } = require("@prisma/adapter-pg");
      
      const pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      return new PrismaClient({ adapter });
    } catch (error) {
      console.error("Prisma adapter load failed, falling back to default:", error);
      return new PrismaClient();
    }
  }

  return new PrismaClient();
};

export const db = globalThis.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
