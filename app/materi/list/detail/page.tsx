import { AppSidebar } from "@/components/app-sidebar"
import { SiteMateri } from "@/components/materi/site-materi"
import MateriDetail from "@/components/materi/detail-materi"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

export default async function PageDetailMateri({
  params,
}: {
  params: { id: string }
}) {
  const materi = await prisma.materi.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      category: true,
    },
  })

  if (!materi) {
    return <div className="p-6">Materi tidak ditemukan.</div>
  }

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
                <MateriDetail materi={materi} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
