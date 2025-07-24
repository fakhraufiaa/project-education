import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const id = Number(req.nextUrl.searchParams.get("id"))

  if (!id) {
    return NextResponse.json({ message: "ID tidak valid" }, { status: 400 })
  }

  const materi = await prisma.materi.findUnique({
    where: { id },
    include: { category: true }
  })

  return NextResponse.json({ data: materi })
}
