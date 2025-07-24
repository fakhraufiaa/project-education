import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const categoryId = parseInt(params.id);

  if (isNaN(categoryId)) {
    return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
  }

  try {
    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    console.error("Gagal hapus kategori:", error);
    return NextResponse.json({ message: "Gagal hapus kategori" }, { status: 500 });
  }
}
