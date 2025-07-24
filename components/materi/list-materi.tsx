"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Material = {
  id: string
  category: {
    name: string
  } | null
  name: string
}

export function ListMateri({ data }: { data: Material[] }) {
  
  if (data.length === 0) {
    return (
      <div className="text-center py-4">
        Tidak ada materi yang telah di-approve.
      </div>
    )
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
              <TableCell className="text-center">{item.category?.name}</TableCell>
              <TableCell className="text-center">{item.name}</TableCell>
              <TableCell className="text-center">
                <Link href={`/materi/list/detail/${item.id}`}>
                  <Button variant="outline" size="sm">Detail</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}