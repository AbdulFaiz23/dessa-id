"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { TreePine, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdminRoute = searchParams.get("role") === "admin";
  const { login } = useAuth();

  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Email dan password wajib diisi."); return; }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { setError("Format email tidak valid."); return; }
    setError("");
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Gagal masuk. Periksa email dan password Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 text-earth-900 font-heading text-3xl tracking-tight mb-8">
          <TreePine className="w-8 h-8 text-green-700" />
          <span>dessa<span className="text-green-700">.</span>id</span>
        </Link>

        <div className="bg-white rounded-2xl border border-sand-300 shadow-sm p-8">
          <h1 className="font-heading text-2xl text-earth-900 mb-1">Masuk ke akun Anda</h1>
          <p className="text-sm text-earth-500 mb-6">
            Belum punya akun?{" "}
            <Link href="/daftar" className="text-green-700 hover:underline font-medium">Daftar di sini</Link>
          </p>

          {/* Admin Banner */}
          {isAdminRoute && (
            <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl p-3 mb-5 text-sm">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Login sebagai <strong>Admin</strong> — gunakan email admin@dessa.id</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-earth-900 mb-1.5">Email</label>
              <input type="email" placeholder="email@contoh.com" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-earth-900">Password</label>
                <a href="#" className="text-xs text-green-700 hover:underline">Lupa password?</a>
              </div>
              <div className="relative">
                <input type={showPass ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30" />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-500 hover:text-earth-700">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-green-700 text-white rounded-xl py-3 text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50">
              {isSubmitting ? "Memproses..." : "Masuk"}
            </button>
          </form>

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

export default function MasukPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-earth-50" />}>
      <LoginForm />
    </Suspense>
  );
}
