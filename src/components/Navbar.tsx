import Link from "next/link";
import { Menu, TreePine } from "lucide-react";

export function Navbar() {
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
