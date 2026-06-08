"use client";

import { useState } from "react";
import Link from "next/link";
import { TreePine, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DaftarPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({ nama: "", whatsapp: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nama.trim()) e.nama = "Nama wajib diisi";
    if (!form.whatsapp.trim()) e.whatsapp = "Nomor WhatsApp wajib diisi";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Format email tidak valid";
    if (form.password.length < 8) e.password = "Password minimal 8 karakter";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Password tidak cocok";
    if (!agreed) e.agreed = "Anda harus menyetujui Syarat & Ketentuan";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setIsSubmitting(true);
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: form.nama,
            email: form.email,
            whatsapp: form.whatsapp,
            password: form.password,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal mendaftar");

        setSubmitted(true);
        // Force refresh session in context
        await login(form.email, form.password);
        setTimeout(() => router.push("/dashboard"), 1500);
      } catch (error: any) {
        setErrors({ ...errs, server: error.message });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isValid = form.nama && form.whatsapp && form.email && form.password.length >= 8 && form.password === form.confirmPassword && agreed;

  if (submitted) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <TreePine className="w-8 h-8 text-green-700" />
          </div>
          <p className="text-earth-900 font-medium">Akun berhasil dibuat! Mengarahkan ke dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 text-earth-900 font-heading text-3xl tracking-tight mb-8">
          <TreePine className="w-8 h-8 text-green-700" />
          <span>dessa<span className="text-green-700">.</span>id</span>
        </Link>

        <div className="bg-white rounded-2xl border border-sand-300 shadow-sm p-8">
          <h1 className="font-heading text-2xl text-earth-900 mb-1">Daftarkan akun penjual</h1>
          <p className="text-sm text-earth-500 mb-6">
            Sudah punya akun?{" "}
            <Link href="/masuk" className="text-green-700 hover:underline font-medium">Masuk di sini</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.server && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-5 text-sm">
                {errors.server}
              </div>
            )}
            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-earth-900 mb-1.5">Nama Lengkap</label>
              <input type="text" placeholder="Mohammad Abdul Faiz" value={form.nama} onChange={e => set("nama", e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30 ${errors.nama ? "border-red-400" : "border-sand-300"}`} />
              {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-medium text-earth-900 mb-1.5">Nomor WhatsApp</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-earth-50 border border-r-0 border-sand-300 rounded-l-xl text-sm text-earth-500 shrink-0">+62</span>
                <input type="tel" placeholder="8123456789" value={form.whatsapp} onChange={e => set("whatsapp", e.target.value)}
                  className={`flex-1 px-4 py-2.5 rounded-r-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30 ${errors.whatsapp ? "border-red-400" : "border-sand-300"}`} />
              </div>
              <p className="text-xs text-earth-500 mt-1">Nomor ini akan digunakan pembeli untuk menghubungi Anda</p>
              {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-earth-900 mb-1.5">Alamat Email</label>
              <input type="email" placeholder="email@contoh.com" value={form.email} onChange={e => set("email", e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30 ${errors.email ? "border-red-400" : "border-sand-300"}`} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-earth-900 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} placeholder="Min. 8 karakter" value={form.password} onChange={e => set("password", e.target.value)}
                  className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30 ${errors.password ? "border-red-400" : "border-sand-300"}`} />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-500 hover:text-earth-700">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-earth-900 mb-1.5">Konfirmasi Password</label>
              <div className="relative">
                <input type={showConfirm ? "text" : "password"} placeholder="Ulangi password" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)}
                  className={`w-full px-4 py-2.5 pr-11 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30 ${errors.confirmPassword ? "border-red-400" : "border-sand-300"}`} />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-500 hover:text-earth-700">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* S&K */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-green-700 shrink-0" />
                <span className="text-sm text-earth-700">
                  Saya menyetujui{" "}
                  <a href="#" className="text-green-700 underline">Syarat & Ketentuan</a>{" "}
                  Dessa.id
                </span>
              </label>
              {errors.agreed && <p className="text-red-500 text-xs mt-1">{errors.agreed}</p>}
            </div>

            <button type="submit" disabled={!isValid || isSubmitting}
              className="w-full bg-green-700 text-white rounded-xl py-3 text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              {isSubmitting ? "Memproses..." : "Daftar Sekarang"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <hr className="flex-1 border-sand-300" />
            <span className="text-xs text-earth-500">atau</span>
            <hr className="flex-1 border-sand-300" />
          </div>

          <p className="text-center text-xs text-earth-500">
            Masuk sebagai admin?{" "}
            <Link href="/masuk?role=admin" className="text-green-700 hover:underline">Login Admin</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
