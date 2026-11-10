import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function withDbRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    const msg = String(err?.message || "");
    const code = String(err?.code || "");
    const isTransient =
      code === "P1001" ||
      code === "P1002" ||
      code === "P1008" ||
      code === "P1017" ||
      msg.includes("Can't reach database server") ||
      msg.includes("Server has closed the connection") ||
      msg.includes("Connection reset");
    if (!isTransient) throw err;
    await new Promise((resolve) => setTimeout(resolve, 150));
    return await fn();
  }
}
