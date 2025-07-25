import { NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import { supabase } from "@/lib/supabase"

const prisma = new PrismaClient()

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

    const uploadToSupabase = async (file: File | null, folder: string) => {
      if (!file || file.size === 0) return null
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}.${ext}`
      const path = `${folder}/${fileName}`

      const { error } = await supabase.storage.from('uploads').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })

      if (error) throw error

      const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(path)
      return publicUrlData?.publicUrl || null
    }

    const imagePath = await uploadToSupabase(data.get("image") as File, "image")
    const folderPath = await uploadToSupabase(data.get("folder") as File, "file")
    const radioPath = await uploadToSupabase(data.get("audio") as File, "audio")

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
