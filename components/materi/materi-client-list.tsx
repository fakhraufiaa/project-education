"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ListMateri } from "@/components/materi/list-materi"

interface Materi {
  id: string
  title: string
  category: {
    name: string
  }
}

export function MateriClientList() {
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
        setMateriList([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [categoryId])

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <ListMateri
      data={materiList.map((item) => ({
        id: item.id,
        name: item.title,
        category: { name: item.category.name },
      }))}
    />
  )
}
