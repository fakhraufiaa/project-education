// app/api/me/route.ts
import { NextResponse } from "next/server"
import { getIronSession } from "iron-session"
import { sessionOptions, UserSession } from "@/lib/session"

export async function GET(request: Request) {
  const session = await getIronSession<UserSession>(
    request,
    new Response(),
    sessionOptions
  )

  if (!session?.email) {
    return NextResponse.json({ isLoggedIn: false }, { status: 200 })
  }

  return NextResponse.json(
    {
      isLoggedIn: true,
      user: {
        id: session.id,
        name: session.nama,
        email: session.email,
        isAdmin: session.isAdmin,
      },
    },
    { status: 200 }
  )
}
