// app/api/categories/route.ts

import { NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma" // Sesuaikan path jika berbeda

const prisma = new PrismaClient()

// GET /api/categories → ambil semua kategori
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "asc" },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ message: "Gagal mengambil kategori" }, { status: 500 })
  }
}

// POST /api/categories → tambah kategori baru
export async function POST(req: Request) {
  const body = await req.json()
  const { name } = body

  if (!name) {
    return NextResponse.json({ message: "Nama kategori wajib diisi" }, { status: 400 })
  }

  try {
    const category = await prisma.category.create({
      data: { name },
    })

    return NextResponse.json(category)
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ message: "Kategori sudah ada" }, { status: 400 })
    }

    return NextResponse.json({ message: "Gagal menambahkan kategori" }, { status: 500 })
  }
}
