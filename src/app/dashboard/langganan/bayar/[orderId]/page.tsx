"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import Script from "next/script";
import {
  Loader2,
  QrCode,
  Building2,
  Wallet,
  Store,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

const PAYMENT_METHODS = [
  { id: "qris", label: "QRIS", icon: QrCode, desc: "Scan QR dengan aplikasi e-wallet apapun" },
  { id: "bca_va", label: "Transfer BCA VA", icon: Building2, desc: "Virtual Account Bank BCA" },
  { id: "bni_va", label: "Transfer BNI VA", icon: Building2, desc: "Virtual Account Bank BNI" },
  { id: "gopay", label: "GoPay", icon: Wallet, desc: "Bayar dengan GoPay" },
  { id: "ovo", label: "OVO", icon: Wallet, desc: "Bayar dengan OVO" },
  { id: "alfamart", label: "Alfamart / Indomaret", icon: Store, desc: "Bayar di gerai minimarket" },
];

export default function BayarLanggananPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const token = searchParams.get("token");
  const mode = searchParams.get("mode");
  const orderId = params.orderId as string;

  const [isSnapLoaded, setIsSnapLoaded] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const isSimulation = token === "SIMULATION_MODE" || mode === "simulation";

  // Real Midtrans mode
  useEffect(() => {
    if (!isSimulation && isSnapLoaded && token) {
      // @ts-ignore
      window.snap.pay(token, {
        onSuccess: () => router.push("/dashboard/langganan/sukses"),
        onPending: () => router.push("/dashboard/langganan"),
        onError: () => router.push("/dashboard/langganan/gagal"),
        onClose: () => router.push("/dashboard/langganan"),
      });
    }
  }, [isSnapLoaded, token, router, isSimulation]);

  const handleConfirmPayment = async () => {
    if (!selectedMethod) return;
    setIsConfirming(true);
    try {
      const res = await fetch("/api/payment/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIsDone(true);
      setTimeout(() => router.push("/dashboard/langganan/sukses"), 1500);
    } catch (err) {
      alert("Gagal konfirmasi pembayaran. Coba lagi.");
      setIsConfirming(false);
    }
  };

  // --- SIMULATION UI ---
  if (isSimulation) {
    return (
      <div className="flex min-h-screen bg-earth-50">
        <DashboardSidebar />
        <main className="flex-1 p-6 md:p-10 overflow-auto flex items-start justify-center">
          <div className="bg-white rounded-2xl border border-sand-300 shadow-sm w-full max-w-md">
            {/* Header */}
            <div className="p-6 border-b border-sand-300 flex items-center gap-3">
              <div className="bg-green-50 p-2 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <h2 className="font-medium text-earth-900">Halaman Pembayaran</h2>
                <p className="text-xs text-amber-600 font-medium mt-0.5">⚠ Mode Simulasi (Tidak ada biaya nyata)</p>
              </div>
            </div>

            {/* Order Info */}
            <div className="p-6 border-b border-sand-300 bg-earth-50/50">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-earth-500">Order ID</span>
                <span className="font-mono text-xs text-earth-700 truncate max-w-[60%] text-right">{orderId}</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-earth-500">Produk</span>
                <span className="text-earth-900 font-medium">Langganan Dessa.id</span>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-sand-300">
                <span className="font-medium text-earth-900">Total Bayar</span>
                <span className="text-xl font-bold text-green-700">Rp {orderId.includes("dessa") ? "—" : "—"}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="p-6">
              <p className="text-sm font-medium text-earth-900 mb-4">Pilih Metode Pembayaran</p>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMethod(m.id)}
                    disabled={isConfirming || isDone}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border text-left transition-all ${
                      selectedMethod === m.id
                        ? "border-green-700 bg-green-50"
                        : "border-sand-300 hover:border-earth-400 bg-white"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${selectedMethod === m.id ? "bg-green-100 text-green-700" : "bg-earth-100 text-earth-500"}`}>
                      <m.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${selectedMethod === m.id ? "text-green-900" : "text-earth-900"}`}>{m.label}</p>
                      <p className="text-xs text-earth-500">{m.desc}</p>
                    </div>
                    {selectedMethod === m.id && (
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmPayment}
                disabled={!selectedMethod || isConfirming || isDone}
                className="mt-6 w-full bg-green-700 text-white rounded-xl py-3.5 font-medium hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDone ? (
                  <><CheckCircle2 className="w-5 h-5" /> Pembayaran Dikonfirmasi!</>
                ) : isConfirming ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</>
                ) : (
                  "Konfirmasi Pembayaran (Simulasi)"
                )}
              </button>

              <p className="text-center text-xs text-earth-400 mt-4">
                Ini adalah simulasi. Tidak ada uang yang ditagih.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --- REAL MIDTRANS MODE (loading while Snap opens) ---
  return (
    <div className="flex min-h-screen bg-earth-50">
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        onLoad={() => setIsSnapLoaded(true)}
      />
      <DashboardSidebar />
      <main className="flex-1 p-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl border border-sand-300 shadow-sm text-center max-w-sm w-full">
          <Loader2 className="w-10 h-10 text-green-700 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-medium text-earth-900 mb-2">Memuat Pembayaran...</h2>
          <p className="text-sm text-earth-500">
            Order ID:{" "}
            <span className="font-mono text-xs">{orderId}</span>
          </p>
        </div>
      </main>
    </div>
  );
}
