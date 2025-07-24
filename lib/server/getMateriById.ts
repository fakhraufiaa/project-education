// lib/server/getMateriById.ts
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

export async function getMateriById(id: number) {
  return prisma.materi.findUnique({
    where: { id },
    include: { category: true },
  })
}
