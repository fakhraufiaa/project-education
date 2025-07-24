// app/api/material/list-all/route.ts
import { NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

export async function GET() {
  const materi = await prisma.materi.findMany({
    where: { approved: true },
    include: { category: true },
  })

  return NextResponse.json({ data: materi })
}
