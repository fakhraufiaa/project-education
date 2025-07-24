"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export function CreateMaterialForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories")
      const data = await res.json()
      setCategories(data)
    }

    fetchCategories()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const previewURL = URL.createObjectURL(file)
      setImagePreview(previewURL)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append("categoryId", selectedCategory)

    const res = await fetch("/api/material", {
      method: "POST",
      body: formData,
    })

    if (res.ok) {
      alert("Materi berhasil disimpan!")
      e.currentTarget.reset()
      setImagePreview(null)
      setSelectedCategory("") // reset kategori
    } else {
      alert("Gagal menyimpan materi.")
    }
  }

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
      {/* KIRI */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Select onValueChange={(val) => setSelectedCategory(val)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="courseName">Nama Mata Kuliah</Label>
          <Input id="courseName" name="courseName" placeholder="Contoh: Pemrograman Dasar" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea id="description" name="description" placeholder="Tuliskan deskripsi materi..." />
        </div>
      </div>

      {/* KANAN */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="folder">Upload File</Label>
          <Input id="folder" name="folder" type="file" />
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="image">Upload Gambar</Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-2 h-32 rounded-md border" />
          )}
        </div> */}

        <div className="space-y-2">
          <Label htmlFor="radio">Upload Audio</Label>
          <Input id="audio" name="audio" type="file" accept="audio/*" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="link">Link Materi (Opsional, bisa YouTube)</Label>
          <Input id="link" name="link" placeholder="https://..." />
        </div>
      </div>

      <div className="col-span-1 md:col-span-2">
        <Button type="submit">Simpan Materi</Button>
      </div>
    </form>
  )
}
