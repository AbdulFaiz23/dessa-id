"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, CreditCard, ArrowRight } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function SuksesPage() {
  const [subData, setSubData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/subscription/status")
      .then((res) => res.json())
      .then((data) => setSubData(data))
      .catch(console.error);
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="flex min-h-screen bg-earth-50">
      <DashboardSidebar />
      <main className="flex-1 p-8 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-2xl border border-sand-300 shadow-sm text-center max-w-md w-full">
          {/* Icon */}
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-100">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-2xl font-medium text-earth-900 mb-2">
            Pembayaran Berhasil!
          </h2>
          <p className="text-earth-500 text-sm mb-8">
            Langganan Dessa.id Anda kini telah aktif. Selamat memasarkan lahan!
          </p>

          {/* Subscription Card */}
          {subData && subData.status === "active" && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 text-left">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-green-700" />
                <span className="text-sm font-medium text-green-900">Detail Langganan Aktif</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-earth-500">Paket</span>
                  <span className="font-medium text-earth-900">
                    {subData.plan === "yearly" ? "Tahunan" : "Bulanan"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth-500">Aktif hingga</span>
                  <span className="font-medium text-earth-900">
                    {subData.expiredAt ? formatDate(subData.expiredAt) : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth-500">Maks. Listing</span>
                  <span className="font-medium text-earth-900">{subData.maxListings} listing</span>
                </div>
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="space-y-3">
            <Link
              href="/dashboard/listing/baru"
              className="flex items-center justify-center gap-2 w-full bg-green-700 text-white rounded-xl py-3 font-medium hover:bg-green-600 transition-colors"
            >
              Mulai Buat Listing
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="block w-full text-earth-500 hover:text-earth-900 text-sm py-2 transition-colors"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
