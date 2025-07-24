import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import bcrypt from "bcrypt";
import { sessionOptions, UserSession } from "@/lib/session";
import { getIronSession } from "iron-session";

const prisma = new PrismaClient();
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true }, // pastikan nama relasinya sesuai schema
    });

    if (!user) {
      return NextResponse.json({ error: "Email tidak ditemukan." }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Password salah." }, { status: 401 });
    }

    const res = NextResponse.json({ message: "Login berhasil" });
    const session = await getIronSession<UserSession>(request, res, sessionOptions);

    session.id = user.id;
    session.nama = user.nama ?? ""; // pastikan field `nama` memang ada dan tidak null
    session.email = user.email;
    session.isAdmin = user.role?.roleType === "admin"; // roleType dari enum

    await session.save();

    return res;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
