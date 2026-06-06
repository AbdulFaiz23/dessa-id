=== DESSA.ID — GLOBAL SETUP & DESIGN SYSTEM ===

Ini adalah panduan visual dan teknis untuk SEMUA halaman Dessa.id.
Terapkan aturan ini secara konsisten di seluruh project.

--- TECH STACK ---
Framework  : Next.js 14 (App Router)
Styling    : Tailwind CSS + shadcn/ui
Icons      : Lucide React
Font       : Heading → DM Serif Display (Google Fonts)
             Body    → Plus Jakarta Sans (Google Fonts)
Map        : Leaflet.js + React-Leaflet (placeholder)
State      : React useState / useContext (no backend dulu)

--- COLOR PALETTE (earth tone) ---
--earth-900  : #2C2416  ← background gelap utama
--earth-700  : #5C4A2A  ← elemen gelap sekunder
--earth-500  : #A07850  ← teks muted, border aksen
--earth-200  : #D4B896  ← teks di atas background gelap
--earth-50   : #F5F0E8  ← background krem / surface terang
--earth-30   : #EAE0CE  ← hover state, card background

--green-900  : #1E3D1E  ← teks harga, aksen terpenting
--green-700  : #3B6D11  ← CTA button primary
--green-500  : #639922  ← badge, status aktif
--green-100  : #C0DD97  ← highlight tipis, highlight teks di bg gelap
--green-50   : #EAF3DE  ← background badge hijau muda

--sand-300   : #DDD0B8  ← border card
--sand-100   : #F0E8D8  ← background section alternatif

--- TYPOGRAPHY ---
Heading display (h1, hero): DM Serif Display, font-normal, tracking-tight
Heading section (h2, h3)  : Plus Jakarta Sans, font-medium
Body, label, caption      : Plus Jakarta Sans, font-normal
Kode / monospace          : tidak digunakan di UI

Ukuran:
  Hero h1    : text-4xl md:text-5xl
  Section h2 : text-2xl md:text-3xl
  Card title : text-base font-medium
  Body       : text-sm leading-relaxed
  Caption    : text-xs text-earth-500

--- KOMPONEN GLOBAL ---

1. NAVBAR (components/Navbar.tsx)
   - Background: bg-earth-900
   - Logo: teks "dessa.id" font serif krem, titik hijau setelah "dessa"
   - Links: Jelajahi (/jelajahi), Tentang, Blog — teks earth-200
   - CTA: tombol "Daftarkan Lahan" bg-green-700 text-white rounded-lg
   - Mobile: hamburger menu, drawer dari kanan

2. FOOTER (components/Footer.tsx)
   - Background: bg-earth-900
   - 3 kolom: Brand + tagline | Links | Kontak
   - Tagline: "Lahan desa, peluang nyata"
   - Border top: border-earth-700/40

3. BADGE KOMPONEN (components/Badge.tsx)
   - Verified : bg-green-700 text-white, icon ShieldCheck
   - Dokumen  : bg-earth-50 text-earth-700 border border-sand-300
   - Kategori : bg-sand-100 text-earth-700
   - Status listing: Pending (amber), Tayang (green), Terjual (gray), Draft (blue)

4. CARD LAHAN (components/LandCard.tsx)
   - bg-white rounded-xl border border-sand-300
   - Foto: aspect-[4/3] object-cover, overlay gradient tipis di bawah
   - Badge Verified: posisi absolute top-left di foto
   - Badge dokumen: bottom foto atau di bawah title
   - Harga: text-green-900 font-semibold text-lg
   - Lokasi: icon MapPin kecil + teks earth-500
   - Hover: shadow-sm + border-earth-500 transition

5. LAYOUT (app/layout.tsx)
   - Pasang Google Fonts: DM Serif Display + Plus Jakarta Sans
   - Wrap semua halaman dengan <Navbar /> dan <Footer />
   - bg-earth-50 sebagai background default body

