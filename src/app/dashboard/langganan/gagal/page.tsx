"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function GagalPage() {
  return (
    <div className="flex min-h-screen bg-earth-50">
      <DashboardSidebar />
      <main className="flex-1 p-8 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-2xl border border-sand-300 shadow-sm text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-medium text-earth-900 mb-2">Pembayaran Gagal</h2>
          <p className="text-earth-500 mb-8">
            Mohon maaf, transaksi Anda tidak dapat diproses atau telah kedaluwarsa. Silakan coba lagi.
          </p>
          <Link
            href="/dashboard/langganan/pilih-paket"
            className="block w-full bg-earth-900 text-white rounded-xl py-3 font-medium hover:bg-earth-800 transition-colors"
          >
            Pilih Paket Ulang
          </Link>
        </div>
      </main>
    </div>
  );
}
