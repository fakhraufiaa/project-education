import { Suspense } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteMateri } from "@/components/materi/site-materi"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { MateriClientList } from "@/components/materi/materi-client-list" // komponen client

export default function MateriListPage() {
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
                <Suspense fallback={<p>Memuat data...</p>}>
                  <MateriClientList />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
