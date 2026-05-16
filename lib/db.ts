import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";

const createPrismaClient = () => {
  // In the browser, we return a dummy client or null
  if (typeof window !== "undefined") {
    return null as unknown as PrismaClient;
  }

  // For Node.js (including build workers and API routes)
  try {
    // We use require to avoid bundling issues in Edge/Browser environments
    const { Pool } = require("pg");
    const { PrismaPg } = require("@prisma/adapter-pg");
    
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    
    return new PrismaClient({ adapter });
  } catch (error) {
    // If the adapter fails to load (e.g. in Edge runtime or limited build worker),
    // we still need to provide a "non-empty" config to Prisma 7 to avoid the build error.
    // We use a dummy accelerateUrl or adapter to satisfy the constructor check.
    
    console.warn("Prisma adapter could not be initialized, using fallback config.");
    
    return new PrismaClient({
      // @ts-ignore - Using accelerateUrl as a dummy fallback to satisfy Prisma 7 requirements
      // when the real adapter is unavailable (e.g. during Edge middleware evaluation)
      accelerateUrl: "prisma://aws-us-east-1.prisma-data.com/?api_key=dummy"
    } as any);
  }
};

export const db = globalThis.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production" && db) globalThis.prisma = db;
