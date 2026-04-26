import { PrismaClient } from "../generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL!;

const pool = new Pool({
  connectionString,
  max: 10, // max: 10 pour Neon free tier
  ssl: {
    rejectUnauthorized: false,
  },
});
const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development" // Logs en dev uniquement
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

// Typage global  pour TypeScript
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export { prisma }; //

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
