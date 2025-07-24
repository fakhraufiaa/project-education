"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteMateri } from "@/components/materi/site-materi"
import MateriDetail from "@/components/materi/detail-materi"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface Materi {
  id: string
  title: string
  content: string
  category: {
    name: string
  }
}

export default function MateriDetailPage() {
  const params = useParams()
  const id = params?.id as string

  const [materi, setMateri] = useState<Materi | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    fetch(`/api/material/detail?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMateri(data.data ?? null)
      })
      .catch((err) => {
        console.error("Gagal fetch detail:", err)
        setMateri(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteMateri />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                {loading ? (
                  <p>Loading...</p>
                ) : materi ? (
                  <MateriDetail materi={materi} />
                ) : (
                  <p>Materi tidak ditemukan</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
