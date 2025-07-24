"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { IconFile } from "@tabler/icons-react"

export default function MateriDetail({ materi }: { materi: any }) {
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me")
        const data = await res.json()
        if (data.isLoggedIn) {
          setUser(data.user)
        }
      } catch (err) {
        console.error("Gagal fetch user", err)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch(`/api/comments?materiId=${materi.id}`)
      const data = await res.json()
      setComments(data)
    }
    fetchComments()
  }, [materi.id])

  const handleSubmit = async () => {
    if (!newComment.trim() || !user) return
    setLoading(true)
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: newComment,
        userId: user.id,
        materiId: materi.id,
      }),
    })
    setNewComment("")
    const res = await fetch(`/api/comments?materiId=${materi.id}`)
    const data = await res.json()
    setComments(data)
    setLoading(false)
  }

  const getYoutubeEmbed = (link: string) => {
    const match = link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Detail Materi */}
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold">{materi.title}</h1>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <p className="text-sm text-muted-foreground">{materi.description}</p>

            {/* YouTube Embed */}
            {materi.link && getYoutubeEmbed(materi.link) && (
              <div className="aspect-video w-full">
                <iframe
                  src={getYoutubeEmbed(materi.link)!}
                  title="YouTube video"
                  allowFullScreen
                  className="w-full h-full rounded-md"
                />
              </div>
            )}

            {/* Audio Player */}
            {materi.radio && (
              <div>
                <p className="text-sm font-medium mb-1">Audio</p>
                <audio controls className="w-full">
                  <source src={`/uploads/${materi.radio}`} type="audio/mpeg" />
                  Browser tidak mendukung audio player.
                </audio>
              </div>
            )}

            {/* Link + File */}
            <div className="flex items-center space-x-3">
              {materi.link && !getYoutubeEmbed(materi.link) && (
                <a href={materi.link} target="_blank" rel="noreferrer">
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Lihat Link
                  </Button>
                </a>
              )}
              {materi.folder && (
                <a
                  href={`/uploads/${materi.folder}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <IconFile />
                  <span>{materi.folder}</span>
                </a>
              )}
            </div>
          </div>

          {/* Image
          <div className="w-full flex items-center justify-center">
            {materi.image ? (
              <Image
                src={materi.image}
                alt="materi image"
                width={160}
                height={160}
                className="object-cover rounded-md"
              />
            ) : (
              <div className="w-40 h-40 border rounded-md flex items-center justify-center text-sm text-muted-foreground">
                Tidak ada gambar
              </div>
            )}
          </div> */}
        </CardContent>
      </Card>

      {/* Komentar */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Tambahkan Komentar</h2>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="flex gap-2 mb-4">
              <Textarea
                placeholder="Tambahkan komentar..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSubmit} disabled={loading}>
                <Plus size={16} />
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mb-4">Login untuk menambahkan komentar.</p>
          )}

          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="border rounded-md p-3">
                <p className="text-sm font-semibold">{comment.user?.nama || "User"}</p>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-sm text-muted-foreground">Belum ada komentar.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
