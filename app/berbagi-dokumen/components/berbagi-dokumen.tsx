"use client"

import { useState } from "react"
import {
  Search,
  FileText,
  FileSpreadsheet,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

const categories = [
  {
    id: 1,
    icon: "🏘️",
    label: "Bidang Kawasan Pemukiman",
    docCount: 24,
  },
  {
    id: 2,
    icon: "🏠",
    label: "Bidang Perumahan",
    docCount: 18,
  },
  {
    id: 3,
    icon: "🏢",
    label: "Bidang Bangunan Gedung/Infrastruktur",
    docCount: 32,
  },
  {
    id: 4,
    icon: "🗺️",
    label: "Bidang Tata Ruang",
    docCount: 15,
  },
]

const documents = [
  {
    id: 1,
    name: "DokumenPentingPerumahan",
    source: "Bidang Perumahan",
    date: "10-02-2026",
    type: "docx",
  },
  {
    id: 2,
    name: "DokumenPentingPemukiman",
    source: "Bidang Pemukiman",
    date: "09-02-2026",
    type: "docx",
  },
  {
    id: 3,
    name: "DataInfrastruktur2026",
    source: "Bidang Infrastruktur",
    date: "10-02-2026",
    type: "xlsx",
  },
  {
    id: 4,
    name: "LaporanKonstruksiGedung",
    source: "Bidang Bangunan Gedung",
    date: "08-02-2026",
    type: "docx",
  },
  {
    id: 5,
    name: "DataInfrastruktur2026",
    source: "Bidang Infrastruktur",
    date: "07-02-2026",
    type: "xlsx",
  },
  {
    id: 6,
    name: "RencanaRuangWilayah",
    source: "Bidang Tata Ruang",
    date: "06-02-2026",
    type: "docx",
  },
]

function getFileIcon(type: string) {
  switch (type) {
    case "docx":
      return <FileText className="w-6 h-6 text-blue-500" />
    case "xlsx":
      return <FileSpreadsheet className="w-6 h-6 text-green-500" />
    default:
      return <FileText className="w-6 h-6 text-gray-500" />
  }
}

export default function SharedDocuments() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Berbagi Dokumen</h1>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-50 border-slate-300"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-4 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )
              }
              className={`p-4 rounded-lg transition-all ${
                selectedCategory === category.id
                  ? "bg-slate-900 text-white shadow-lg"
                  : "bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <div className="text-sm font-semibold text-balance">
                {category.label}
              </div>
              <div className="text-xs mt-2 opacity-75">
                {category.docCount} dokumen
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className="flex-1 overflow-hidden px-6 py-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm h-full flex flex-col">
          <div className="p-6 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">
              Dokumen Publik Dibagikan
            </h2>
          </div>

          <ScrollArea className="flex-1">
            <div className="divide-y divide-slate-200">
              {/* Table Header */}
              <div className="grid grid-cols-5 gap-4 p-6 font-semibold text-sm text-slate-600 bg-slate-50 sticky top-0">
                <div>Jenis File</div>
                <div>Dokumen</div>
                <div>Sumber</div>
                <div>Tanggal</div>
                <div>Aksi</div>
              </div>

              {/* Table Rows */}
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="grid grid-cols-5 gap-4 p-6 items-center hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex justify-center">
                      {getFileIcon(doc.type)}
                    </div>
                    <div className="font-medium text-slate-900 truncate">
                      {doc.name}
                    </div>
                    <div className="text-sm text-slate-600">{doc.source}</div>
                    <div className="text-sm text-slate-500">{doc.date}</div>
                    <div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 border-slate-300 hover:bg-slate-50"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-500">
                  Tidak ada dokumen yang ditemukan
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}