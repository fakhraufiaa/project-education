import { getIronSession } from "iron-session"
import { NextResponse } from "next/server"
import { sessionOptions, UserSession } from "@/lib/session"

export async function POST(req: Request) {
  const res = new NextResponse()
  const session = await getIronSession<UserSession>(req, res, sessionOptions)

  await session.destroy()

  // ⬇️ return response yg sudah menghapus session cookie
  return new NextResponse(JSON.stringify({ message: "Logout berhasil" }), {
    status: 200,
    headers: res.headers, // ⬅️ penting! bawa header cookie hasil destroy
  })
}
