"use client"

import { useEffect, useState } from "react"
import {
  IconChartBar,
  IconChecklist,
  IconDatabase,
  IconFolder,
  IconInnerShadowTop,
  IconListDetails,
  IconLogin,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavSecondMain } from "./nav-second-main"
import { NavLogin } from "./nav-login"
import { url } from "inspector"

type User = {
  id: number
  name: string
  email: string
  isAdmin: boolean
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
 const [user, setUser] = useState<User | null>(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/me", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        if (data.isLoggedIn) {
          setUser(data.user) // hanya isi jika logged in
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Failed to fetch session user:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  fetchUser()
}, [])


  const isLoggedIn = !!user
  const isAdmin = user?.isAdmin

  const data = {
    user: {
      name: user?.name || "",
      email: user?.email || "",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconChartBar,
      },
      {
        title: "Materi",
        url: "/materi",
        icon: IconFolder,
      },
      {
        title: "List Materi",
        url: "/materi/kategori",
        icon: IconListDetails,
      },
      {
        title: "Kategori",
        url: "/materi/kategori/create",
        icon: IconDatabase,
      },
      {
        title: "Approval Materi",
        url: "/materi/approved",
        icon: IconChecklist,
      },
    ],
    navSecondMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconChartBar,
      },
      {
        title: "List Materi",
        url: "/materi/kategori",
        icon: IconListDetails,
      },
      {
        title: "Materi",
        url: "/materi",
        icon: IconFolder,
      },
      {
        title: "Kategori",
        url: "/materi/kategori/create",
        icon: IconDatabase,
      },
    ],
    NavLogin: [
      {
        url: "/login",
        name: "Login",
        icon: IconLogin,
      },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Education</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {isLoggedIn ? (
          isAdmin ? (
            <NavMain items={data.navMain} />
          ) : (
            <NavSecondMain items={data.navSecondMain} />
          )
        ) : (
          <>
            <NavSecondMain items={data.navSecondMain} />
            <NavLogin items={data.NavLogin} />
          </>

        )}
      </SidebarContent>

      <SidebarFooter>
        {!loading && isLoggedIn && <NavUser user={data.user} />}
      </SidebarFooter>

    </Sidebar>
  )
}
