// app/api/comments/route.ts
import { PrismaClient } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const { content, materiId, userId } = body;

  const comment = await prisma.comment.create({
    data: { content, materiId, userId }
  });

  return NextResponse.json(comment);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const materiId = Number(url.searchParams.get("materiId"));

  const comments = await prisma.comment.findMany({
    where: { materiId },
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(comments);
}
