import { NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import fs from "fs"

const prisma = new PrismaClient()

async function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.formData()

    const title = data.get("courseName") as string
    const description = data.get("description") as string
    const link = data.get("link") as string
    const categoryId = parseInt(data.get("categoryId") as string)

    if (!title || !description || isNaN(categoryId)) {
      return NextResponse.json({ message: "Field wajib diisi" }, { status: 400 })
    }

    // Handle image (optional)
    const image = data.get("image") as File | null
    let imagePath = null
    if (image && image.size > 0) {
      if (!image.type.startsWith("image/")) {
        return NextResponse.json({ message: "File gambar tidak valid" }, { status: 400 })
      }
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${Date.now()}-${image.name}`
      const dir = path.join(process.cwd(), "public/uploads/image")
      await ensureDir(dir)
      const filePath = path.join(dir, fileName)
      await writeFile(filePath, buffer)
      imagePath = `/image/${fileName}`
    }

    // Handle folder (optional)
    const folder = data.get("folder") as File | null
    let folderPath = null
    if (folder && folder.size > 0) {
      const bytes = await folder.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${Date.now()}-${folder.name}`
      const dir = path.join(process.cwd(), "public/uploads/file")
      await ensureDir(dir)
      const filePath = path.join(dir, fileName)
      await writeFile(filePath, buffer)
      folderPath = `/file/${fileName}`
    }

    // Handle audio (optional)
    const audio = data.get("audio") as File | null
    let radioPath = null
    if (audio && audio.size > 0) {
      if (!audio.type.startsWith("audio/")) {
        return NextResponse.json({ message: "File audio tidak valid" }, { status: 400 })
      }
      const bytes = await audio.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${Date.now()}-${audio.name}`
      const dir = path.join(process.cwd(), "public/uploads/audio")
      await ensureDir(dir)
      const filePath = path.join(dir, fileName)
      await writeFile(filePath, buffer)
      radioPath = `/audio/${fileName}`
    }

    // Simpan ke database
    const result = await prisma.materi.create({
      data: {
        title,
        description,
        link,
        image: imagePath,
        folder: folderPath,
        radio: radioPath,
        categoryId,
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error saat upload materi:", error)
    return NextResponse.json({ message: "Gagal upload materi" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  // Mengambil semua materi, hanya id saja
  const materi = await prisma.materi.findMany({
    select: { 
      id: true, 
      title: true, 
      category: { select: {name: true}
    } 
  },
  })
  return NextResponse.json(materi)
}
