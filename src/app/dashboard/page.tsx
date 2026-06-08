"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Image as ImageIcon, LayoutDashboard } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Badge } from "@/components/Badge";
// removed dummy import
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();

  const [listings, setListings] = useState<any[]>([]);
  const [subStatus, setSubStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/masuk");
      return;
    }
    
    // Fetch listings
    fetch("/api/listings/my")
      .then(res => res.json())
      .then(data => {
        setListings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch subscription status (reads from session cookie)
    fetch("/api/subscription/status")
      .then(res => res.json())
      .then(data => setSubStatus(data))
      .catch(console.error);
  }, [isLoggedIn, router, user]);

  if (!isLoggedIn) return null;

  const formatRp = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
  const today = new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const stats = [
    { label: "Total Listing", value: listings.length, color: "text-earth-900" },
    { label: "Listing Tayang", value: listings.filter(l => l.status === "published").length, color: "text-green-700" },
    { label: "Total Tayangan", value: listings.reduce((acc, l) => acc + (l.viewCount || 0), 0), color: "text-blue-600" },
    { label: "Terjual", value: listings.filter(l => l.status === "sold").length, color: "text-gray-500" },
  ];

  return (
    <div className="flex min-h-screen bg-earth-50">
      <DashboardSidebar />

      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-earth-500 text-sm mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </div>
          <h1 className="text-2xl font-medium text-earth-900">Selamat datang, {user?.name ?? "Penjual"} 👋</h1>
          <p className="text-earth-500 text-sm mt-1">{today}</p>
        </div>

        {/* Subscription Banner */}
        {subStatus && (
          <div className={`mb-8 p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            subStatus.status === 'active' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div>
              <h3 className={`font-medium ${subStatus.status === 'active' ? 'text-green-900' : 'text-red-900'}`}>
                {subStatus.status === 'active' 
                  ? `Paket ${subStatus.plan === 'yearly' ? 'Tahunan' : 'Bulanan'} Aktif` 
                  : 'Langganan Anda Telah Berakhir'}
              </h3>
              <p className={`text-sm mt-1 ${subStatus.status === 'active' ? 'text-green-700' : 'text-red-700'}`}>
                {subStatus.status === 'active' 
                  ? `Sisa masa aktif: ${subStatus.remainingDays} hari.` 
                  : 'Perpanjang langganan Anda untuk mulai memasarkan lahan kembali.'}
              </p>
            </div>
            {subStatus.status !== 'active' && (
              <Link href="/dashboard/langganan/pilih-paket" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors whitespace-nowrap text-center">
                Perpanjang Sekarang
              </Link>
            )}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-sand-300 rounded-xl p-5">
              <p className={`text-2xl font-medium ${color}`}>{value}</p>
              <p className="text-xs text-earth-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Listings Table */}
        <div className="bg-white border border-sand-300 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-sand-300">
            <h2 className="font-medium text-earth-900">Listing Saya</h2>
            <Link href="/dashboard/listing/baru"
              className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
              <Plus className="w-4 h-4" />
              Buat Listing Baru
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16 text-earth-500">Memuat data...</div>
          ) : listings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-earth-50 flex items-center justify-center mx-auto mb-4">
                <LayoutDashboard className="w-8 h-8 text-earth-300" />
              </div>
              <p className="text-earth-500 text-sm mb-3">Belum ada listing</p>
              <Link href="/dashboard/listing/baru" className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600">
                <Plus className="w-4 h-4" />
                Buat Listing Pertama →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-earth-50 border-b border-sand-300">
                    <th className="text-left px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider">Lahan</th>
                    <th className="text-left px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider hidden md:table-cell">Harga</th>
                    <th className="text-center px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider">Dilihat</th>
                    <th className="text-left px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider">Status</th>
                    <th className="text-right px-5 py-3 text-xs text-earth-500 font-medium uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-300/50">
                  {listings.map(l => (
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
                            <p className="text-xs text-earth-500 line-clamp-1 mt-0.5">
                              {l.category} • {l.area} m²
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="font-medium text-green-900">{formatRp(l.price)}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-sm text-earth-600 font-medium">{l.viewCount || 0}</span>
                      </td>
                      <td className="px-5 py-4">
                        <Badge type="status" value={l.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/dashboard/listing/${l.id}/edit`}
                            className="p-2 text-earth-500 hover:text-earth-700 hover:bg-earth-50 rounded-lg transition-colors">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button className="p-2 text-earth-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
      </main>
    </div>
  );
}