--- DUMMY DATA (gunakan di semua halaman, belum fetch API) ---

const LISTINGS = [
  { id:"1", title:"Lahan kebun Ungaran", location:"Ungaran Barat, Semarang", price:120000000, area:800, docType:"SHM", verified:true, category:"Kebun", lat:-7.1321, lng:110.3891, status:"published" },
  { id:"2", title:"Lahan hunian Banyumanik", location:"Banyumanik, Semarang", price:85000000, area:600, docType:"SHGB", verified:true, category:"Hunian", lat:-7.0731, lng:110.4072, status:"published" },
  { id:"3", title:"Sawah produktif Demak", location:"Mijen, Demak", price:60000000, area:1200, docType:"Girik", verified:false, category:"Pertanian", lat:-6.8972, lng:110.6381, status:"pending" },
  { id:"4", title:"Lahan villa Bandungan", location:"Bandungan, Semarang", price:210000000, area:1500, docType:"SHM", verified:true, category:"Investasi", lat:-7.2113, lng:110.3254, status:"published" },
  { id:"5", title:"Tanah pekarangan Ambarawa", location:"Ambarawa, Semarang", price:95000000, area:900, docType:"AJB", verified:false, category:"Hunian", lat:-7.2651, lng:110.4011, status:"pending" },
]

const CURRENT_USER = {
  id:"u1", name:"Budi Santoso", whatsapp:"628123456789", role:"seller"
}

const ADMIN_USER = {
  id:"a1", name:"Admin Dessa", role:"admin"
}

--- ATURAN UMUM ---
- Semua halaman HARUS responsive mobile-first
- Breakpoint utama: sm (640px), md (768px), lg (1024px)
- Semua tombol punya state hover dan active
- Belum ada fetch API — semua data dari dummy di atas
- Belum ada auth logic — pakai state sederhana (isLoggedIn: boolean)
- Setiap halaman export default function, letakkan di app/ sesuai routing

============================================================

=== HALAMAN 1: LANDING PAGE ===
Route: app/page.tsx

Terapkan Global Setup di atas. Halaman ini adalah wajah utama Dessa.id.

--- SECTION 1: HERO ---
Layout    : full-width, bg-earth-900, padding py-20 md:py-28
Konten    :
  - Pill badge: icon Leaf + "Berbasis geospasial · Jawa Tengah"
    style: bg-green-700/20 border border-green-500 text-green-100
    rounded-full text-xs px-3 py-1
  - Heading h1 (DM Serif Display):
    "Lahan desa yang tepat,
     untuk investasi masa depan"
    text-earth-50, text-4xl md:text-5xl, leading-tight
  - Subtext (2 kalimat):
    "Platform promosi lahan pedesaan dengan data presisi dan
     koordinat GPS terverifikasi. Tanpa spam, tanpa ribet."
    text-earth-200 text-base max-w-lg
  - 2 CTA button:
      Primary : "Jelajahi Lahan" → /jelajahi, bg-green-700
      Secondary: "Pasang Iklan Lahan" → /dashboard/listing/baru
                 border border-earth-200/40 text-earth-200
  - Stats row (mt-12 border-t border-earth-700/40 pt-8):
      3 item: "500+ Lahan" | "38 Kecamatan" | "100% Terverifikasi"
      Angka: text-earth-50 text-2xl font-medium
      Label: text-earth-500 text-xs

--- SECTION 2: MAP PREVIEW ---
Layout : -mt-10 mx-4 md:mx-8, rounded-2xl overflow-hidden, z-10 relative
Konten :
  - Peta Leaflet height 240px, center Semarang (-7.005, 110.42), zoom 11
  - Tampilkan 4 marker dari LISTINGS yang status published
  - Setiap marker popup: title + harga singkat
  - Pill "Peta interaktif" pojok kanan atas (absolute)
  - Tombol "Lihat semua →" di bawah peta, text-green-700

