"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, Map as MapIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";

const MapViewer = dynamic(() => import("@/components/MapViewer"), { ssr: false });
// removed dummy import
import { Badge } from "@/components/Badge";

const CATEGORIES = ["Hunian", "Kebun", "Pertanian", "Investasi", "Lainnya"];
const DOC_TYPES = ["SHM", "SHGB", "Girik", "AJB"];

export default function JelajahiPage() {
  const [search, setSearch] = useState("");
  const [minHarga, setMinHarga] = useState("");
  const [maxHarga, setMaxHarga] = useState("");
  const [minLuas, setMinLuas] = useState("");
  const [maxLuas, setMaxLuas] = useState("");
  const [selectedKategori, setSelectedKategori] = useState<string[]>([]);
  const [selectedDokumen, setSelectedDokumen] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState({ search: "", minHarga: 0, maxHarga: Infinity, minLuas: 0, maxLuas: Infinity, kategori: [] as string[], dokumen: [] as string[] });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/listings")
      .then(res => res.json())
      .then(data => {
        setListings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedKategori(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };
  const toggleDoc = (doc: string) => {
    setSelectedDokumen(prev => prev.includes(doc) ? prev.filter(d => d !== doc) : [...prev, doc]);
  };

  const applyFilters = () => {
    setActiveFilters({
      search,
      minHarga: minHarga ? parseInt(minHarga.replace(/\D/g, "")) : 0,
      maxHarga: maxHarga ? parseInt(maxHarga.replace(/\D/g, "")) : Infinity,
      minLuas: minLuas ? parseInt(minLuas) : 0,
      maxLuas: maxLuas ? parseInt(maxLuas) : Infinity,
      kategori: selectedKategori,
      dokumen: selectedDokumen,
    });
    setShowFilter(false);
  };

  const resetFilters = () => {
    setSearch(""); setMinHarga(""); setMaxHarga(""); setMinLuas(""); setMaxLuas("");
    setSelectedKategori([]); setSelectedDokumen([]);
    setActiveFilters({ search: "", minHarga: 0, maxHarga: Infinity, minLuas: 0, maxLuas: Infinity, kategori: [], dokumen: [] });
  };

  const results = useMemo(() => {
    return listings.filter(l => {
      if (l.status !== "published") return false;
      if (activeFilters.search && !l.title.toLowerCase().includes(activeFilters.search.toLowerCase()) && !l.category.toLowerCase().includes(activeFilters.search.toLowerCase())) return false;
      if (l.price < activeFilters.minHarga || l.price > activeFilters.maxHarga) return false;
      if (l.area < activeFilters.minLuas || l.area > activeFilters.maxLuas) return false;
      if (activeFilters.kategori.length > 0 && !activeFilters.kategori.includes(l.category)) return false;
      if (activeFilters.dokumen.length > 0 && !activeFilters.dokumen.includes(l.docType)) return false;
      return true;
    });
  }, [activeFilters, listings]);

  const formatRp = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="h-screen flex flex-col bg-earth-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
        {/* LEFT PANEL */}
        <div className="w-full md:w-96 flex flex-col border-r border-sand-300 bg-earth-50 overflow-y-auto shrink-0">
          {/* Search + Filter Toggle */}
          <div className="p-4 border-b border-sand-300 sticky top-0 bg-earth-50 z-10">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-500" />
              <input
                type="text"
                placeholder="Cari desa, kecamatan..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sand-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30 focus:border-green-700"
              />
            </div>
            <button
              onClick={() => setShowFilter(v => !v)}
              className="flex items-center gap-2 text-sm text-earth-700 font-medium hover:text-green-700"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showFilter ? "Tutup Filter" : "Tampilkan Filter"}
            </button>
          </div>

          {/* Filters */}
          {showFilter && (
            <div className="p-4 border-b border-sand-300 bg-sand-100 space-y-5">
              {/* Harga */}
              <div>
                <label className="block text-xs font-semibold text-earth-700 mb-2 uppercase tracking-wider">Harga (Rp)</label>
                <div className="flex gap-2">
                  <input placeholder="Min" value={minHarga} onChange={e => setMinHarga(e.target.value)} className="w-1/2 px-3 py-2 rounded-lg border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30" />
                  <input placeholder="Max" value={maxHarga} onChange={e => setMaxHarga(e.target.value)} className="w-1/2 px-3 py-2 rounded-lg border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30" />
                </div>
              </div>
              {/* Luas */}
              <div>
                <label className="block text-xs font-semibold text-earth-700 mb-2 uppercase tracking-wider">Luas (m²)</label>
                <div className="flex gap-2">
                  <input placeholder="Min" value={minLuas} onChange={e => setMinLuas(e.target.value)} className="w-1/2 px-3 py-2 rounded-lg border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30" />
                  <input placeholder="Max" value={maxLuas} onChange={e => setMaxLuas(e.target.value)} className="w-1/2 px-3 py-2 rounded-lg border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30" />
                </div>
              </div>
              {/* Kategori */}
              <div>
                <label className="block text-xs font-semibold text-earth-700 mb-2 uppercase tracking-wider">Kategori</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => toggleCategory(c)} className={`px-3 py-1 rounded-full text-xs border transition-colors ${selectedKategori.includes(c) ? "bg-green-700 border-green-700 text-white" : "bg-white border-sand-300 text-earth-700 hover:border-green-700"}`}>{c}</button>
                  ))}
                </div>
              </div>
              {/* Dokumen */}
              <div>
                <label className="block text-xs font-semibold text-earth-700 mb-2 uppercase tracking-wider">Status Dokumen</label>
                <div className="flex flex-wrap gap-2">
                  {DOC_TYPES.map(d => (
                    <button key={d} onClick={() => toggleDoc(d)} className={`px-3 py-1 rounded-full text-xs border transition-colors ${selectedDokumen.includes(d) ? "bg-green-700 border-green-700 text-white" : "bg-white border-sand-300 text-earth-700 hover:border-green-700"}`}>{d}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={applyFilters} className="flex-1 bg-green-700 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-green-600 transition-colors">Terapkan Filter</button>
                <button onClick={resetFilters} className="px-4 text-earth-700 rounded-lg py-2.5 text-sm border border-sand-300 hover:bg-earth-30 transition-colors">Reset</button>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="p-4 flex-1">
            {loading ? (
              <p className="text-earth-500 text-sm mb-3 font-medium">Memuat data...</p>
            ) : (
              <p className="text-earth-500 text-sm mb-3 font-medium">{results.length} lahan ditemukan</p>
            )}
            <div className="space-y-2">
              {results.map(l => (
                <Link
                  key={l.id}
                  href={`/lahan/${l.id}`}
                  onMouseEnter={() => setHoveredId(l.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`flex gap-3 p-3 rounded-xl border transition-all cursor-pointer ${hoveredId === l.id ? "bg-earth-30 border-earth-500" : "bg-white border-sand-300 hover:bg-earth-30"}`}
                >
                  <div className="w-16 h-16 rounded-lg bg-earth-200 shrink-0 flex items-center justify-center overflow-hidden">
                    {(l as any).image ? (
                      <img src={(l as any).image} alt={l.title} className="w-full h-full object-cover" />
                    ) : (
                      <MapIcon className="w-6 h-6 text-earth-500 opacity-50" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-earth-900 line-clamp-1">{l.title}</p>
                    <p className="text-xs text-earth-500 line-clamp-1 mt-0.5">{l.category}</p>
                    <p className="text-sm font-semibold text-green-900 mt-1">{formatRp(l.price)}</p>
                    <div className="flex gap-1 mt-1">
                      <Badge type="document" value={l.docType} />
                      {l.verified && <Badge type="verified" />}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-earth-500 shrink-0 self-center" />
                </Link>
              ))}
              {!loading && results.length === 0 && (
                <div className="text-center py-12 text-earth-500">
                  <MapIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Tidak ada lahan yang ditemukan.</p>
                  <button onClick={resetFilters} className="mt-2 text-green-700 text-sm underline">Reset filter</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Map Viewer */}
        <div className="flex-1 relative hidden md:flex z-0">
          <MapViewer 
            markers={results.map(l => ({
              id: l.id,
              lat: l.latitude,
              lng: l.longitude,
              title: l.title,
              price: l.price,
              area: l.area
            }))} 
            zoom={12}
          />
        </div>
      </div>
    </div>
  );
}
