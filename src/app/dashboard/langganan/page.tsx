"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";

export default function LanggananPage() {
  const { user } = useAuth();
  const [subStatus, setSubStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subscription/status")
      .then(res => res.json())
      .then(data => {
        setSubStatus(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-earth-50">
      <DashboardSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-earth-500 text-sm mb-1">
            <CreditCard className="w-4 h-4" />
            <span>Langganan</span>
          </div>
          <h1 className="text-2xl font-medium text-earth-900 mb-8">Kelola Langganan</h1>

          {loading ? (
            <div className="text-earth-500">Memuat status langganan...</div>
          ) : (
            <div className="bg-white border border-sand-300 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-medium text-earth-900 mb-4 border-b border-sand-300 pb-3">Status Saat Ini</h2>
              
              {subStatus?.status === "active" ? (
                <div className="flex items-start gap-4">
                  <div className="bg-green-50 text-green-700 p-3 rounded-xl">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-earth-900 text-lg">Paket {subStatus.plan === 'yearly' ? 'Tahunan' : 'Bulanan'} Aktif</h3>
                    <p className="text-sm text-earth-500 mt-1">
                      Langganan Anda aktif hingga {new Date(subStatus.expiredAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}.
                      Sisa waktu: <span className="font-medium text-green-700">{subStatus.remainingDays} hari</span>.
                    </p>
                  </div>
                </div>
              ) : subStatus?.status === "expired" ? (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-earth-900 text-lg">Langganan Berakhir</h3>
                      <p className="text-sm text-earth-500 mt-1">
                        Masa aktif langganan Anda telah habis. Listing Anda saat ini tidak ditampilkan ke publik.
                      </p>
                    </div>
                  </div>
                  <Link href="/dashboard/langganan/pilih-paket" className="bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors whitespace-nowrap text-center">
                    Perpanjang Sekarang
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-earth-100 text-earth-600 p-3 rounded-xl">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-earth-900 text-lg">Belum Berlangganan</h3>
                      <p className="text-sm text-earth-500 mt-1">
                        Anda belum memiliki paket aktif. Berlangganan sekarang untuk mulai mengunggah listing.
                      </p>
                    </div>
                  </div>
                  <Link href="/dashboard/langganan/pilih-paket" className="bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors whitespace-nowrap text-center">
                    Lihat Paket
                  </Link>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
