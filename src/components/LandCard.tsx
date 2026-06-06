import Link from "next/link";
import { MapPin, Image as ImageIcon } from "lucide-react";
import { Badge } from "./Badge";

interface LandCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  area: number;
  docType: string;
  verified: boolean;
  category: string;
}

export function LandCard({ id, title, location, price, area, docType, verified, category }: LandCardProps) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <Link 
      href={`/lahan/${id}`} 
      className="group block bg-white rounded-xl border border-sand-300 overflow-hidden hover:shadow-sm hover:border-earth-500 transition-all"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-earth-200 flex items-center justify-center overflow-hidden">
        {/* Placeholder for real image */}
        <ImageIcon className="w-10 h-10 text-earth-500 opacity-50" />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-earth-900/60 to-transparent pointer-events-none" />

        {/* Badges Overlay */}
        {verified && (
          <div className="absolute top-3 left-3">
            <Badge type="verified" />
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <Badge type="category" value={category} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-medium text-earth-900 line-clamp-1" title={title}>
            {title}
          </h3>
        </div>
        
        <div className="flex items-center text-earth-500 text-xs mb-3">
          <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-xs text-earth-500 mb-0.5">Harga</p>
            <p className="text-lg font-semibold text-green-900">
              {formattedPrice}
            </p>
          </div>
          <div className="text-right">
             <p className="text-xs text-earth-500 mb-0.5">Luas</p>
             <p className="text-sm font-medium text-earth-900">{area} m²</p>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-sand-300/50 flex items-center justify-between">
          <Badge type="document" value={docType} />
          <span className="text-xs font-medium text-green-700 group-hover:underline">Lihat Detail &rarr;</span>
        </div>
      </div>
    </Link>
  );
}
