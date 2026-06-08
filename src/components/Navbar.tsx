"use client";

import Link from "next/link";
import { Menu, TreePine, Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";

export function Navbar() {
  const { wishlist, isLoaded } = useWishlist();

  return (
    <nav className="bg-earth-900 sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-earth-50 font-heading text-2xl tracking-tight">
          <TreePine className="w-7 h-7 text-green-500" />
          <span>dessa<span className="text-green-500">.</span>id</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/jelajahi" className="text-earth-200 hover:text-earth-50 transition-colors text-sm">
            Jelajahi
          </Link>
          <Link href="/#tentang" className="text-earth-200 hover:text-earth-50 transition-colors text-sm">
            Tentang
          </Link>
          <Link href="/#blog" className="text-earth-200 hover:text-earth-50 transition-colors text-sm">
            Blog
          </Link>
        </div>

        {/* CTA & Mobile */}
        <div className="flex items-center gap-4">
          <Link href="/tersimpan" className="relative text-earth-200 hover:text-red-400 transition-colors flex items-center gap-1.5 text-sm mr-2">
            <Heart className="w-5 h-5" />
            <span className="hidden sm:inline">Tersimpan</span>
            {isLoaded && wishlist.length > 0 && (
              <span className="absolute -top-2 -left-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            )}
          </Link>
          
          <Link 
            href="/dashboard/listing/baru" 
            className="hidden sm:inline-flex items-center justify-center bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
          >
            Daftarkan Lahan
          </Link>
          <button className="md:hidden text-earth-200 hover:text-earth-50">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
