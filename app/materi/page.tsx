import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { CreateMaterialForm } from "@/components/materi/form-materi"
import { SiteMateri } from "@/components/materi/site-materi"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function PageMateri() {
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
                {/* <CardMateries /> */}
               
              <div className="px-4 lg:px-6">
                {/* <ChartAreaInteractive /> */}
                 <CreateMaterialForm/>
              </div>
                {/* <DataTable data={data} /> */}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}