// app/api/material/delete/[id]/route.ts
import { NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const pathSegments = url.pathname.split("/")
    const materiId = Number(pathSegments[pathSegments.length - 1])

    const roleId = req.headers.get("x-role-id")

    if (roleId !== "1") {
      return NextResponse.json(
        { message: "Akses ditolak. Hanya admin yang bisa menghapus." },
        { status: 403 }
      )
    }

    if (isNaN(materiId)) {
      return NextResponse.json(
        { message: "ID materi tidak valid" },
        { status: 400 }
      )
    }

    await prisma.materi.delete({
      where: { id: materiId },
    })

    return NextResponse.json({ message: "Materi berhasil dihapus" })
  } catch (error) {
    console.error("[DELETE ERROR]", error)
    return NextResponse.json(
      { message: "Gagal menghapus materi" },
      { status: 500 }
    )
  }
}
