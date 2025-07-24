"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Category = {
  id: number
  name: string
}

export function CreateCategoryForm() {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: "Pemrograman" },
    { id: 2, name: "Desain UI/UX" },
  ])

    useEffect(() => {
    const fetchCategories = async () => {
        try {
        const res = await fetch("/api/categories")
        const data = await res.json()
        setCategories(data)
        } catch (error) {
        console.error("Gagal mengambil kategori", error)
        }
    }

    fetchCategories()
    }, [])

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!name.trim()) return
  setLoading(true)

  try {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    })

    if (!res.ok) {
      const error = await res.json()
      alert(error?.error || "Gagal menyimpan kategori")
      return
    }

    const newCategory = await res.json()
    setCategories((prev) => [...prev, newCategory])
    setName("")
  } catch (error) {
    alert("Terjadi kesalahan saat menyimpan")
    console.error(error)
  } finally {
    setLoading(false)
  }
}


  const handleDelete = async (id: number) => {
  const confirmDelete = confirm("Yakin ingin menghapus kategori ini?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`/api/categories/${id}`, {
            method: "DELETE",
            });
            if (!res.ok) throw new Error("Gagal hapus");

            setCategories((prev) => prev.filter((cat) => cat.id !== id));
        } catch (error) {
            alert("Gagal menghapus kategori");
            console.error(error);
        }
    };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Kategori</Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Pemrograman"
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Kategori"}
        </Button>
      </form>

      <div>
        <h2 className="text-lg font-semibold mb-2">Daftar Kategori</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    Hapus
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Belum ada kategori
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
