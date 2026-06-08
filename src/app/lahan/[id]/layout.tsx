import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
  });

  if (!listing) {
    return {
      title: "Lahan Tidak Ditemukan | Dessa.id",
    };
  }

  // Fallback ke cover image atau logo jika tidak ada foto
  let imageUrl = "https://dessa.id/og-image.jpg"; // fallback default
  if (listing.image) {
    imageUrl = listing.image.startsWith("http") ? listing.image : `https://dessa.id${listing.image}`;
  }

  return {
    title: `${listing.title} | Dessa.id`,
    description: `Lahan ${listing.category} seluas ${listing.area} m² dijual dengan harga Rp ${listing.price.toLocaleString("id-ID")}. Lokasi terverifikasi.`,
    openGraph: {
      title: `${listing.title} - Investasi Lahan Dessa.id`,
      description: `Dijual: ${listing.title}. Luas: ${listing.area} m². Cek detail koordinat dan spesifikasi lengkapnya di sini.`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: listing.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: listing.title,
      description: `Lahan ${listing.category} seluas ${listing.area} m²`,
      images: [imageUrl],
    },
  };
}

export default function LahanDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
