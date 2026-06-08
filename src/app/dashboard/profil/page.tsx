"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, Mail, Save, CheckCircle } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";
import { CURRENT_USER } from "@/lib/data";

export default function ProfilPage() {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    nama: user?.name ?? CURRENT_USER.name,
    whatsapp: CURRENT_USER.whatsapp.replace("62", "0"),
    email: user?.email ?? "budi@email.com",
    desa: "Ungaran Barat",
    kecamatan: "Ungaran",
    kabupaten: "Semarang",
  });

  useEffect(() => {
    if (!isLoggedIn) router.replace("/masuk");
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = form.nama
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-earth-50">
      <DashboardSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-medium text-earth-900 mb-1">Profil Saya</h1>
          <p className="text-sm text-earth-500 mb-8">Informasi akun dan data diri penjual</p>

          {/* Avatar Section */}
          <div className="bg-white border border-sand-300 rounded-2xl p-6 mb-6 flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-earth-900 flex items-center justify-center text-earth-50 font-heading text-2xl shrink-0">
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-medium text-earth-900">{form.nama}</h2>
              <p className="text-sm text-earth-500">{form.email}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="w-2 h-2 rounded-full bg-green-600" />
                <span className="text-xs text-green-700 font-medium">Penjual Aktif</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Data Diri */}
            <div className="bg-white border border-sand-300 rounded-2xl p-6 space-y-5">
              <h2 className="font-medium text-earth-900 border-b border-sand-300 pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-earth-500" />
                Data Diri
              </h2>

              <div>
                <label className="block text-sm font-medium text-earth-900 mb-1.5">Nama Lengkap</label>
                <input value={form.nama} onChange={(e) => set("nama", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30" />
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-900 mb-1.5">Nomor WhatsApp</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-earth-50 border border-r-0 border-sand-300 rounded-l-xl text-sm text-earth-500 shrink-0">+62</span>
                  <input type="tel" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-r-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-900 mb-1.5">Alamat Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-500" />
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30" />
                </div>
              </div>
            </div>

            {/* Alamat */}
            <div className="bg-white border border-sand-300 rounded-2xl p-6 space-y-5">
              <h2 className="font-medium text-earth-900 border-b border-sand-300 pb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-earth-500" />
                Lokasi Domisili
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-earth-900 mb-1.5">Desa/Kelurahan</label>
                  <input value={form.desa} onChange={(e) => set("desa", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-900 mb-1.5">Kecamatan</label>
                  <input value={form.kecamatan} onChange={(e) => set("kecamatan", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-900 mb-1.5">Kabupaten/Kota</label>
                <input value={form.kabupaten} onChange={(e) => set("kabupaten", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30" />
              </div>
            </div>

            {/* Password */}
            <div className="bg-white border border-sand-300 rounded-2xl p-6 space-y-4">
              <h2 className="font-medium text-earth-900 border-b border-sand-300 pb-3">Ubah Password</h2>
              <div>
                <label className="block text-sm font-medium text-earth-900 mb-1.5">Password Lama</label>
                <input type="password" placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-earth-900 mb-1.5">Password Baru</label>
                  <input type="password" placeholder="Min. 8 karakter"
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-900 mb-1.5">Konfirmasi</label>
                  <input type="password" placeholder="Ulangi password"
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30" />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4 pb-8">
              <button type="submit"
                className="flex items-center gap-2 bg-green-700 text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </button>
              {saved && (
                <div className="flex items-center gap-2 text-green-700 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Perubahan berhasil disimpan!
                </div>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