--- SECTION 3: LISTING CARDS ---
Layout : py-16 px-4, bg-earth-50
Header :
  - Label kecil: "Listing Terbaru" text-green-700 uppercase tracking-widest text-xs
  - H2: "Lahan pilihan di sekitar Semarang"
  - Sub: "Semua listing melalui moderasi admin dan terverifikasi koordinatnya."
Grid   : grid-cols-2 md:grid-cols-4 gap-4
Data   : tampilkan 4 item dari LISTINGS (filter status:"published")
Card   : gunakan komponen LandCard
Link   : setiap card → /lahan/[id]
Bawah grid: tombol "Lihat semua lahan →" centered, variant outline

--- SECTION 4: CARA KERJA ---
Layout : py-16 px-4, bg-sand-100
Header : H2 "Mudah dari dua sisi"
Steps  : 3 langkah, layout vertikal (mobile) / horizontal (desktop)
  1. "Penjual pasang listing" — icon Upload — deskripsi singkat
  2. "Admin verifikasi 1x24 jam" — icon ShieldCheck — deskripsi singkat
  3. "Pembeli temukan & survei" — icon Navigation — deskripsi singkat
Style  : nomor besar bg-earth-900 text-earth-50 rounded-full
         garis penghubung horizontal di desktop (hidden mobile)

--- SECTION 5: KEUNGGULAN (3 kolom card) ---
Layout : py-16 px-4, bg-earth-50
Header : H2 "Kenapa Dessa.id?"
Cards  : grid-cols-1 md:grid-cols-3 gap-6
  Card 1: icon Map + "Map-First" + deskripsi
  Card 2: icon ShieldCheck + "Data Terverifikasi" + deskripsi
  Card 3: icon MessageCircle + "Kontak Langsung via WA" + deskripsi
Style card: bg-white border border-sand-300 rounded-xl p-6
            icon: bg-green-50 text-green-700 p-3 rounded-lg w-fit

--- SECTION 6: CTA BANNER ---
Layout : mx-4 md:mx-8 mb-16 bg-earth-900 rounded-2xl py-12 px-8 text-center
Konten :
  - H2: "Punya lahan di desa?" text-earth-50
  - Sub: ajakan pasang iklan gratis text-earth-200
  - 2 tombol: "Mulai Pasang Lahan →" (primary) + "Pelajari lebih lanjut" (ghost)

============================================================

=== HALAMAN 2: MAP EXPLORER ===
Route: app/jelajahi/page.tsx

Layout KHUSUS: halaman ini TIDAK pakai Footer.
Navbar tetap ada. Sisa tinggi layar (100vh - navbar) digunakan penuh.

--- LAYOUT UTAMA ---
Display : flex, horizontal
Kiri    : panel filter + list (w-full md:w-96, overflow-y-auto)
Kanan   : peta (flex-1, h-[calc(100vh-64px)], sticky)

--- PANEL KIRI: FILTER ---
Padding  : p-4 border-r border-sand-300 bg-earth-50
Konten   :
  - Search bar: "Cari desa, kecamatan..." icon Search, rounded-xl
  - Filter harga (range slider atau 2 input):
      Label: "Harga (Rp)"
      Input: min & max, format Rupiah
  - Filter luas (range slider atau 2 input):
      Label: "Luas (m²)"
  - Filter kategori (checkbox group):
      Hunian | Kebun | Pertanian | Investasi | Lainnya
  - Filter dokumen (checkbox group):
      SHM | SHGB | Girik | AJB
  - Tombol "Terapkan filter" bg-green-700, full width
  - Tombol "Reset" variant ghost, full width

--- PANEL KIRI: HASIL LIST ---
Di bawah filter, scroll list hasil:
  - Counter: "4 lahan ditemukan" text-earth-500 text-sm
  - Setiap item: horizontal card (bukan grid)
      Foto kiri (64px), info kanan: title, lokasi, harga, badge dokumen
      Klik → highlight marker di peta + scroll ke detail
      Hover state: bg-earth-30

