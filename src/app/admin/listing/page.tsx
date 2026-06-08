"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Search } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Badge } from "@/components/Badge";
// removed dummy import
import { useAuth } from "@/context/AuthContext";

const TABS = ["Semua", "Tayang", "Pending", "Terjual"];

export default function AdminAllListingsPage() {
  const { isAdmin, isLoggedIn } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Semua");
  const [search, setSearch] = useState("");

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/masuk");
      return;
    }
    if (!isAdmin) {
      router.replace("/dashboard");
      return;
    }

    fetch("/api/admin/listings")
      .then(res => res.json())
      .then(data => {
        setListings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isLoggedIn, isAdmin, router]);

  if (!isLoggedIn || !isAdmin) return null;

  const formatRp = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  const filtered = listings.filter((l) => {
    const matchTab =
      activeTab === "Semua" ? true :
      activeTab === "Tayang" ? l.status === "published" :
      activeTab === "Pending" ? l.status === "pending" :
      l.status === "sold";
    const matchSearch = search
      ? l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.category.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchTab && matchSearch;
  });

  return (
    <div className="flex min-h-screen bg-earth-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-medium text-earth-900">Semua Listing</h1>
            <p className="text-sm text-earth-500 mt-1">{listings.length} listing terdaftar</p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-500" />
            <input
              type="text"
              placeholder="Cari judul atau lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sand-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-700/30"
            />
          </div>
        </div>

        {/* Tab Filter */}
        <div className="flex gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === tab
                  ? "bg-green-700 text-white"
                  : "bg-white border border-sand-300 text-earth-700 hover:bg-earth-50"
              }`}
            >
              {tab}
              {tab !== "Semua" && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({listings.filter(l => tab === "Tayang" ? l.status === "published" : tab === "Pending" ? l.status === "pending" : l.status === "sold").length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-sand-300 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-earth-50 border-b border-sand-300">
                  <th className="text-left px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider">Lahan</th>
                  <th className="text-left px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider hidden lg:table-cell">Penjual</th>
                  <th className="text-left px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider hidden md:table-cell">Harga</th>
                  <th className="text-left px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider hidden md:table-cell">Tanggal</th>
                  <th className="text-right px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-300/50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-earth-500 text-sm">
                      Memuat data...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-earth-500 text-sm">
                      Tidak ada listing yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((l) => (
                    <tr key={l.id} className="hover:bg-earth-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-earth-200 flex items-center justify-center overflow-hidden shrink-0">
                            {l.image ? (
                              <img src={l.image} alt={l.title} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-earth-500 opacity-50" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-earth-900 line-clamp-1">{l.title}</p>
                            <p className="text-xs text-earth-500 mt-0.5">{l.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell text-xs text-earth-600">
                        <div>
                          <p className="font-medium">{l.seller?.fullName || "Tidak Diketahui"}</p>
                          <p className="text-earth-500">{l.seller?.email || "Tidak ada email"}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-sm font-medium text-green-900">{formatRp(l.price)}</td>
                      <td className="px-5 py-4">
                        <Badge type="status" value={l.status} />
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-xs text-earth-500">15 Mei 2025</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/listing/${l.id}`}
                            className="px-3 py-1.5 text-xs bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Review
                          </Link>
                          <Link
                            href={`/lahan/${l.id}`}
                            className="px-3 py-1.5 text-xs border border-sand-300 text-earth-700 rounded-lg hover:bg-earth-50 transition-colors"
                          >
                            Lihat
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
