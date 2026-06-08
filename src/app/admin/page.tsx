"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, Image as ImageIcon, Clock, Pencil, Trash2 } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Badge } from "@/components/Badge";
import { useAuth } from "@/context/AuthContext";

const TABS = ["Semua", "Tayang", "Pending", "Terjual"];

export default function AdminPage() {
  const { isAdmin, isLoggedIn } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Semua");
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // fetchListings declared at component scope so handleDelete can call it
  const fetchListings = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/listings")
      .then(res => res.json())
      .then(data => {
        setListings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/masuk");
      return;
    }
    if (!isAdmin) {
      router.replace("/dashboard");
      return;
    }
    fetchListings();
  }, [isLoggedIn, isAdmin, router, fetchListings]);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus listing ini secara permanen?")) return;
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchListings();
      } else {
        alert("Gagal menghapus listing");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menghapus");
    }
  };

  if (!isLoggedIn || !isAdmin) return null;

  const pendingListings = listings.filter(l => l.status === "pending");
  const publishedListings = listings.filter(l => l.status === "published");

  const filteredAll = listings.filter(l => {
    if (activeTab === "Semua") return true;
    if (activeTab === "Tayang") return l.status === "published";
    if (activeTab === "Pending") return l.status === "pending";
    if (activeTab === "Terjual") return l.status === "sold";
    return true;
  });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  const stats = [
    { label: "Menunggu Review", value: pendingListings.length, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
    { label: "Total Tayang", value: publishedListings.length, color: "text-green-700", bg: "bg-white border-sand-300" },
    { label: "Total Terjual", value: listings.filter(l => l.status === "sold").length, color: "text-earth-700", bg: "bg-white border-sand-300" },
    { label: "Total Listing", value: listings.length, color: "text-earth-900", bg: "bg-white border-sand-300" },
  ];

  return (
    <div className="flex min-h-screen bg-earth-50">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-2xl font-medium text-earth-900">Admin Panel</h1>
          <span className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full">Admin</span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, color, bg }) => (
            <div key={label} className={`border rounded-xl p-5 ${bg}`}>
              <p className={`text-2xl font-medium ${color}`}>{value}</p>
              <p className="text-xs text-earth-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* ANTRIAN REVIEW */}
        <div className="bg-white border border-sand-300 rounded-2xl overflow-hidden mb-8">
          <div className="flex items-center gap-3 p-5 border-b border-sand-300">
            <h2 className="font-medium text-earth-900">Menunggu Review</h2>
            {pendingListings.length > 0 && (
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingListings.length}
              </span>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12 text-earth-500">Memuat data...</div>
          ) : pendingListings.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-700 mx-auto mb-3 opacity-60" />
              <p className="text-earth-500 text-sm">Tidak ada listing yang perlu direview</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-amber-50/50 border-b border-sand-300">
                    <th className="text-left px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider">Lahan</th>
                    <th className="text-left px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider hidden md:table-cell">Tanggal</th>
                    <th className="text-left px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider">Status</th>
                    <th className="text-right px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-300/50">
                  {pendingListings.map(l => (
                    <tr key={l.id} className="bg-amber-50/30 hover:bg-amber-50/60 transition-colors">
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
                            <p className="text-xs text-earth-500 mt-0.5">{l.category} · {l.seller?.fullName || "Tanpa Nama"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-earth-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs">{l.createdAt ? formatDate(l.createdAt) : "-"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full">Menunggu</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/listing/${l.id}`}
                            className="bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-600 transition-colors">
                            Review
                          </Link>
                          <Link href={`/dashboard/listing/${l.id}/edit`}
                            className="p-1.5 text-earth-500 hover:text-earth-700 hover:bg-earth-50 rounded-lg transition-colors">
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
            </div>
          )}
        </div>

        {/* SEMUA LISTING */}
        <div className="bg-white border border-sand-300 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-sand-300 flex-wrap gap-3">
            <h2 className="font-medium text-earth-900">Semua Listing</h2>
            <div className="flex gap-1">
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === tab ? "bg-green-700 text-white" : "text-earth-500 hover:bg-earth-50"}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12 text-earth-500">Memuat data...</div>
            ) : filteredAll.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-earth-500 text-sm">Tidak ada listing untuk tab ini</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-earth-50 border-b border-sand-300">
                    <th className="text-left px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider">Judul</th>
                    <th className="text-left px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider hidden lg:table-cell">Penjual</th>
                    <th className="text-left px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider hidden md:table-cell">Tanggal</th>
                    <th className="text-right px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-300/50">
                  {filteredAll.map(l => (
                    <tr key={l.id} className="hover:bg-earth-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-earth-200 flex items-center justify-center overflow-hidden shrink-0">
                            {l.image ? (
                              <img src={l.image} alt={l.title} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-earth-500 opacity-50" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-earth-900 text-sm line-clamp-1">{l.title}</p>
                            <p className="text-xs text-earth-500">{l.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell text-xs text-earth-500">{l.seller?.fullName || "Tanpa Nama"}</td>
                      <td className="px-5 py-4"><Badge type="status" value={l.status} /></td>
                      <td className="px-5 py-4 hidden md:table-cell text-xs text-earth-500">
                        {l.createdAt ? formatDate(l.createdAt) : "-"}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/listing/${l.id}`} className="text-green-700 text-xs hover:underline px-2">Review</Link>
                          <Link href={`/dashboard/listing/${l.id}/edit`}
                            className="p-1.5 text-earth-500 hover:text-earth-700 hover:bg-earth-50 rounded-lg transition-colors">
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
        </div>
      </main>
    </div>
  );
}