--- PANEL KANAN: PETA ---
Library : Leaflet + React-Leaflet
Center  : Semarang (-7.005, 110.42), zoom 11
Tiles   : OpenStreetMap default
Marker  :
  - Custom marker: bulat, bg-green-700, border putih
  - Warna berbeda jika verified (green) vs belum (amber)
  - Popup saat klik marker:
      Card kecil: foto thumbnail + title + harga + tombol "Lihat Detail"
      Tombol Lihat Detail → /lahan/[id]
  - Saat user hover card di list → highlight marker (bounce atau pulse)
Kontrol :
  - Zoom in/out pojok kiri bawah
  - Tombol "Kembali ke Semarang" kecil pojok kanan atas

============================================================

=== HALAMAN 3: DETAIL LAHAN ===
Route: app/lahan/[id]/page.tsx
Data  : ambil dari LISTINGS berdasarkan id (dummy)

--- LAYOUT ---
Max-width: max-w-5xl mx-auto px-4 py-8
Grid     : grid-cols-1 md:grid-cols-3 gap-8
Kiri (md:col-span-2): konten utama
Kanan (md:col-span-1): sticky sidebar aksi

--- KONTEN KIRI ---

1. BREADCRUMB
   Beranda > Jelajahi > [Judul Lahan]
   text-xs text-earth-500, separator "/"

2. FOTO GALERI
   - Foto utama: aspect-[16/9] rounded-xl overflow-hidden
     (placeholder: div bg-earth-200 dengan icon Landscape centered)
   - Thumbnail row di bawah: 4 foto kecil, rounded-lg
     Klik thumbnail → ganti foto utama (useState)
   - Badge Verified absolute top-left: bg-green-700 text-white

3. INFO UTAMA
   - Title: H1 DM Serif Display text-3xl text-earth-900
   - Row: icon MapPin + lokasi + icon Calendar + "Ditambah [tanggal]"
   - Badge kategori + badge dokumen (SHM/dll)
   - Divider

4. DETAIL SPESIFIKASI (grid 2 kolom)
   Label      | Value
   Luas Lahan | 800 m²
   Harga      | Rp 120.000.000
   Harga/m²   | Rp 150.000 / m² (hitung otomatis)
   Kategori   | Kebun
   Status dok | SHM
   Koordinat  | -7.1321, 110.3891

5. DESKRIPSI
   H3 "Deskripsi Lahan"
   Teks dummy 3–4 kalimat tentang lahan

6. PETA MINI (lokasi lahan)
   - Leaflet, height 200px, rounded-xl
   - Marker di koordinat lahan
   - Disabled scroll/zoom (tap untuk aktifkan)
   - Tombol "Buka di Google Maps ↗" di bawah peta
     → link ke https://maps.google.com/?q=[lat],[lng]

--- SIDEBAR KANAN (sticky top-24) ---
Card bg-white border border-sand-300 rounded-xl p-5

1. Harga besar: "Rp 120.000.000"
   Sub: "Rp 150.000 / m²"

2. Tombol UTAMA (full width):
   "Hubungi via WhatsApp" bg-green-700 text-white
   → link wa.me/628xxx?text=Halo, saya tertarik dengan lahan [judul]
   icon: MessageCircle

3. Tombol SEKUNDER (full width):
   "Arahkan ke Lokasi" border border-green-700 text-green-700
   → link ke Google Maps
   icon: Navigation

4. Divider

5. Info penjual:
   Avatar initials + Nama penjual + "Penjual Terverifikasi"

6. Catatan kecil:
   "Transaksi dilakukan di luar platform. Dessa.id hanya media promosi."
   text-xs text-earth-500 text-center mt-3

============================================================

=== HALAMAN 4: REGISTRASI PENJUAL ===
Route: app/daftar/page.tsx

