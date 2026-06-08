const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing old data...')
  await prisma.listing.deleteMany()
  await prisma.user.deleteMany()

  console.log('Seeding users...')
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      fullName: 'Admin Dessa',
      email: 'admin@dessa.id',
      password: adminPassword,
      role: 'admin',
    },
  })

  const sellerPassword = await bcrypt.hash('seller123', 10)
  const seller = await prisma.user.create({
    data: {
      fullName: 'Budi Santoso',
      email: 'budi@email.com',
      password: sellerPassword,
      whatsapp: '628123456789',
      role: 'seller',
    },
  })

  console.log('Seeding listings...')
  const dummyListings = [
    { title: "Lahan kebun Ungaran", location: "Ungaran Barat, Semarang", price: 120000000, area: 800, docType: "SHM", verified: true, category: "Kebun", lat: -7.1321, lng: 110.3891, status: "published", image: "https://images.unsplash.com/photo-1592318953119-952abcf7b1cc?q=80&w=800&auto=format&fit=crop" },
    { title: "Lahan hunian Banyumanik", location: "Banyumanik, Semarang", price: 85000000, area: 600, docType: "SHGB", verified: true, category: "Hunian", lat: -7.0731, lng: 110.4072, status: "published", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop" },
    { title: "Sawah produktif Demak", location: "Mijen, Demak", price: 60000000, area: 1200, docType: "Girik", verified: false, category: "Pertanian", lat: -6.8972, lng: 110.6381, status: "pending", image: "https://images.unsplash.com/photo-1530982011887-3cc11cc85693?q=80&w=800&auto=format&fit=crop" },
    { title: "Lahan villa Bandungan", location: "Bandungan, Semarang", price: 210000000, area: 1500, docType: "SHM", verified: true, category: "Investasi", lat: -7.2113, lng: 110.3254, status: "published", image: "https://images.unsplash.com/photo-1506544777-64cfbeaeb5ce?q=80&w=800&auto=format&fit=crop" },
    { title: "Tanah pekarangan Ambarawa", location: "Ambarawa, Semarang", price: 95000000, area: 900, docType: "AJB", verified: false, category: "Hunian", lat: -7.2651, lng: 110.4011, status: "pending", image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800&auto=format&fit=crop" },
  ]

  for (const l of dummyListings) {
    await prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: l.title,
        description: `Deskripsi untuk ${l.title}. Lahan berlokasi di ${l.location}. Sangat cocok untuk ${l.category.toLowerCase()}.`,
        area: l.area,
        price: l.price,
        category: l.category,
        docType: l.docType,
        latitude: l.lat,
        longitude: l.lng,
        status: l.status,
        verified: l.verified,
        image: l.image,
      }
    })
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
