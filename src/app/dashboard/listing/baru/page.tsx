"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Upload, MapPin, ChevronRight, CheckCircle, X, Loader2 } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useAuth } from "@/context/AuthContext";

const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false });

const CATEGORIES = ["Hunian", "Kebun", "Pertanian", "Investasi", "Lainnya"];
const DOC_TYPES = [
  { value: "SHM", label: "SHM", desc: "Sertifikat Hak Milik — kepemilikan penuh" },
  { value: "SHGB", label: "SHGB", desc: "Sertifikat Hak Guna Bangunan" },
  { value: "Girik", label: "Girik", desc: "Surat keterangan kepemilikan tradisional" },
  { value: "AJB", label: "AJB", desc: "Akta Jual Beli dari notaris" },
];

export default function BuatListingPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [checkingSub, setCheckingSub] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/masuk");
      return;
    }

    // Check subscription status via session-based API
    fetch("/api/subscription/status")
      .then(res => res.json())
      .then(data => {
        if (data.status !== "active" && !data.isWhitelisted) {
          router.replace("/dashboard/langganan/pilih-paket");
        } else {
          setCheckingSub(false);
        }
      })
      .catch(() => {
        alert("Gagal memverifikasi status langganan.");
        router.replace("/dashboard");
      });
  }, [isLoggedIn, router]);

  const [form, setForm] = useState({
    judul: "", kategori: "", deskripsi: "", luas: "", harga: "",
    dokumen: "", certificateFile: "", lat: "", lng: "", photos: [] as string[],
  });
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingCert, setIsUploadingCert] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const formatHarga = (val: string) => {
    const num = val.replace(/\D/g, "");
    if (!num) return "";
    return "Rp " + parseInt(num).toLocaleString("id-ID");
  };

  const handleHarga = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    set("harga", raw);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentCount = form.photos.length;
    const remaining = 10 - currentCount;
    if (remaining <= 0) {
      alert("Maksimal 10 foto.");
      return;
    }

    // Take only as many files as the remaining slots
    const toUpload = Array.from(files).slice(0, remaining);

    setIsUploading(true);
    const uploaded: string[] = [];

    for (const file of toUpload) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" melebihi 5MB dan dilewati.`);
        continue;
      }
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload gagal");
        const data = await res.json();
        uploaded.push(data.url);
      } catch {
        alert(`Gagal mengunggah ${file.name}.`);
      }
    }

    if (uploaded.length > 0) {
      setForm(prev => ({ ...prev, photos: [...prev.photos, ...uploaded] }));
    }
    setIsUploading(false);
    // Reset input so same files can be selected again
    e.target.value = "";
  };

  const handleCertUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran maksimal file 5MB");
      return;
    }

    setIsUploadingCert(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload gagal");
      const data = await res.json();
      set("certificateFile", data.url);
    } catch (error) {
      alert("Gagal mengunggah sertifikat.");
    } finally {
      setIsUploadingCert(false);
    }
  };

  const removePhoto = (index: number) => {
    setForm(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    if (!form.judul || !form.kategori || !form.luas || !form.harga || !form.dokumen || !form.lat) {
      alert("Mohon lengkapi semua field yang wajib (*)");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.judul,
          description: form.deskripsi,
          category: form.kategori,
          area: parseFloat(form.luas) || 0,
          price: parseInt(form.harga) || 0,
          docType: form.dokumen,
          certificateFile: form.certificateFile || null,
          latitude: parseFloat(form.lat) || 0,
          longitude: parseFloat(form.lng) || 0,
          status: isDraft ? "draft" : "pending",
          photos: form.photos, // send all photos
          image: form.photos[0] || null,
        })
      });

      if (!res.ok) throw new Error("Gagal menyimpan listing");
      
      if (isDraft) { 
        alert("Draft tersimpan!"); 
        router.push("/dashboard/listing");
      } else {
        setShowModal(true);
      }
    } catch (error) {
      alert("Terjadi kesalahan, coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) return null;
  if (checkingSub) {
    return (
      <div className="flex min-h-screen bg-earth-50 items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-earth-50">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-earth-500 mb-6">
            <Link href="/dashboard" className="hover:text-earth-700">Dashboard</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="hover:text-earth-700 cursor-pointer">Listing Saya</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-earth-700 font-medium">Buat Listing Baru</span>
          </nav>

          <h1 className="font-heading text-3xl text-earth-900 mb-8">Buat Listing Lahan Baru</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* SECTION 1: INFORMASI DASAR */}
            <div className="bg-white border border-sand-300 rounded-2xl p-6 space-y-5">
              <h2 className="font-medium text-earth-900 border-b border-sand-300 pb-3">1. Informasi Dasar</h2>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-medium text-earth-900">Judul Listing *</label>
                  <span className="text-xs text-earth-500">{form.judul.length}/80</span>
                </div>
                <input
                  maxLength={80} value={form.judul} onChange={e => set("judul", e.target.value)}
                  placeholder="Contoh: Lahan kebun Ungaran, cocok untuk villa"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30"
                />
                <p className="text-xs text-earth-500 mt-1">Maksimal 80 karakter</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-900 mb-2">Kategori Lahan *</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat} type="button" onClick={() => set("kategori", cat)}
                      className={`px-4 py-2 rounded-lg border text-sm transition-colors ${form.kategori === cat ? "bg-green-700 border-green-700 text-white" : "bg-white border-sand-300 text-earth-700 hover:border-green-700"}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-900 mb-1.5">Deskripsi *</label>
                <textarea rows={4} value={form.deskripsi} onChange={e => set("deskripsi", e.target.value)}
                  placeholder="Ceritakan kondisi, potensi, dan keunggulan lahan Anda..."
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30 resize-none" />
              </div>
            </div>

            {/* SECTION 2: SPESIFIKASI & HARGA */}
            <div className="bg-white border border-sand-300 rounded-2xl p-6 space-y-5">
              <h2 className="font-medium text-earth-900 border-b border-sand-300 pb-3">2. Spesifikasi & Harga</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-earth-900 mb-1.5">Luas Lahan (m²) *</label>
                  <input type="number" min={1} value={form.luas} onChange={e => set("luas", e.target.value)}
                    placeholder="800"
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-900 mb-1.5">Harga (Rp) *</label>
                  <input type="text" value={form.harga ? formatHarga(form.harga) : ""} onChange={handleHarga}
                    placeholder="Rp 120.000.000"
                    className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-900 mb-3">Status Dokumen *</label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {DOC_TYPES.map(doc => (
                    <button key={doc.value} type="button" onClick={() => set("dokumen", doc.value)}
                      className={`text-left p-3 rounded-xl border transition-all ${form.dokumen === doc.value ? "border-green-700 bg-green-50" : "border-sand-300 hover:border-earth-500"}`}>
                      <p className={`text-sm font-medium ${form.dokumen === doc.value ? "text-green-700" : "text-earth-900"}`}>{doc.label}</p>
                      <p className="text-xs text-earth-500 mt-0.5">{doc.desc}</p>
                    </button>
                  ))}
                </div>

                <label className="block text-sm font-medium text-earth-900 mb-1.5">Upload Bukti Sertifikat / Dokumen</label>
                <div className="flex items-center gap-4">
                  <label className={`flex items-center justify-center px-4 py-2 border border-sand-300 rounded-xl text-sm font-medium cursor-pointer transition-colors ${isUploadingCert ? "opacity-50" : "hover:bg-earth-50 text-earth-700"}`}>
                    <input type="file" accept=".pdf,image/*" className="hidden" onChange={handleCertUpload} disabled={isUploadingCert} />
                    {isUploadingCert ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                    {isUploadingCert ? "Mengunggah..." : "Pilih File"}
                  </label>
                  {form.certificateFile && (
                    <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Dokumen terunggah
                      <button type="button" onClick={() => set("certificateFile", "")} className="ml-2 text-red-500 hover:text-red-700">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-earth-500 mt-1.5">Format PDF, JPG, PNG. Maksimal 5MB.</p>
              </div>
            </div>

            {/* SECTION 3: LOKASI */}
            <div className="bg-white border border-sand-300 rounded-2xl p-6 space-y-4">
              <h2 className="font-medium text-earth-900 border-b border-sand-300 pb-3">3. Tandai Lokasi di Peta *</h2>
              <p className="text-sm text-earth-500">Klik pada peta untuk menentukan titik koordinat lahan secara presisi.</p>

              {/* Map Placeholder */}
              <div className="h-72 rounded-xl bg-earth-200 border border-sand-300 relative overflow-hidden z-0">
                <MapPicker 
                  lat={parseFloat(form.lat)} 
                  lng={parseFloat(form.lng)} 
                  onChange={(lat, lng) => {
                    set("lat", String(lat));
                    set("lng", String(lng));
                  }} 
                />
              </div>

              {form.lat && (
                <div className="flex gap-4">
                  <div className="flex-1 bg-earth-50 rounded-xl px-4 py-3 border border-sand-300">
                    <p className="text-xs text-earth-500 mb-0.5">Latitude</p>
                    <p className="text-sm font-medium text-earth-900">{form.lat}</p>
                  </div>
                  <div className="flex-1 bg-earth-50 rounded-xl px-4 py-3 border border-sand-300">
                    <p className="text-xs text-earth-500 mb-0.5">Longitude</p>
                    <p className="text-sm font-medium text-earth-900">{form.lng}</p>
                  </div>
                  <button type="button" onClick={() => { set("lat", ""); set("lng", ""); }}
                    className="px-4 py-2 text-sm text-earth-500 border border-sand-300 rounded-xl hover:bg-earth-30 transition-colors self-end">
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* SECTION 4: UPLOAD FOTO */}
            <div className="bg-white border border-sand-300 rounded-2xl p-6 space-y-4">
              <h2 className="font-medium text-earth-900 border-b border-sand-300 pb-3">4. Upload Foto Lahan *</h2>

              <label className={`block border-2 border-dashed border-sand-300 rounded-xl p-8 text-center transition-colors cursor-pointer ${isUploading ? "opacity-50 pointer-events-none" : "hover:border-green-700 hover:bg-green-50/30"}`}>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-green-700 animate-spin mx-auto mb-3" />
                ) : (
                  <Upload className="w-8 h-8 text-earth-400 mx-auto mb-3" />
                )}
                <p className="text-sm text-earth-700 font-medium">{isUploading ? "Mengunggah..." : "Klik atau pilih foto lahan"}</p>
                <p className="text-xs text-earth-500 mt-1">JPG, PNG · Maks 5MB per foto · Maks 10 foto</p>
              </label>

              {form.photos.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {form.photos.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-lg border border-sand-300 overflow-hidden group">
                      <img src={url} alt="Lahan" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4" />
                      </button>
                      {i === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-green-700/80 text-white text-[10px] py-1 text-center font-medium backdrop-blur-sm">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 pb-8">
              <button type="button" onClick={(e) => handleSubmit(e, true)} disabled={isSubmitting}
                className="flex-1 border border-earth-500 text-earth-700 rounded-xl py-3 text-sm font-medium hover:bg-earth-30 transition-colors disabled:opacity-50">
                Simpan Draft
              </button>
              <button type="submit" disabled={isSubmitting}
                className="flex-1 bg-green-700 text-white rounded-xl py-3 text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50">
                {isSubmitting ? "Menyimpan..." : "Kirim untuk Review"}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* SUCCESS MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-earth-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-700" />
            </div>
            <h3 className="font-heading text-xl text-earth-900 mb-2">Listing Terkirim!</h3>
            <p className="text-sm text-earth-500 mb-6">Admin akan mereview listing Anda dalam 1×24 jam. Anda akan mendapat notifikasi setelah proses review selesai.</p>
            <button onClick={() => { setShowModal(false); router.push("/dashboard/listing"); }}
              className="w-full bg-green-700 text-white rounded-xl py-3 text-sm font-medium hover:bg-green-600 transition-colors">
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