Layout: halaman simple, centered, bg-earth-50
Max-width: max-w-md mx-auto px-4 py-16

--- KONTEN ---
1. Logo dessa.id (centered, klik → /)
2. H1: "Daftarkan akun penjual" (DM Serif Display)
3. Sub: "Sudah punya akun? Masuk di sini" (link → /masuk)

4. FORM (semua field wajib diisi):

   Label: "Nama Lengkap"
   Input: placeholder "Mohammad Abdul Faiz"

   Label: "Nomor WhatsApp"
   Input: type tel, prefix "+62" (select atau teks fixed kiri)
   Helper: "Nomor ini akan digunakan pembeli untuk menghubungi Anda"

   Label: "Alamat Email"
   Input: type email

   Label: "Password"
   Input: type password, icon toggle show/hide (Eye/EyeOff)

   Label: "Konfirmasi Password"
   Input: type password

   Checkbox: "Saya menyetujui Syarat & Ketentuan Dessa.id"
   Link S&K: text-green-700 underline

5. Tombol "Daftar Sekarang" (full width, bg-green-700)
   State disabled jika form belum lengkap

6. Divider "atau"

7. Keterangan: "Masuk sebagai admin?" → link /masuk?role=admin
   text-xs text-earth-500

--- VALIDATION (UI only, belum ke backend) ---
- Semua field required
- Email format valid
- Password min 8 karakter
- Konfirmasi password harus sama
- Tampilkan error message merah di bawah field jika tidak valid
- Tombol submit disabled sampai semua valid

============================================================

=== HALAMAN 5: LOGIN ===
Route: app/masuk/page.tsx

Layout: centered, bg-earth-50, max-w-sm mx-auto px-4 py-16

--- KONTEN ---
1. Logo dessa.id (centered)
2. H1: "Masuk ke akun Anda" (DM Serif Display)
3. Sub: "Belum punya akun? Daftar di sini" → /daftar

4. FORM:

   Label: "Email"
   Input: type email, placeholder "email@contoh.com"

   Label: "Password"
   Input: type password, icon toggle show/hide
   Link kanan: "Lupa password?" text-green-700 text-xs

5. Tombol "Masuk" (full width, bg-green-700)

6. Divider "atau"

7. Keterangan:
   Jika ada query ?role=admin di URL:
   → tampilkan banner kecil: "Login sebagai Admin"
      bg-amber-50 border border-amber-200 text-amber-700 rounded-lg p-3
   Jika tidak:
   → tampilkan teks biasa saja

--- SIMULASI LOGIN (no backend) ---
Tombol Masuk → cek:
  - Jika email = "admin@dessa.id" → set isAdmin = true → redirect /admin
  - Jika email valid lainnya → set isSeller = true → redirect /dashboard
  - Jika kosong → tampilkan error validation
Simpan state di localStorage atau React Context

============================================================

=== HALAMAN 6: DASHBOARD PENJUAL ===
Route: app/dashboard/page.tsx
Guard: jika belum login → redirect /masuk

Layout: sidebar kiri + konten kanan (desktop)
        di mobile: sidebar jadi bottom nav atau menu hamburger

--- SIDEBAR (w-60, bg-earth-900, full height) ---
- Logo dessa.id (atas)
- Menu:
    Dashboard     icon LayoutDashboard  → /dashboard (active)
    Listing Saya  icon List             → /dashboard/listing
    Buat Listing  icon Plus             → /dashboard/listing/baru
    Profil        icon User             → /dashboard/profil
- Bawah: tombol Keluar (icon LogOut, text-earth-500)
- Active state: bg-green-700/20 text-green-100 rounded-lg

--- KONTEN UTAMA ---
Header: "Selamat datang, [Nama Penjual]" H2 + tanggal hari ini

