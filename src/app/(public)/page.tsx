import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';
import {
  Map as MapIcon,
  ShieldCheck,
  Navigation,
  ArrowRight,
  Star,
  Quote,
  MapPin,
  CheckCircle2,
  Phone,
  TrendingUp,
  Eye,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { LandCard } from "@/components/LandCard";

/* ─── Data statis ─── */
const DUMMY_SELLERS = [
  { id: 1, name: "Budi Santoso", type: "Agen Independen", listings: 12, rating: 4.9, initials: "BS", gradient: "from-amber-500 to-orange-600" },
  { id: 2, name: "Siti Aminah", type: "Pemilik Lahan", listings: 3, rating: 5.0, initials: "SA", gradient: "from-emerald-500 to-teal-600" },
  { id: 3, name: "Agro Jaya Group", type: "Perusahaan Agro", listings: 28, rating: 4.8, initials: "AJ", gradient: "from-green-600 to-lime-600" },
  { id: 4, name: "Herman Supriadi", type: "Pemilik Lahan", listings: 5, rating: 4.7, initials: "HS", gradient: "from-blue-500 to-indigo-600" },
];

const DUMMY_BLOGS = [
  {
    id: 1,
    title: "5 Hal yang Harus Diperhatikan Sebelum Membeli Lahan Pertanian",
    excerpt: "Memilih lahan untuk pertanian tidak boleh sembarangan. Perhatikan unsur hara, sumber air, dan legalitas sebelum berinvestasi.",
    category: "Tips Investasi",
    date: "12 Mei 2026",
    readTime: "5 mnt",
    author: { name: "Rina M.", initials: "RM" },
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Potensi Cuan dari Lahan Kebun Kopi di Dataran Tinggi Jawa Tengah",
    excerpt: "Tren ngopi membuat permintaan biji kopi meningkat pesat. Temukan daerah-daerah potensial untuk kebun kopi Anda sendiri.",
    category: "Peluang Bisnis",
    date: "08 Mei 2026",
    readTime: "7 mnt",
    author: { name: "Ahmad K.", initials: "AK" },
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Mengenal Perbedaan SHM, HGU, dan Girik dalam Jual Beli Tanah",
    excerpt: "Pahami jenis-jenis sertifikat tanah di Indonesia agar investasi lahan Anda aman secara hukum.",
    category: "Legalitas",
    date: "01 Mei 2026",
    readTime: "6 mnt",
    author: { name: "Dr. Hukum S.", initials: "DH" },
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80&auto=format&fit=crop",
  },
];

const DUMMY_LISTINGS = [
  { title: "Lahan Kebun Durian, Bandungan", category: "Kebun", area: 2500, price: 450000000, img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80&auto=format&fit=crop", loc: "Semarang, Jawa Tengah" },
  { title: "Sawah Subur Produktif, Ambarawa", category: "Pertanian", area: 5000, price: 750000000, img: "https://images.unsplash.com/photo-1597211685565-3b62f0da01b7?w=600&q=80&auto=format&fit=crop", loc: "Ambarawa, Jawa Tengah" },
  { title: "Tanah Strategis Pinggir Jalan, Ungaran", category: "Investasi", area: 800, price: 320000000, img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80&auto=format&fit=crop", loc: "Ungaran, Jawa Tengah" },
  { title: "Lahan Hunian View Gunung Merbabu", category: "Hunian", area: 1200, price: 550000000, img: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=600&q=80&auto=format&fit=crop", loc: "Boyolali, Jawa Tengah" },
];

/* ─── Helper ─── */
function formatRupiah(n: number) {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)} M`;
  return `Rp ${(n / 1_000_000).toFixed(0)} Jt`;
}

/* ─── Page ─── */
export default async function LandingPage() {
  const published = await prisma.listing.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
    take: 4,
    include: { seller: { select: { fullName: true } } },
  });

  const listingsWithPhotos = published.map((l: any) => {
    let photosArr: string[] = [];
    try { photosArr = l.photos ? JSON.parse(l.photos) : []; } catch { }
    return { ...l, allPhotos: photosArr.length > 0 ? photosArr : l.image ? [l.image] : [] };
  });

  return (
    <main className="overflow-x-hidden bg-[#F7F4EE]">

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative min-h-screen flex items-center justify-start">
        {/* Hero image – Indonesian rice paddy landscape */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/hero_sawah.png)" }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full px-5 py-2 mb-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-sm font-semibold tracking-widest uppercase">Temukan Lahan Desa yang Tepat, Terverifikasi & Transparan</span>
          </div>

          {/* Headline */}
          <h1
            className="font-heading text-white leading-[1.1] mb-7 tracking-tight"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)", textShadow: "0 2px 30px rgba(0,0,0,0.5)" }}
          >
            Lahan desa yang{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-200">
              tepat
            </span>
            ,<br />
            untuk investasi{" "}
            <span className="italic opacity-90">masa depan.</span>
          </h1>

          {/* Sub */}
          <p
            className="text-white/85 max-w-2xl mb-12 leading-relaxed"
            style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", textShadow: "0 1px 10px rgba(0,0,0,0.6)" }}
          >
            Ribuan lahan pedesaan dengan koordinat GPS terverifikasi. Temukan
            lahan impian Anda langsung dari pemiliknya — tanpa perantara, tanpa tipu daya.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-20">
            <Link
              href="/jelajahi"
              className="group inline-flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-2xl transition-all duration-300 shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-0.5"
              style={{ height: 60, paddingInline: "2.2rem", fontSize: "1.05rem" }}
            >
              Jelajahi Lahan
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard/listing/baru"
              className="inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-semibold rounded-2xl transition-all duration-300"
              style={{ height: 60, paddingInline: "2.2rem", fontSize: "1.05rem" }}
            >
              Pasang Iklan Lahan
            </Link>
          </div>

          {/* Stats — each item has a blue semi-transparent chip */}
          <div className="flex flex-wrap gap-4 md:gap-6">
            {[
              { val: "5.200+", label: "Lahan Tersedia" },
              { val: "120+", label: "Kota & Kabupaten" },
              { val: "100%", label: "GPS Terverifikasi" },
              { val: "4.9★", label: "Rating Penjual Rata-rata" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl px-5 py-4"
                style={{ background: "rgba(15, 40, 80, 0.65)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <p
                  className="text-white font-bold leading-none mb-1.5"
                  style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.4rem)", textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
                >
                  {s.val}
                </p>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-[11px] font-medium tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-white/20 animate-pulse" />
        </div>
      </section>

      {/* ══════════════ PETA PREVIEW ══════════════ */}
      <section className="relative z-20 -mt-14 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <Link href="/jelajahi" className="block group">
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              style={{ height: "clamp(220px, 35vw, 420px)", backgroundImage: "url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=80&auto=format&fit=crop)", backgroundSize: "cover", backgroundPosition: "center" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/50" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center gap-4">
                <div className="w-16 h-16 bg-white/15 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                  <MapIcon className="w-7 h-7 drop-shadow" />
                </div>
                <div>
                  <h2 className="font-heading text-white mb-1" style={{ fontSize: "clamp(1.5rem, 4vw, 2.8rem)" }}>
                    Peta Geospasial Interaktif
                  </h2>
                  <p className="text-white/80 font-normal" style={{ fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)" }}>
                    Cari lahan langsung di peta, lihat koordinat GPS presisi.
                  </p>
                </div>
              </div>

              <div className="absolute top-5 right-5 flex items-center gap-2 bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                Live Map
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ══════════════ LISTING TERBARU ══════════════ */}
      <section className="py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
                Listing Terbaru
              </span>
              <h2 className="font-heading text-[#2C2416] leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                Lahan pilihan<br className="hidden md:block" /> hari ini
              </h2>
            </div>
            <Link href="/jelajahi" className="group inline-flex items-center gap-2 text-green-700 font-semibold hover:text-green-600 transition-colors">
              Lihat semua lahan
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Cards grid */}
          {listingsWithPhotos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {listingsWithPhotos.map((listing: any) => (
                <LandCard key={listing.id} {...listing} image={listing.allPhotos[0] || listing.image} location={listing.category} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {DUMMY_LISTINGS.map((item, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#E8E0D0] hover:border-green-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-3 left-3 bg-white text-[#2C2416] text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="font-semibold text-[#2C2416] text-[0.92rem] leading-snug line-clamp-2 mb-2">
                      {item.title}
                    </p>
                    <p className="text-xs text-[#A07850] mb-4 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {item.loc}
                    </p>
                    <div className="flex items-end justify-between border-t border-[#EDE5D8] pt-4">
                      <div>
                        <p className="text-[10px] text-[#A07850] font-medium mb-0.5">Harga</p>
                        <p className="text-green-700 font-bold text-sm">{formatRupiah(item.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-[#A07850] font-medium mb-0.5">Luas</p>
                        <p className="text-[#2C2416] font-semibold text-sm">{item.area.toLocaleString()} m²</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════ CARA KERJA ══════════════ */}
      <section className="py-24 px-6 md:px-12 bg-white border-y border-[#EDE5D8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
              Cara Kerja
            </span>
            <h2 className="font-heading text-[#2C2416] mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
              Bagaimana Dessa.id bekerja?
            </h2>
            <p className="text-[#A07850] text-lg max-w-xl mx-auto leading-relaxed">
              Sistem kami dirancang supaya transparan dan mudah untuk kedua belah pihak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "📝",
                title: "Pasang & Validasi",
                desc: "Penjual mengisi data lahan lengkap dengan foto dan titik koordinat GPS yang akurat.",
                bg: "#FFFBF0",
                border: "#F6E9C0",
                accent: "#B45309",
              },
              {
                step: "02",
                icon: "🛰️",
                title: "Verifikasi Geospasial",
                desc: "Tim kami meninjau titik satelit, memastikan posisi lahan valid dan bebas konflik batas.",
                bg: "#F0FAF2",
                border: "#BBE4C4",
                accent: "#166534",
              },
              {
                step: "03",
                icon: "🤝",
                title: "Navigasi & Deal",
                desc: "Pembeli navigasi langsung via Google Maps, survei lokasi, dan bertransaksi langsung dengan penjual.",
                bg: "#EFF6FF",
                border: "#BFDBFE",
                accent: "#1D4ED8",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="relative rounded-2xl p-8 transition-transform duration-300 hover:-translate-y-2"
                style={{ background: s.bg, border: `1.5px solid ${s.border}` }}
              >
                <span
                  className="absolute top-7 right-7 font-heading font-bold opacity-15 select-none"
                  style={{ fontSize: "4rem", color: s.accent, lineHeight: 1 }}
                >
                  {s.step}
                </span>
                <div className="text-5xl mb-6">{s.icon}</div>
                <h3 className="font-bold text-[#2C2416] text-xl mb-3">{s.title}</h3>
                <p className="text-[#5C4A2A] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ KEUNGGULAN ══════════════ */}
      <section className="py-28 px-6 md:px-12 bg-[#1C2D1C] text-white relative overflow-hidden">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 0)", backgroundSize: "36px 36px" }}
        />
        {/* Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-600/20 rounded-full blur-3xl -mr-72 -mt-72 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left */}
            <div>
              <span className="inline-block bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-8">
                Keunggulan Kami
              </span>
              <h2 className="font-heading leading-tight mb-8" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}>
                Data lebih <span className="text-green-400 italic">akurat</span>,<br />
                keputusan lebih cepat.
              </h2>
              <p className="text-white/65 text-lg mb-12 leading-relaxed">
                Berbeda dengan platform properti lain yang sering menyembunyikan lokasi asli,
                kami memprioritaskan transparansi geospasial agar Anda tidak buang waktu survei
                lahan yang salah.
              </p>

              <ul className="space-y-7">
                {[
                  { icon: <MapPin className="w-5 h-5" />, title: "Sistem Pemetaan Terintegrasi", desc: "Navigasi langsung ke lokasi via Google Maps dengan satu klik." },
                  { icon: <ShieldCheck className="w-5 h-5" />, title: "Verifikasi Berlapis", desc: "Admin memastikan keabsahan dokumen dan kesesuaian titik GPS." },
                  { icon: <Phone className="w-5 h-5" />, title: "Bebas Komisi Agen", desc: "Terhubung langsung dengan penjual via WhatsApp tanpa perantara." },
                ].map((item, i) => (
                  <li key={i} className="flex gap-5">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-1">{item.title}</h4>
                      <p className="text-white/55 text-[0.92rem] leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right – visual card */}
            <div className="relative">
              <div
                className="rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl relative"
                style={{ aspectRatio: "1 / 1" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80&auto=format&fit=crop"
                  alt="Peta lahan"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1C2D1C]/90 to-transparent" />

                {/* GPS card overlay */}
                <div className="absolute bottom-7 left-7 right-7 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(100,200,60,0.5)]">
                    <Navigation className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">Akurasi Titik: Sangat Tinggi</p>
                    <p className="text-green-300 text-sm">Lat: -7.2831 · Lng: 110.1923</p>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-5 -right-5 bg-green-500 text-white rounded-2xl px-5 py-3 shadow-xl font-bold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                GPS Verified
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ TOP SELLERS ══════════════ */}
      <section className="py-28 px-6 md:px-12 bg-[#F7F4EE]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
                Komunitas Penjual
              </span>
              <h2 className="font-heading text-[#2C2416] leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                Bertransaksi dengan<br className="hidden md:block" /> penjual terpercaya
              </h2>
            </div>
            <p className="text-[#A07850] text-base max-w-sm md:text-right leading-relaxed">
              Para penjual dengan reputasi emas yang konsisten memberikan data akurat dan cepat tanggap.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DUMMY_SELLERS.map((seller) => (
              <div
                key={seller.id}
                className="bg-white border border-[#EDE5D8] rounded-2xl p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative inline-block mb-5">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto shadow-lg bg-gradient-to-br ${seller.gradient}`}
                  >
                    {seller.initials}
                  </div>
                  <div className="absolute -bottom-2 -right-1 bg-white rounded-full p-1 shadow-md">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <h3 className="font-bold text-[#2C2416] text-base mb-1">{seller.name}</h3>
                <p className="text-sm text-[#A07850] mb-6">{seller.type}</p>
                <div className="flex items-center justify-between bg-[#F7F4EE] rounded-xl p-3">
                  <div className="text-center flex-1 border-r border-[#EDE5D8]">
                    <p className="font-bold text-[#2C2416] text-lg">{seller.listings}</p>
                    <p className="text-[10px] text-[#A07850] uppercase tracking-wider font-semibold">Lahan</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="font-bold text-[#2C2416] text-lg flex items-center justify-center gap-1">
                      {seller.rating}
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    </p>
                    <p className="text-[10px] text-[#A07850] uppercase tracking-wider font-semibold">Rating</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ ARTIKEL / BLOG ══════════════ */}
      <section className="py-28 px-6 md:px-12 bg-white border-t border-[#EDE5D8]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="inline-block bg-[#EDE5D8] text-[#5C4A2A] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-5">
                Kabar Desa
              </span>
              <h2 className="font-heading text-[#2C2416] leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                Wawasan & Tips<br className="hidden md:block" /> Investasi Lahan
              </h2>
            </div>
            <Link href="#" className="group inline-flex items-center gap-2 text-[#5C4A2A] font-semibold hover:text-[#2C2416] transition-colors">
              Baca semua artikel
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {DUMMY_BLOGS.map((blog) => (
              <article key={blog.id} className="group cursor-pointer flex flex-col">
                <div className="relative rounded-2xl overflow-hidden mb-6 shadow-md" style={{ height: 240 }}>
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute top-4 left-4 bg-white text-[#2C2416] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    {blog.category}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2.5 text-xs text-[#A07850] mb-3 font-medium">
                    <span>{blog.date}</span>
                    <span className="w-1 h-1 bg-[#DDD0B8] rounded-full" />
                    <span>{blog.readTime} baca</span>
                  </div>
                  <h3 className="font-bold text-[#2C2416] text-xl leading-snug mb-3 group-hover:text-green-700 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-[#5C4A2A] text-[0.92rem] line-clamp-3 leading-relaxed mb-6">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-[#EDE5D8] pt-4">
                  <div className="w-8 h-8 rounded-full bg-[#EDE5D8] flex items-center justify-center text-xs font-bold text-[#5C4A2A]">
                    {blog.author.initials}
                  </div>
                  <span className="text-sm font-semibold text-[#2C2416]">{blog.author.name}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ TESTIMONI ══════════════ */}
      <section className="py-28 px-6 md:px-12 bg-[#F0F7E9] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-green-300/20 rounded-full blur-3xl -mr-80 -mt-80 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-3xl -ml-56 -mb-56 pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="flex justify-center gap-1 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-7 h-7 text-amber-500 fill-amber-500" />
            ))}
          </div>
          <Quote className="w-10 h-10 text-green-400 mx-auto mb-6 rotate-180" />

          <blockquote
            className="font-heading text-[#2C2416] leading-tight mb-12"
            style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)" }}
          >
            "Semenjak pakai Dessa.id, saya tidak perlu repot jelasin ancer-ancer lokasi ke
            pembeli. Mereka langsung ikut arah Google Maps pakai titik koordinat yang saya pasang.
            Sangat efisien dan terjual cepat!"
          </blockquote>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#2C2416] text-white flex items-center justify-center text-lg font-bold mb-3 shadow-lg">
              WR
            </div>
            <p className="font-bold text-lg text-[#2C2416]">Wahyu Ramadhan</p>
            <p className="text-sm text-green-700 font-semibold mt-0.5">Penjual Lahan Kebun · Bandungan, Jawa Tengah</p>
          </div>
        </div>
      </section>

      {/* ══════════════ CTA FINAL ══════════════ */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            {/* BG image */}
            <Image
              src="/cta_land.png"
              alt="Lahan pertanian Indonesia"
              fill
              className="object-cover object-center"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C2D1C]/95 via-[#1C2D1C]/80 to-transparent" />

            {/* Content */}
            <div className="relative z-10 p-12 md:p-20 md:w-3/5">
              <span className="inline-block bg-green-500/25 text-green-300 border border-green-500/30 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-8">
                Mulai Sekarang
              </span>
              <h2 className="font-heading text-white leading-tight mb-6" style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)" }}>
                Mulai pasarkan<br />lahan Anda hari ini.
              </h2>
              <p className="text-white/70 text-lg mb-10 leading-relaxed max-w-lg">
                Bergabung dengan ratusan pemilik lahan yang telah sukses menjual properti mereka
                lebih cepat lewat teknologi geospasial kami.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/dashboard/listing/baru"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(100,200,50,0.4)]"
                  style={{ height: 56, paddingInline: "2rem", fontSize: "1rem" }}
                >
                  Pasang Iklan Gratis
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/jelajahi"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white font-semibold rounded-xl transition-all"
                  style={{ height: 56, paddingInline: "2rem", fontSize: "1rem" }}
                >
                  Jelajahi Lahan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
