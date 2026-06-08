"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  FileText,
  ExternalLink,
  ZoomIn,
} from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Badge } from "@/components/Badge";
import { useAuth } from "@/context/AuthContext";

export default function AdminReviewPage({ params }: { params: { id: string } }) {
  const { isAdmin, isLoggedIn } = useAuth();
  const router = useRouter();

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [catatan, setCatatan] = useState("");
  const [modal, setModal] = useState<"approve" | "reject" | null>(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [done, setDone] = useState<"approved" | "rejected" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) { router.replace("/masuk"); return; }
    if (!isAdmin) { router.replace("/dashboard"); return; }

    fetch(`/api/listings/${params.id}`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => {
        setListing(data);
        setLoading(false);
      })
      .catch(() => {
        alert("Listing tidak ditemukan");
        router.push("/admin");
        setLoading(false);
      });
  }, [isLoggedIn, isAdmin, router, params.id]);

  if (!isLoggedIn || !isAdmin) return null;

  if (loading) {
    return (
      <div className="flex min-h-screen bg-earth-50">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-earth-500">Memuat data...</p>
        </main>
      </div>
    );
  }

  if (!listing) return null;

  // Parse photos array — field can be JSON string or single image
  const photosArray: string[] = (() => {
    try {
      const p = listing.photos ? JSON.parse(listing.photos) : [];
      return Array.isArray(p) && p.length > 0 ? p : listing.image ? [listing.image] : [];
    } catch {
      return listing.image ? [listing.image] : [];
    }
  })();

  const formatRp = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
  const pricePerM2 = Math.round(listing.price / listing.area);
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  const handleConfirm = async () => {
    if (!modal) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/listings/${listing.id}/${modal}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNote: catatan }),
      });
      if (!res.ok) throw new Error();
      setDone(modal === "approve" ? "approved" : "rejected");
      setModal(null);
      setTimeout(() => router.push("/admin"), 2000);
    } catch {
      alert("Terjadi kesalahan, coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-earth-50">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-earth-500 mb-6">
            <Link href="/admin" className="hover:text-earth-700">Admin</Link>
            <ChevronRight className="w-3 h-3" />
            <span>Review Listing</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-earth-700 font-medium line-clamp-1">{listing.title}</span>
          </nav>

          {/* Done Banner */}
          {done && (
            <div className={`mb-6 flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${done === "approved" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
              {done === "approved" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              {done === "approved" ? "Listing disetujui & akan segera tayang." : "Listing ditolak. Catatan dikirim ke penjual."}
              <span className="ml-auto text-xs opacity-70">Mengarahkan ke Admin Panel...</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ─── LEFT PANEL ─── */}
            <div className="lg:col-span-2 space-y-6">

              {/* GALERI FOTO */}
              <div className="bg-white border border-sand-300 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-sand-300 flex items-center justify-between">
                  <h2 className="font-medium text-earth-900">Foto Lahan</h2>
                  <span className="text-xs text-earth-500 bg-earth-100 px-2 py-1 rounded-full">
                    {photosArray.length} foto
                  </span>
                </div>

                {/* Main photo */}
                <div
                  className="relative aspect-video bg-earth-200 flex items-center justify-center cursor-zoom-in group"
                  onClick={() => photosArray[activePhoto] && setLightbox(photosArray[activePhoto])}
                >
                  {photosArray.length > 0 ? (
                    <>
                      <img
                        src={photosArray[activePhoto]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-earth-400">
                      <ImageIcon className="w-14 h-14 opacity-30" />
                      <p className="text-sm">Tidak ada foto</p>
                    </div>
                  )}
                  {listing.verified && (
                    <div className="absolute top-3 left-3"><Badge type="verified" /></div>
                  )}
                  {photosArray.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                      {activePhoto + 1} / {photosArray.length}
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {photosArray.length > 1 && (
                  <div className="flex gap-2 p-4 flex-wrap">
                    {photosArray.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePhoto(i)}
                        className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${activePhoto === i ? "border-green-700 ring-2 ring-green-700/30" : "border-transparent hover:border-earth-400"}`}
                      >
                        <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* SPESIFIKASI */}
              <div className="bg-white border border-sand-300 rounded-2xl p-5">
                <h2 className="font-medium text-earth-900 mb-4">Detail Spesifikasi</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Judul", value: listing.title },
                    { label: "Kategori", value: listing.category },
                    { label: "Luas", value: `${listing.area.toLocaleString("id-ID")} m²` },
                    { label: "Harga", value: formatRp(listing.price) },
                    { label: "Harga/m²", value: `${formatRp(pricePerM2)} / m²` },
                    { label: "Jenis Dokumen", value: listing.docType },
                    { label: "Tanggal Upload", value: formatDate(listing.createdAt) },
                    { label: "Status", value: listing.status },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-earth-500 mb-0.5">{label}</p>
                      <p className="text-sm font-medium text-earth-900 capitalize">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Koordinat */}
                <div className="mt-5 pt-4 border-t border-sand-300">
                  <p className="text-xs text-earth-500 mb-2">Koordinat GPS</p>
                  <div className="flex gap-3">
                    <div className="flex-1 bg-earth-50 border border-sand-300 rounded-xl px-4 py-3">
                      <p className="text-[10px] text-earth-400 mb-0.5">Latitude</p>
                      <p className="text-sm font-mono text-earth-900">{listing.latitude}</p>
                    </div>
                    <div className="flex-1 bg-earth-50 border border-sand-300 rounded-xl px-4 py-3">
                      <p className="text-[10px] text-earth-400 mb-0.5">Longitude</p>
                      <p className="text-sm font-mono text-earth-900">{listing.longitude}</p>
                    </div>
                    <a
                      href={`https://www.google.com/maps?q=${listing.latitude},${listing.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-green-700 hover:text-green-600 border border-green-200 bg-green-50 px-3 rounded-xl self-stretch"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Buka Maps
                    </a>
                  </div>
                </div>
              </div>

              {/* DESKRIPSI */}
              <div className="bg-white border border-sand-300 rounded-2xl p-5">
                <h2 className="font-medium text-earth-900 mb-3">Deskripsi Lahan</h2>
                <p className="text-sm text-earth-700 leading-relaxed whitespace-pre-line">
                  {listing.description || <span className="text-earth-400 italic">Tidak ada deskripsi.</span>}
                </p>
              </div>

              {/* DOKUMEN LEGALITAS */}
              <div className={`border rounded-2xl p-5 ${listing.certificateFile ? "bg-blue-50 border-blue-200" : "bg-white border-sand-300"}`}>
                <h2 className="font-medium text-earth-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Dokumen Legalitas
                  {listing.certificateFile && (
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-bold ml-1">ADA</span>
                  )}
                </h2>

                {listing.certificateFile ? (
                  <div className="flex flex-col gap-3">
                    {/* Preview jika gambar */}
                    {/\.(jpg|jpeg|png|webp|gif)$/i.test(listing.certificateFile) ? (
                      <div
                        className="relative aspect-video max-h-64 bg-earth-100 rounded-xl overflow-hidden border border-blue-200 cursor-zoom-in group"
                        onClick={() => setLightbox(listing.certificateFile)}
                      >
                        <img
                          src={listing.certificateFile}
                          alt="Dokumen Sertifikat"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 bg-white border border-blue-200 rounded-xl p-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-earth-900">Dokumen PDF</p>
                          <p className="text-xs text-earth-500 mt-0.5">File sertifikat/akta yang diupload penjual</p>
                        </div>
                      </div>
                    )}

                    <a
                      href={listing.certificateFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-600 bg-white border border-blue-200 px-4 py-2.5 rounded-xl transition-colors w-fit"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Buka / Download Dokumen
                    </a>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-sm text-earth-500">
                    <div className="w-10 h-10 bg-earth-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-earth-300" />
                    </div>
                    <div>
                      <p className="font-medium text-earth-700">Tidak ada dokumen diunggah</p>
                      <p className="text-xs text-earth-400">Penjual belum melampirkan bukti sertifikat.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* DATA PENJUAL */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <h2 className="font-medium text-amber-800 mb-4 flex items-center gap-2">
                  <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded uppercase font-black tracking-wider">Admin Only</span>
                  Data Penjual
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold text-sm">
                      {listing.seller?.fullName?.substring(0, 2).toUpperCase() || "??"}
                    </div>
                    <div>
                      <p className="font-medium text-amber-900 text-sm">{listing.seller?.fullName || "Tidak Diketahui"}</p>
                      <p className="text-xs text-amber-600">Penjual Terdaftar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-amber-700">
                    <Phone className="w-4 h-4" />
                    <span>{listing.seller?.whatsapp ? `+62${listing.seller.whatsapp}` : "Tidak ada nomor"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-amber-700">
                    <Mail className="w-4 h-4" />
                    <span>{listing.seller?.email || "Tidak ada email"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── RIGHT PANEL — Keputusan ─── */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 bg-white border border-sand-300 rounded-2xl p-5 space-y-4 shadow-sm">
                <div>
                  <p className="text-xs text-earth-500 mb-2 uppercase tracking-wider">Status Saat Ini</p>
                  <span className={`inline-block text-sm font-semibold px-3 py-1.5 rounded-full ${listing.status === "pending" ? "bg-amber-100 text-amber-800" : listing.status === "published" ? "bg-green-100 text-green-800" : "bg-earth-100 text-earth-800"}`}>
                    {listing.status === "pending" ? "⏳ Menunggu Review" : listing.status === "published" ? "✅ Tayang" : listing.status.toUpperCase()}
                  </span>
                </div>

                {/* Quick summary */}
                <div className="bg-earth-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-earth-500">Foto</span>
                    <span className={`font-medium ${photosArray.length > 0 ? "text-green-700" : "text-red-600"}`}>
                      {photosArray.length > 0 ? `${photosArray.length} foto ✓` : "Tidak ada ✗"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-earth-500">Koordinat</span>
                    <span className={`font-medium ${listing.latitude ? "text-green-700" : "text-red-600"}`}>
                      {listing.latitude ? "Ada ✓" : "Tidak ada ✗"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-earth-500">Sertifikat</span>
                    <span className={`font-medium ${listing.certificateFile ? "text-green-700" : "text-amber-600"}`}>
                      {listing.certificateFile ? "Ada ✓" : "Belum opsional"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-earth-500">Deskripsi</span>
                    <span className={`font-medium ${listing.description ? "text-green-700" : "text-red-600"}`}>
                      {listing.description ? "Ada ✓" : "Tidak ada ✗"}
                    </span>
                  </div>
                </div>

                {listing.status === "pending" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-earth-900 mb-2">Catatan untuk Penjual</label>
                      <textarea
                        rows={4} value={catatan} onChange={e => setCatatan(e.target.value)}
                        placeholder="Tulis catatan jika ada revisi yang diperlukan..."
                        className="w-full px-4 py-3 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30 resize-none"
                      />
                    </div>

                    <div className="space-y-2.5">
                      <button
                        onClick={() => setModal("approve")} disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 w-full bg-green-700 text-white rounded-xl py-3 text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Setujui & Tayangkan
                      </button>
                      <button
                        onClick={() => setModal("reject")} disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 w-full bg-red-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-red-500 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Tolak & Minta Revisi
                      </button>
                    </div>
                    <p className="text-xs text-earth-400 text-center">Listing yang disetujui langsung tayang di halaman publik.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Preview"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl font-light"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-earth-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${modal === "approve" ? "bg-green-50" : "bg-red-50"}`}>
              {modal === "approve" ? <CheckCircle className="w-7 h-7 text-green-700" /> : <XCircle className="w-7 h-7 text-red-600" />}
            </div>
            <h3 className="font-heading text-xl text-earth-900 text-center mb-2">
              {modal === "approve" ? "Setujui listing ini?" : "Tolak listing ini?"}
            </h3>
            <p className="text-sm text-earth-500 text-center mb-6">
              {modal === "approve"
                ? "Listing akan langsung tayang di halaman publik."
                : "Listing ditolak dan catatan dikirimkan ke penjual."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setModal(null)} disabled={isSubmitting}
                className="flex-1 border border-sand-300 text-earth-700 rounded-xl py-2.5 text-sm hover:bg-earth-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm} disabled={isSubmitting}
                className={`flex-1 text-white rounded-xl py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${modal === "approve" ? "bg-green-700 hover:bg-green-600" : "bg-red-600 hover:bg-red-500"}`}
              >
                {isSubmitting ? "Memproses..." : "Konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