ROW STATS (4 kartu metric):
  - Total Listing    : angka dari LISTINGS (filter seller)
  - Listing Tayang   : filter status published
  - Listing Pending  : filter status pending
  - Terjual          : filter status sold
  Style: bg-white border border-sand-300 rounded-xl p-5
  Angka: text-2xl font-medium text-earth-900
  Label: text-xs text-earth-500

TABEL LISTING SAYA:
Header: "Listing Saya" + tombol "Buat Listing Baru" pojok kanan
Kolom tabel:
  - Foto (thumbnail 48px rounded)
  - Judul + lokasi
  - Harga
  - Status (badge warna)
  - Aksi: tombol Edit (icon Pencil) + Hapus (icon Trash)

STATUS BADGE:
  published : bg-green-100 text-green-900
  pending   : bg-amber-100 text-amber-800
  draft     : bg-blue-100 text-blue-800
  sold      : bg-gray-100 text-gray-600

Empty state: jika belum ada listing
  ilustrasi placeholder + teks "Belum ada listing"
  tombol "Buat Listing Pertama →"

============================================================

=== HALAMAN 7: FORM LISTING (BUAT / EDIT) ===
Route: app/dashboard/listing/baru/page.tsx
       app/dashboard/listing/[id]/edit/page.tsx

Layout: max-w-2xl mx-auto px-4 py-8 bg-earth-50

Breadcrumb: Dashboard > Listing Saya > Buat Listing Baru

H1: "Buat Listing Lahan Baru" (atau "Edit Listing")

Form dibagi 4 SECTION dengan heading:

--- SECTION 1: INFORMASI DASAR ---
  Label: "Judul Listing" *
  Input: placeholder "Contoh: Lahan kebun Ungaran, cocok untuk villa"
  Helper: "Maksimal 80 karakter" + counter sisa karakter

  Label: "Kategori Lahan" *
  Select/RadioGroup: Hunian | Kebun | Pertanian | Investasi | Lainnya

  Label: "Deskripsi" *
  Textarea 4 baris, placeholder detail kondisi & potensi lahan

--- SECTION 2: SPESIFIKASI & HARGA ---
  2 kolom (md):
    Luas Lahan (m²) *  | Harga (Rp) *
    input number        | input number, format otomatis "Rp 120.000.000"

  Label: "Status Dokumen" *
  RadioGroup: SHM | SHGB | Girik | AJB
  Masing-masing dengan deskripsi singkat

--- SECTION 3: LOKASI (GPS PINPOINT) ---
  Heading: "Tandai Lokasi di Peta" *
  Sub: "Klik pada peta untuk menentukan titik koordinat lahan secara presisi"

  PETA LEAFLET:
  - Height 300px, rounded-xl
  - Default center: Semarang
  - Klik peta → letakkan marker, update koordinat
  - Marker bisa di-drag untuk adjust

  Display koordinat (read-only):
  - "Latitude : -7.1321"
  - "Longitude: 110.3891"
  Tombol "Reset Lokasi" jika ingin ulang

--- SECTION 4: UPLOAD FOTO ---
  Label: "Foto Lahan" * (maks 10 foto)
  Area drop: dashed border, icon Upload, teks "Klik atau drag foto ke sini"
  Support: JPG, PNG, maks 5MB per foto
  Preview: grid thumbnail setelah upload
  Keterangan watermark: "Foto akan otomatis diberi watermark dessa.id"

  Label: "Dokumen Legalitas" (opsional, hanya terlihat admin)
  Upload tunggal: KTP pemilik atau foto sertifikat
  Helper: "File ini TIDAK ditampilkan ke publik, hanya untuk verifikasi admin"

--- FOOTER FORM ---
  2 tombol:
    "Simpan Draft"     → border ghost
    "Kirim untuk Review" → bg-green-700 (submit utama)

  Setelah submit → tampilkan modal sukses:
    "Listing terkirim! Admin akan mereview dalam 1x24 jam."
    Tombol "Kembali ke Dashboard"

============================================================

