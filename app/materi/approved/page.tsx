"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ApprovedMateri } from "@/components/materi/list-unapprov-materi"
import { SiteMateri } from "@/components/materi/site-materi"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function PageMateri() {
  const [unapprovedMateri, setUnapprovedMateri] = useState([])

  useEffect(() => {
    // Ganti URL sesuai endpoint API kamu
    fetch("/api/material?approved=false")
      .then((res) => res.json())
      .then((data) => {
        setUnapprovedMateri(data)
      })
  }, [])

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
                <ApprovedMateri data={unapprovedMateri} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}