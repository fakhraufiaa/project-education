"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

type Category = {
  id: number
  name: string
}

export function CardCategoriesMateri() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" }) // pastikan ini route GET
        const data = await res.json()
        setCategories(data)
      } catch (error) {
        console.error("Gagal mengambil kategori:", error)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {categories.map((cat) => (
        <Card key={cat.id} className="@container/card hover:shadow-md transition">
          <CardHeader>
            <Link href={`/materi/list?category=${cat.id}`}>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl hover:text-primary hover:underline">
                {cat.name}
              </CardTitle>
            </Link>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
