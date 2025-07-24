// app/materi/list/page.tsx (Client Component)
"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteMateri } from "@/components/materi/site-materi"
import { ListMateri } from "@/components/materi/list-materi"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface Materi {
  id: string
  title: string
  category: {
    name: string
  }
}

export default function MateriListPage() {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get("category")

  const [materiList, setMateriList] = useState<Materi[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  if (!categoryId) return

  fetch(`/api/material/list?category=${categoryId}`)
    .then((res) => res.json())
    .then((data) => {
      const result = Array.isArray(data.data) ? data.data : []
      setMateriList(result)
    })
    .catch((err) => {
      console.error("Gagal mengambil data:", err)
      setMateriList([]) // fallback supaya tidak error
    })
    .finally(() => {
      setLoading(false)
    })
}, [categoryId])


  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
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
                ) : (
                  <ListMateri
                    data={materiList.map((item) => ({
                      id: item.id,
                      name: item.title,
                      category: { name: item.category.name }, // Sesuai tipe props
                    }))}

                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
