"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Badge } from "@/components/Badge";
// removed dummy import
import { useAuth } from "@/context/AuthContext";

export default function ListingSayaPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/masuk");
      return;
    }
    fetchListings();
  }, [isLoggedIn, router]);

  const fetchListings = async () => {
    try {
      const res = await fetch("/api/listings/my");
      const data = await res.json();
      setListings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus listing ini?")) return;
    try {
      await fetch(`/api/listings/${id}`, { method: "DELETE" });
      fetchListings();
    } catch (error) {
      alert("Gagal menghapus");
    }
  };

  if (!isLoggedIn) return null;

  const formatRp = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="flex min-h-screen bg-earth-50">
      <DashboardSidebar />
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium text-earth-900">Listing Saya</h1>
            <p className="text-sm text-earth-500 mt-1">{listings.length} listing terdaftar</p>
          </div>
          <Link
            href="/dashboard/listing/baru"
            className="flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Buat Listing Baru
          </Link>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-6">
          {["Semua", "Tayang", "Pending", "Terjual", "Draft"].map((tab) => (
            <button
              key={tab}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-white border border-sand-300 text-earth-700 hover:bg-earth-50 first:bg-green-700 first:text-white first:border-green-700 transition-colors"
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-sand-300 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="text-center py-20 text-earth-500">Memuat data...</div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-earth-50 flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-earth-300" />
              </div>
              <p className="text-earth-500 text-sm mb-3">Belum ada listing</p>
              <Link
                href="/dashboard/listing/baru"
                className="inline-flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-600"
              >
                <Plus className="w-4 h-4" /> Buat Listing Pertama →
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-earth-50 border-b border-sand-300">
                  <th className="text-left px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider">Lahan</th>
                  <th className="text-left px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider hidden md:table-cell">Luas</th>
                  <th className="text-left px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider hidden md:table-cell">Harga</th>
                  <th className="text-left px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-300/50">
                {listings.map((l) => (
                  <tr key={l.id} className="hover:bg-earth-50 transition-colors group">
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
                          <p className="text-xs text-earth-500 mt-0.5">
                            {l.category} • {l.area} m²
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-sm text-earth-700">{l.area} m²</td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-sm font-medium text-green-900">{formatRp(l.price)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge type="status" value={l.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/lahan/${l.id}`}
                          className="px-3 py-1.5 text-xs text-earth-500 border border-sand-300 rounded-lg hover:bg-earth-50 transition-colors"
                        >
                          Lihat
                        </Link>
                        <Link
                          href={`/dashboard/listing/${l.id}/edit`}
                          className="p-1.5 text-earth-500 hover:text-earth-700 hover:bg-earth-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(l.id)} className="p-1.5 text-earth-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
