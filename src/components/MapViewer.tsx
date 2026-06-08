"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export interface MapMarkerData {
  id: string;
  lat: number;
  lng: number;
  title: string;
  price: number;
  area: number;
}

interface MapViewerProps {
  markers: MapMarkerData[];
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
}

export default function MapViewer({ markers, centerLat, centerLng, zoom = 12 }: MapViewerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full w-full bg-earth-200 animate-pulse" />;

  let center: [number, number] = [-7.0051, 110.4381]; // Default Semarang
  if (centerLat && centerLng) {
    center = [centerLat, centerLng];
  } else if (markers.length > 0) {
    center = [markers[0].lat, markers[0].lng];
  }

  const formatRp = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%", zIndex: 0 }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers.map((m) => (
        <Marker key={m.id} position={[m.lat, m.lng]} icon={icon}>
          <Popup>
            <div className="text-sm font-sans min-w-[150px]">
              <p className="font-medium text-earth-900 mb-1">{m.title}</p>
              <p className="text-green-700 font-semibold mb-2">{formatRp(m.price)}</p>
              <p className="text-xs text-earth-500 mb-2">Luas: {m.area} m²</p>
              <Link href={`/lahan/${m.id}`} className="text-xs text-blue-600 hover:underline">
                Lihat Detail &rarr;
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
