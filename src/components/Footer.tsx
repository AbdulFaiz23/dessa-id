import Link from "next/link";
import { TreePine } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-earth-900 text-earth-200 border-t border-earth-700/40 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Col 1: Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-earth-50 font-heading text-3xl tracking-tight mb-4">
              <TreePine className="w-8 h-8 text-green-500" />
              <span>dessa<span className="text-green-500">.</span>id</span>
            </Link>
            <p className="text-sm text-earth-500">
              Lahan desa, peluang nyata.
              Mendigitalisasi aset lahan desa untuk menghubungkan pemilik dengan investor secara transparan.
            </p>
          </div>

          {/* Col 2: Links */}
          <div>
            <h3 className="text-earth-50 font-medium mb-4">Navigasi</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/jelajahi" className="hover:text-earth-50 transition-colors">Jelajahi Lahan</Link></li>
              <li><Link href="/daftar" className="hover:text-earth-50 transition-colors">Pasang Iklan</Link></li>
              <li><Link href="/#tentang" className="hover:text-earth-50 transition-colors">Tentang Kami</Link></li>
              <li><Link href="/#blog" className="hover:text-earth-50 transition-colors">Blog & Panduan</Link></li>
            </ul>
          </div>

          {/* Col 3: Kontak */}
          <div>
            <h3 className="text-earth-50 font-medium mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm text-earth-500">
              <li>Email: halo@dessa.id</li>
              <li>WhatsApp: +62 812 3456 7890</li>
              <li>Semarang, Jawa Tengah, Indonesia</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-earth-700/40 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-earth-500">
          <p>&copy; {new Date().getFullYear()} Dessa.id. Hak cipta dilindungi.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/#syarat" className="hover:text-earth-200">Syarat & Ketentuan</Link>
            <Link href="/#privasi" className="hover:text-earth-200">Kebijakan Privasi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
