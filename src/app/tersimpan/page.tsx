"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useWishlist } from "@/hooks/useWishlist";
import { MapPin, Image as ImageIcon, ChevronRight, Heart } from "lucide-react";
import { Badge } from "@/components/Badge";

export default function TersimpanPage() {
  const { wishlist, isLoaded, toggleWishlist } = useWishlist();
  const [savedListings, setSavedListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (wishlist.length === 0) {
      setSavedListings([]);
      setLoading(false);
      return;
    }

    // Fetch details for all saved listings
    const fetchSaved = async () => {
      try {
        const promises = wishlist.map(id => fetch(`/api/listings/${id}`).then(res => res.ok ? res.json() : null));
        const results = await Promise.all(promises);
        setSavedListings(results.filter(Boolean));
      } catch (e) {
        console.error("Failed to fetch wishlist", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [isLoaded, wishlist]);

  const formatRp = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center gap-3 mb-8 border-b border-sand-300 pb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="font-heading text-2xl text-earth-900">Lahan Tersimpan</h1>
            <p className="text-sm text-earth-500">Lahan favorit yang Anda simpan ke wishlist.</p>
          </div>
        </div>

        {loading ? (
          <p className="text-earth-500 text-center py-12">Memuat daftar simpanan...</p>
        ) : savedListings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-sand-300 shadow-sm">
            <Heart className="w-16 h-16 mx-auto text-earth-200 mb-4" />
            <h2 className="text-lg font-medium text-earth-900 mb-2">Belum ada lahan tersimpan</h2>
            <p className="text-sm text-earth-500 mb-6">Jelajahi berbagai lahan potensial dan simpan ke wishlist Anda.</p>
            <Link href="/jelajahi" className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
              Mulai Jelajahi
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedListings.map(listing => (
              <div key={listing.id} className="bg-white rounded-2xl border border-sand-300 shadow-sm overflow-hidden group flex flex-col">
                <Link href={`/lahan/${listing.id}`} className="relative aspect-video bg-earth-200 block overflow-hidden">
                  {listing.image ? (
                    <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-10 h-10 text-earth-400" /></div>
                  )}
                  {listing.verified && <div className="absolute top-3 left-3"><Badge type="verified" /></div>}
                  
                  {/* Button hapus wishlist on hover */}
                  <button onClick={(e) => { e.preventDefault(); toggleWishlist(listing.id); }} className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm text-red-600 rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors">
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </Link>

                <Link href={`/lahan/${listing.id}`} className="p-4 flex-1 flex flex-col hover:bg-earth-30 transition-colors">
                  <div className="flex items-center gap-1.5 text-xs text-earth-500 mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {listing.category} • {listing.area} m²
                  </div>
                  <h3 className="font-medium text-earth-900 mb-2 line-clamp-2">{listing.title}</h3>
                  <div className="mt-auto pt-4 border-t border-sand-300/50 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-earth-500 mb-0.5">Harga</p>
                      <p className="font-bold text-green-900">{formatRp(listing.price)}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-earth-400 group-hover:text-green-700 transition-colors" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
