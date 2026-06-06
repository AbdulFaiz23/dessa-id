import Link from "next/link";
import { Leaf, Map as MapIcon, ShieldCheck, Upload, Navigation, MessageCircle, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { LandCard } from "@/components/LandCard";
import { LISTINGS } from "@/lib/data";

export default function LandingPage() {
  const publishedListings = LISTINGS.filter(l => l.status === "published").slice(0, 4);

  return (
    <main>
      {/* SECTION 1: HERO */}
      <section className="bg-earth-900 pt-20 pb-28 md:pt-28 md:pb-36 px-4 md:px-8 relative">
        <div className="container mx-auto max-w-5xl">
          <div className="inline-flex items-center gap-2 bg-green-700/20 border border-green-500 text-green-100 rounded-full text-xs px-3 py-1 mb-6">
            <Leaf className="w-3.5 h-3.5" />
            <span>Berbasis geospasial · Jawa Tengah</span>
          </div>
          
          <h1 className="font-heading text-earth-50 text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 max-w-3xl">
            Lahan desa yang tepat,<br />
            untuk investasi masa depan
          </h1>
          
          <p className="text-earth-200 text-base md:text-lg max-w-lg mb-8 leading-relaxed">
            Platform promosi lahan pedesaan dengan data presisi dan koordinat GPS terverifikasi. Tanpa spam, tanpa ribet.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link 
              href="/jelajahi" 
              className={buttonVariants({ className: "bg-green-700 text-white hover:bg-green-600 h-12 px-8 rounded-lg w-full sm:w-auto text-base" })}
            >
              Jelajahi Lahan
            </Link>
            <Link 
              href="/dashboard/listing/baru" 
              className={buttonVariants({ variant: "outline", className: "border-earth-200/40 text-earth-200 hover:bg-earth-200/10 hover:text-earth-50 bg-transparent h-12 px-8 rounded-lg w-full sm:w-auto text-base" })}
            >
              Pasang Iklan Lahan
            </Link>
          </div>

          <div className="mt-12 border-t border-earth-700/40 pt-8 flex flex-wrap gap-8 md:gap-16">
            <div>
              <p className="text-earth-50 text-2xl md:text-3xl font-medium">500+</p>
              <p className="text-earth-500 text-xs uppercase tracking-wider mt-1">Lahan</p>
            </div>
            <div>
              <p className="text-earth-50 text-2xl md:text-3xl font-medium">38</p>
              <p className="text-earth-500 text-xs uppercase tracking-wider mt-1">Kecamatan</p>
            </div>
            <div>
              <p className="text-earth-50 text-2xl md:text-3xl font-medium">100%</p>
              <p className="text-earth-500 text-xs uppercase tracking-wider mt-1">Terverifikasi</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: MAP PREVIEW */}
      <section className="-mt-16 mx-4 md:mx-8 relative z-10 container mx-auto max-w-5xl">
        <div className="bg-earth-200 rounded-2xl h-64 md:h-80 shadow-xl border-4 border-earth-50 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
          {/* Placeholder for Leaflet */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#A07850 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <MapIcon className="w-12 h-12 text-earth-500 mb-4 opacity-50" />
          <p className="text-earth-700 font-medium z-10">Peta Interaktif (Placeholder)</p>
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-earth-900 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
            🗺️ Jelajahi via Peta
          </div>
          
          {/* Overlay link */}
          <Link href="/jelajahi" className="absolute inset-0 flex items-end justify-center pb-6">
             <span className="bg-white px-5 py-2 rounded-full text-green-700 font-medium text-sm shadow-md flex items-center group-hover:bg-green-50 transition-colors">
               Lihat semua lahan di peta <ArrowRight className="w-4 h-4 ml-2" />
             </span>
          </Link>
        </div>
      </section>

      {/* SECTION 3: LISTING CARDS */}
      <section className="py-16 md:py-24 px-4 bg-earth-50">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-10">
            <span className="text-green-700 uppercase tracking-widest text-xs font-semibold">Listing Terbaru</span>
            <h2 className="text-2xl md:text-3xl font-medium text-earth-900 mt-2 mb-3">Lahan pilihan di sekitar Semarang</h2>
            <p className="text-earth-500 text-sm md:text-base">Semua listing melalui moderasi admin dan terverifikasi koordinatnya.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {publishedListings.map((listing) => (
              <LandCard key={listing.id} {...listing} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/jelajahi" 
              className={buttonVariants({ variant: "outline", className: "border-earth-500 text-earth-700 hover:bg-earth-30 rounded-lg px-8 h-12" })}
            >
              Lihat semua lahan &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: CARA KERJA */}
      <section className="py-16 md:py-24 px-4 bg-sand-100">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-2xl md:text-3xl font-medium text-earth-900 mb-16">Mudah dari dua sisi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Horizontal Line for Desktop */}
            <div className="hidden md:block absolute top-6 left-1/6 right-1/6 h-[2px] bg-sand-300 -z-0"></div>
            
            {/* Steps */}
            {[
              { icon: Upload, title: "Penjual pasang listing", desc: "Isi detail lahan, spesifikasi, harga, dan tandai koordinat presisi di peta." },
              { icon: ShieldCheck, title: "Admin verifikasi 1x24 jam", desc: "Data dan koordinat dicek untuk memastikan informasi akurat dan bebas spam." },
              { icon: Navigation, title: "Pembeli temukan & survei", desc: "Pembeli dapat menavigasi langsung ke lokasi via GPS dan kontak penjual via WA." }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 bg-earth-900 text-earth-50 rounded-full flex items-center justify-center text-xl font-medium mb-6 shadow-lg border-4 border-sand-100">
                  {idx + 1}
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-sand-300 w-16 h-16 flex items-center justify-center mb-4 text-green-700">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-earth-900 mb-2">{step.title}</h3>
                <p className="text-sm text-earth-500 max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: KEUNGGULAN */}
      <section className="py-16 md:py-24 px-4 bg-earth-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-medium text-earth-900 mb-10 text-center">Kenapa Dessa.id?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: MapIcon, title: "Map-First", desc: "Setiap lahan wajib memiliki titik koordinat presisi. Temukan lahan persis di lokasi yang Anda inginkan." },
              { icon: ShieldCheck, title: "Data Terverifikasi", desc: "Tidak ada listing ganda atau fiktif. Semua iklan melalui proses moderasi ketat oleh admin kami." },
              { icon: MessageCircle, title: "Kontak Langsung via WA", desc: "Kami tidak menahan informasi. Langsung hubungi penjual via WhatsApp tanpa perantara tambahan." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white border border-sand-300 rounded-xl p-6 hover:shadow-sm transition-shadow">
                <div className="bg-green-50 text-green-700 p-3 rounded-lg w-fit mb-5">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-earth-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-earth-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: CTA BANNER */}
      <section className="container mx-auto max-w-5xl px-4 md:px-8 mb-16">
        <div className="bg-earth-900 rounded-3xl py-12 px-6 md:py-16 md:px-12 text-center relative overflow-hidden">
          {/* Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-900 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-earth-700 rounded-full blur-3xl opacity-20 -ml-20 -mb-20"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-heading text-earth-50 mb-4">Punya lahan di desa?</h2>
            <p className="text-earth-200 text-base md:text-lg mb-8 max-w-xl mx-auto">
              Pasang iklan lahan Anda secara gratis dan jangkau ribuan calon investor potensial yang sedang mencari peluang.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/dashboard/listing/baru" 
                className={buttonVariants({ className: "bg-green-700 text-white hover:bg-green-600 h-12 px-8 rounded-lg w-full sm:w-auto text-base" })}
              >
                Mulai Pasang Lahan &rarr;
              </Link>
              <Link 
                href="/#tentang" 
                className={buttonVariants({ variant: "ghost", className: "text-earth-200 hover:text-earth-50 hover:bg-earth-700/50 h-12 px-8 rounded-lg w-full sm:w-auto text-base" })}
              >
                Pelajari lebih lanjut
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
