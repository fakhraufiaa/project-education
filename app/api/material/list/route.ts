// app/api/materi/list/route.ts
import { NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const categoryId = parseInt(searchParams.get("category") || "")

  if (!categoryId) {
    return NextResponse.json({ message: "Kategori tidak valid" }, { status: 400 })
  }

  const materi = await prisma.materi.findMany({
    where: {
      categoryId,
      approved: true, // ✅ hanya ambil yang sudah disetujui
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return NextResponse.json({ data: materi }) // ubah dari hanya "materi"

}
