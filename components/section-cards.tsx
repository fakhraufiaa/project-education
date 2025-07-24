"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Materi = {
  id: string
  title: string
  category: {
    name: string
  }
}

export function SectionCards() {
  const [materials, setMaterials] = useState<Materi[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/material/list-all") // 🔁 endpoint list semua approved
      const json = await res.json()
      const data = Array.isArray(json.data) ? json.data : []
      setMaterials(data)
    }

    fetchData()
  }, [])

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {materials.map((materi) => (
        <Card key={materi.id} className="@container/card">
          <CardHeader>
            <CardDescription>{materi.category?.name}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {materi.title}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">Materi</Badge>
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
