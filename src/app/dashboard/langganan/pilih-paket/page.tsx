"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";
import { Check, Loader2 } from "lucide-react";

export default function PilihPaketPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (plan: "monthly" | "yearly") => {
    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Redirect to payment page, include mode for simulation detection
      router.push(
        `/dashboard/langganan/bayar/${data.orderId}?token=${data.token}&mode=${data.mode}`
      );
    } catch (error) {
      alert("Gagal membuat transaksi. Coba lagi.");
      setLoadingPlan(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-earth-50">
      <DashboardSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-heading text-earth-900 mb-4">Pilih Paket Langganan</h1>
            <p className="text-earth-500">
              Dapatkan akses penuh untuk memasarkan lahan Anda dengan data presisi geospasial.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Monthly Plan */}
            <div className="bg-white border border-sand-300 rounded-2xl p-8 shadow-sm flex flex-col relative">
              <h3 className="text-lg font-medium text-earth-900 mb-2">Paket Bulanan</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold text-earth-900">Rp 49.000</span>
                <span className="text-earth-500"> / bulan</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-earth-700">
                  <Check className="w-5 h-5 text-green-600" /> Maks. 5 listing aktif
                </li>
                <li className="flex items-center gap-3 text-sm text-earth-700">
                  <Check className="w-5 h-5 text-green-600" /> 30 hari masa tayang
                </li>
                <li className="flex items-center gap-3 text-sm text-earth-700">
                  <Check className="w-5 h-5 text-green-600" /> Maks. 5 foto per listing
                </li>
              </ul>
              <button
                onClick={() => handleSelectPlan("monthly")}
                disabled={loadingPlan !== null}
                className="w-full bg-earth-900 text-white rounded-xl py-3 font-medium hover:bg-earth-800 transition-colors disabled:opacity-70 flex justify-center items-center"
              >
                {loadingPlan === "monthly" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Pilih Paket Bulanan"}
              </button>
            </div>

            {/* Yearly Plan */}
            <div className="bg-white border-2 border-green-700 rounded-2xl p-8 shadow-md flex flex-col relative">
              <div className="absolute top-0 right-0 bg-green-700 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                HEMAT 23%
              </div>
              <h3 className="text-lg font-medium text-green-800 mb-2">Paket Tahunan</h3>
              <div className="mb-6">
                <span className="text-3xl font-bold text-earth-900">Rp 449.000</span>
                <span className="text-earth-500"> / tahun</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-earth-700">
                  <Check className="w-5 h-5 text-green-600" /> Maks. 15 listing aktif
                </li>
                <li className="flex items-center gap-3 text-sm text-earth-700">
                  <Check className="w-5 h-5 text-green-600" /> 365 hari masa tayang
                </li>
                <li className="flex items-center gap-3 text-sm text-earth-700">
                  <Check className="w-5 h-5 text-green-600" /> Maks. 10 foto per listing
                </li>
                <li className="flex items-center gap-3 text-sm text-earth-700">
                  <Check className="w-5 h-5 text-green-600" /> Prioritas pencarian
                </li>
              </ul>
              <button
                onClick={() => handleSelectPlan("yearly")}
                disabled={loadingPlan !== null}
                className="w-full bg-green-700 text-white rounded-xl py-3 font-medium hover:bg-green-600 transition-colors disabled:opacity-70 flex justify-center items-center"
              >
                {loadingPlan === "yearly" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Pilih Paket Tahunan"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
