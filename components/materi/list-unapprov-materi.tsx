"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Material = {
  id: number
  category: {
    name: string
  } | null
  title: string
  approved?: boolean
}

export function ApprovedMateri({ data }: { data: Material[] }) {
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [materialList, setMaterialList] = useState<Material[]>(data)

  const router = useRouter()

  const handleApprove = async (id: number) => {
    setLoadingId(id)

    try {
      const res = await fetch(`/api/material/approve/${id}`, {
        method: "POST",
        headers: {
          "x-user-id": "1", // Sesuaikan dengan user login
          "x-role-id": "1"  // Hanya admin bisa approve
        },
      })

      const result = await res.json()

      if (!res.ok) {
        alert(result.message || "Gagal meng-approve materi")
      } else {
        alert("Materi berhasil di-approve")

        // Update state lokal
        setMaterialList((prev) =>
          prev.map((mat) =>
            mat.id === id ? { ...mat, approved: true } : mat
          )
        )

        // Refresh dari server juga (untuk sinkronisasi tambahan)
        router.refresh()
      }

    } catch (error) {
      console.error(error)
      alert("Terjadi kesalahan saat approve")
    } finally {
      setLoadingId(null)
    }
  }

  const handleDelete = async (id: number) => {
  const konfirmasi = confirm("Yakin ingin menghapus materi ini?")
  if (!konfirmasi) return

  setLoadingId(id)

  try {
    const res = await fetch(`/api/material/deleted/${id}`, {
      method: "GET",
      headers: {
        "x-role-id": "1", // Hanya admin bisa delete
      },
    })

    const result = await res.json()

    if (!res.ok) {
      alert(result.message || "Gagal menghapus materi")
    } else {
      alert("Materi berhasil dihapus")

      // Update lokal state
      setMaterialList((prev) => prev.filter((mat) => mat.id !== id))

      // Refresh router untuk sinkronisasi
      router.refresh()
    }
  } catch (error) {
    console.error(error)
    alert("Terjadi kesalahan saat menghapus")
  } finally {
    setLoadingId(null)
  }
}


  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="text-center">Kategori</TableHead>
            <TableHead className="text-center">Nama Mata Kuliah</TableHead>
            <TableHead className="text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className="hover:bg-accent">
              <TableCell className="text-center">
                {item.category?.name ?? "-"}
              </TableCell>
              <TableCell className="text-center">{item.title}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-2">
                  <Link href={`/materi/detail/${item.id}`}>
                    <button className="border border-gray-400 text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-all">
                      Detail
                    </button>
                  </Link>
                  {!item.approved && (
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-all"
                      disabled={loadingId === item.id}
                    >
                      {loadingId === item.id ? "Menyetujui..." : "Approve"}
                    </button>
                    
                  )}

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-all"
                    disabled={loadingId === item.id}
                  >
                    {loadingId === item.id ? "Menghapus..." : "Delete"}
                  </button>
                </div>
              </TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