=== HALAMAN 8: ADMIN PANEL ===
Route: app/admin/page.tsx
Guard: hanya bisa diakses jika isAdmin = true

Layout: sama dengan dashboard penjual (sidebar kiri + konten)
Sidebar bg-earth-900 dengan menu admin:
  - Dashboard      icon LayoutDashboard   → /admin
  - Antrian Review icon ClipboardList     → /admin (active)
  - Semua Listing  icon Map               → /admin/listing
  - Keluar         icon LogOut

--- KONTEN UTAMA ---

Header: "Admin Panel" H2 + badge "Admin" bg-amber-100 text-amber-800

ROW STATS:
  - Menunggu Review  : highlight merah/amber (penting!)
  - Total Tayang     : text biasa
  - Total Terjual    : text biasa
  - Total Listing    : text biasa

TABEL ANTRIAN (listing status: pending):
Heading: "Menunggu Review" + badge jumlah merah

Kolom:
  - Foto thumbnail 48px
  - Judul + lokasi + nama penjual
  - Tanggal dikirim
  - Status: badge "Menunggu" amber
  - Aksi: tombol "Review" → /admin/listing/[id]

Baris diwarnai berbeda: bg-amber-50/30 untuk memperjelas antrian

TABEL SEMUA LISTING (di bawah antrian):
Heading: "Semua Listing"
Kolom: Foto | Judul | Penjual | Status | Tanggal | Aksi (Edit/Hapus)
Filter tab: Semua | Tayang | Pending | Terjual

Empty state antrian:
  icon CheckCircle besar, text-green-700
  "Tidak ada listing yang perlu direview"

============================================================

=== HALAMAN 9: ADMIN DETAIL REVIEW ===
Route: app/admin/listing/[id]/page.tsx
Guard: hanya admin

Layout: max-w-4xl mx-auto px-4 py-8

Breadcrumb: Admin > Antrian Review > [Judul Lahan]

--- LAYOUT 2 KOLOM ---
Kiri (md:col-span-2): detail listing
Kanan (md:col-span-1): panel keputusan (sticky)

--- KONTEN KIRI ---

1. GALERI FOTO
   Sama dengan halaman detail lahan publik
   Foto bisa diklik untuk perbesar (lightbox sederhana)

2. DETAIL SPESIFIKASI
   Tabel grid: Judul | Kategori | Luas | Harga | Dokumen
   Koordinat: tampilkan + peta mini Leaflet

3. DESKRIPSI LAHAN
   Teks dari field deskripsi

4. DATA PENJUAL (khusus admin, tidak publik)
   Card bg-amber-50 border border-amber-200:
   - Nama penjual
   - Nomor WhatsApp
   - Email
   - Tanggal registrasi

5. DOKUMEN LEGALITAS (khusus admin)
   Jika ada upload dokumen:
   → tampilkan sebagai gambar atau link download
   Jika tidak ada:
   → "Penjual belum upload dokumen" text-earth-500

--- PANEL KANAN (sticky top-24) ---

Card bg-white border border-sand-300 rounded-xl p-5

Status saat ini: badge "Menunggu Review" amber besar

Textarea: "Catatan untuk penjual" (opsional)
  placeholder: "Tulis catatan jika ada revisi yang diperlukan..."
  4 baris

2 TOMBOL AKSI (full width, dengan spacing):

  "Setujui & Tayangkan"
  bg-green-700 text-white
  icon: CheckCircle
  → update status ke published, redirect ke /admin

  "Tolak & Minta Revisi"
  bg-red-600 text-white (atau border merah)
  icon: XCircle
  → update status ke rejected, kirim catatan ke penjual
  → redirect ke /admin

Konfirmasi sebelum aksi:
  Modal/Alert sederhana:
  "Yakin ingin menyetujui listing ini?"
  Tombol Konfirmasi | Batal

Info bawah:
  "Listing yang disetujui akan langsung tampil di halaman publik."
  text-xs text-earth-500