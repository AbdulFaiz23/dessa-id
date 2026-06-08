"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Calendar, MessageCircle, Navigation, Image as ImageIcon, ChevronRight, ShieldCheck, Heart, Share2, Facebook, Link as LinkIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { Badge } from "@/components/Badge";
import { Navbar } from "@/components/Navbar";
import { useWishlist } from "@/hooks/useWishlist";
import { KalkulatorKPR } from "@/components/KalkulatorKPR";

const MapViewer = dynamic(() => import("@/components/MapViewer"), { ssr: false });

export default function DetailLahanPage({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    fetch(`/api/listings/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setListing(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Increment view count
    fetch(`/api/listings/${params.id}/view`, { method: "POST" }).catch(console.error);
  }, [params.id]);

  const { isSaved, toggleWishlist, isLoaded } = useWishlist();

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-earth-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-earth-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col min-h-screen bg-earth-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-earth-500 text-lg mb-4">Lahan tidak ditemukan.</p>
            <Link href="/jelajahi" className="text-green-700 underline">Kembali ke Jelajahi</Link>
          </div>
        </div>
      </div>
    );
  }

  const formatRp = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
  const pricePerM2 = Math.round(listing.price / listing.area);
  const waMessage = encodeURIComponent(`Halo, saya tertarik dengan lahan ${listing.title} di Dessa.id`);
  const sellerWa = listing.seller?.whatsapp || "6281234567890";
  const waLink = `https://wa.me/${sellerWa}?text=${waMessage}`;
  const mapsLink = `https://maps.google.com/?q=${listing.latitude},${listing.longitude}`;

  const photosArray: string[] = (() => {
    try {
      const p = listing.photos ? JSON.parse(listing.photos) : [];
      return Array.isArray(p) && p.length > 0 ? p : listing.image ? [listing.image] : [];
    } catch {
      return listing.image ? [listing.image] : [];
    }
  })();

  const saved = isLoaded && listing && isSaved(listing.id);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Tautan disalin!");
  };

  return (
    <div className="bg-earth-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 w-full flex-1">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-earth-500 mb-6">
            <Link href="/" className="hover:text-earth-700">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/jelajahi" className="hover:text-earth-700">Jelajahi</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-earth-700 line-clamp-1">{listing.title}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* LEFT CONTENT */}
            <div className="md:col-span-2 space-y-6">
              {/* Gallery */}
              <div className="relative">
                <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-earth-200 flex items-center justify-center relative group">
                  {photosArray.length > 0 ? (
                    <img src={photosArray[activePhoto]} alt={listing.title} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-16 h-16 text-earth-500 opacity-30" />
                  )}
                  {/* Visual CSS Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 rotate-[-20deg]">
                    <span className="text-white text-6xl font-black tracking-widest drop-shadow-md mix-blend-overlay">Dessa.id</span>
                  </div>

                  {listing.verified && (
                    <div className="absolute top-4 left-4">
                      <Badge type="verified" />
                    </div>
                  )}
                </div>
                {photosArray.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {photosArray.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePhoto(i)}
                        className={`w-24 shrink-0 aspect-[4/3] rounded-lg overflow-hidden bg-earth-200 flex items-center justify-center border-2 transition-all ${activePhoto === i ? "border-green-700" : "border-transparent hover:border-earth-500"}`}
                      >
                        <img src={url} alt={`thumbnail ${i}`} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info Utama */}
              <div>
                <h1 className="font-heading text-3xl text-earth-900 mb-3 leading-tight">{listing.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-earth-500 mb-4">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{listing.category}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />Ditambah {new Date(listing.createdAt).toLocaleDateString("id-ID")}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  <Badge type="category" value={listing.category} />
                  <Badge type="document" value={listing.docType} />
                  {listing.verified && <Badge type="verified" />}
                </div>
                <hr className="border-sand-300" />
              </div>

              {/* Spesifikasi */}
              <div>
                <h2 className="text-lg font-medium text-earth-900 mb-4">Spesifikasi Lahan</h2>
                <div className="grid grid-cols-2 gap-4 bg-white rounded-xl border border-sand-300 p-5">
                  {[
                    { label: "Luas Lahan", value: `${listing.area} m²` },
                    { label: "Harga", value: formatRp(listing.price) },
                    { label: "Harga/m²", value: `${formatRp(pricePerM2)} / m²` },
                    { label: "Kategori", value: listing.category },
                    { label: "Status Dokumen", value: listing.docType },
                    { label: "Koordinat", value: `${listing.latitude}, ${listing.longitude}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="col-span-1">
                      <p className="text-xs text-earth-500 mb-1">{label}</p>
                      <p className="text-sm font-medium text-earth-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <h2 className="text-lg font-medium text-earth-900 mb-3">Deskripsi Lahan</h2>
                <p className="text-sm text-earth-700 leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>

              {/* Peta Mini */}
              <div>
                <h2 className="text-lg font-medium text-earth-900 mb-3">Lokasi Lahan</h2>
                <div className="h-52 rounded-xl bg-earth-200 border border-sand-300 relative overflow-hidden z-0">
                  <MapViewer 
                    markers={[{
                      id: listing.id,
                      lat: listing.latitude,
                      lng: listing.longitude,
                      title: listing.title,
                      price: listing.price,
                      area: listing.area
                    }]} 
                    zoom={14}
                  />
                </div>
                <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-sm text-green-700 hover:underline">
                  <Navigation className="w-4 h-4" />
                  Buka di Google Maps ↗
                </a>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="md:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white border border-sand-300 rounded-2xl p-5 shadow-sm">
                  {/* Harga */}
                  <div className="mb-5">
                    <p className="text-2xl font-bold text-green-900">{formatRp(listing.price)}</p>
                    <p className="text-sm text-earth-500 mt-1">{formatRp(pricePerM2)} / m²</p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3 mb-5">
                    <a href={waLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-green-700 text-white rounded-xl py-3 text-sm font-medium hover:bg-green-600 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      Hubungi via WhatsApp
                    </a>
                    <button onClick={() => toggleWishlist(listing.id)}
                      className={`flex items-center justify-center gap-2 w-full border rounded-xl py-3 text-sm font-medium transition-colors ${saved ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100' : 'border-sand-300 text-earth-700 hover:bg-earth-50'}`}>
                      <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                      {saved ? 'Tersimpan di Wishlist' : 'Simpan ke Wishlist'}
                    </button>
                    <div className="flex gap-2">
                      <a href={`https://wa.me/?text=${waMessage}%20${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`} target="_blank" rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 border border-sand-300 text-earth-700 rounded-xl py-2 text-xs font-medium hover:bg-earth-50 transition-colors">
                        <Share2 className="w-3.5 h-3.5" />
                        Share
                      </a>
                      <button onClick={copyLink}
                        className="flex-1 flex items-center justify-center gap-2 border border-sand-300 text-earth-700 rounded-xl py-2 text-xs font-medium hover:bg-earth-50 transition-colors">
                        <LinkIcon className="w-3.5 h-3.5" />
                        Salin Tautan
                      </button>
                    </div>
                  </div>

                  <hr className="border-sand-300 mb-5" />

                  {/* Info Penjual */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-earth-900 flex items-center justify-center text-earth-50 font-medium text-sm shrink-0 uppercase">
                      {listing.seller?.fullName?.substring(0, 2) || "??"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-earth-900">{listing.seller?.fullName || "Tanpa Nama"}</p>
                      <div className="flex items-center gap-1 text-xs text-green-700">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Penjual Terverifikasi
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-earth-500 text-center leading-relaxed">
                    Transaksi dilakukan di luar platform. Dessa.id hanya media promosi.
                  </p>
                </div>

                {/* Kalkulator KPR / KPT */}
                <KalkulatorKPR hargaLahan={listing.price} />
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
