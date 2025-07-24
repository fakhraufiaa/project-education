import { NextResponse } from "next/server"
import bcrypt from "bcrypt" 
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nama, email, password } = body

    if (!nama || !email || !password) {
      return NextResponse.json(
        { error: "Semua field harus diisi." },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar." },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        role: {
          connect: {
            id: 2, // Ganti sesuai ID role user biasa
          },
        },
      },
    })

    return NextResponse.json({ message: "Registrasi berhasil", user: newUser }, { status: 201 })
  } catch (error) {
    console.error("Register Error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
