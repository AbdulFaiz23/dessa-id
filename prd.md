# PRD – Dessa.id
## Platform Promosi Lahan Pedesaan Berbasis Geospasial

| Field | Value |
|---|---|
| **Nama Produk** | Dessa.id |
| **Versi PRD** | v1.1 – MVP |
| **Author** | Mohammad Abdul Faiz · A11.2023.15305 |
| **Tanggal** | Juni 2025 |
| **Tech Stack** | Next.js 14 + Supabase + Mapbox GL JS |
| **Target Rilis MVP** | Q3 2025 |

---

## Daftar Isi

1. [Overview Produk](#1-overview-produk)
2. [User Persona](#2-user-persona)
3. [User Flow](#3-user-flow)
4. [Arsitektur & Tech Stack](#4-arsitektur--tech-stack)
5. [Fitur & Requirements](#5-fitur--requirements)
6. [Halaman & Routing](#6-halaman--routing)
7. [Desain Database](#7-desain-database)
8. [Error States & Edge Cases](#8-error-states--edge-cases)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Milestone & Roadmap](#10-milestone--roadmap)
11. [Out of Scope (MVP)](#11-out-of-scope-mvp)
12. [Risiko & Mitigasi](#12-risiko--mitigasi)

---

## 1. Overview Produk

### 1.1 Latar Belakang

Banyak pemilik lahan pedesaan di wilayah Semarang dan Jawa Tengah kesulitan mempromosikan lahannya kepada calon pembeli dari perkotaan. Di sisi lain, masyarakat kota yang ingin berinvestasi lahan pedesaan tidak memiliki akses informasi yang akurat, transparan, dan terpercaya.

Grup jual-beli di media sosial penuh dengan listing tidak lengkap, foto tanpa koordinat, dan informasi yang sulit diverifikasi. Dessa.id hadir untuk menjawab gap ini.

### 1.2 Visi & Misi

| | |
|---|---|
| **Visi** | Menjadi platform promosi lahan pedesaan nomor satu di Indonesia yang transparan dan berbasis data geospasial. |
| **Misi** | Mendigitalisasi aset lahan desa dan menjembatani pemilik lahan dengan calon investor perkotaan melalui marketplace informatif berbasis peta. |

### 1.3 Scope MVP

Dessa.id MVP adalah platform web **promosi & discovery** lahan pedesaan.

> ⚠️ Platform ini **BUKAN** marketplace transaksi — tidak ada fitur pembayaran, escrow, atau kontrak digital. Transaksi dan urusan notaris dilakukan di luar platform.

**Fokus MVP:**
- Wilayah operasional: Semarang & sekitarnya (Jawa Tengah)
- Target listing aktif tahun pertama: 500+ lahan
- Pengguna: penjual lahan, pembeli/investor, dan admin Dessa.id

---

## 2. User Persona

| | **Penjual Lahan** | **Pembeli / Investor** | **Admin Dessa.id** |
|---|---|---|---|
| **Siapa** | Pemilik lahan desa, perangkat desa, ahli waris | Masyarakat perkotaan, profesional, komunitas agribisnis, developer skala kecil | Tim Dessa.id (pendiri & operator) |
| **Pain** | Susah promosi ke pembeli kota, tidak tahu harga pasar | Info lahan tidak jelas, lokasi tidak presisi, takut penipuan | Perlu kontrol kualitas listing secara efisien |
| **Goal** | Lahan terjual, proses mudah, dapat harga wajar | Menemukan lahan yang sesuai, transparan, bisa survei mandiri | Moderasi cepat, data akurat, platform terpercaya |
| **Device** | Mayoritas mobile (HP Android kelas menengah) | Desktop & mobile | Desktop |
| **Tech Savviness** | Rendah–Menengah | Menengah–Tinggi | Tinggi |

---

## 3. User Flow

> Bagian ini baru di v1.1. Menjelaskan alur tiap persona dari entry point sampai goal tercapai, termasuk edge cases.

### 3.1 Flow Penjual — Daftar hingga Listing Tayang

```
[Landing Page]
      |
      v
[/daftar] Isi nama + email/nomor WA
      |
      |-- [Nomor WA sudah terdaftar] --> Tampilkan pesan "Akun sudah ada, silakan login" + link ke /masuk
      |
      v
[Verifikasi OTP via WA atau email]
      |
      |-- [OTP salah 3x] --> Tampilkan tombol "Kirim ulang OTP" (cooldown 60 detik)
      |-- [OTP expired] --> Tampilkan notifikasi + tombol "Kirim ulang"
      |
      v
[Akun aktif → redirect ke /dashboard]
      |
      v
[Dashboard Penjual] (listing kosong saat pertama kali)
      |
      v
[Klik "Buat Listing Baru" → /dashboard/listing/baru]
      |
      v
[Step 1: Isi Form Dasar]
  - Judul (wajib)
  - Deskripsi (wajib)
  - Luas m² (wajib, min: 1)
  - Harga Rp (wajib, min: 1.000.000)
  - Kategori: Hunian / Kebun / Investasi / Lainnya (wajib)
  - Status Dokumen: SHM / SHGB / Girik / AJB (wajib)
      |
      v
[Step 2: Upload Foto]
  - Multi-upload, maks 10 foto, maks 5MB/foto
  - Format: JPG, PNG
  - Pilih 1 foto sebagai cover
  - Watermark "dessa.id" ditambahkan server-side setelah upload
      |
      |-- [Foto gagal upload] --> Tampilkan error per foto + tombol retry individual
      |-- [Foto > 5MB] --> Tampilkan pesan "Foto terlalu besar, maks 5MB"
      |
      v
[Step 3: GPS Pinpoint]
  - Default: tampilkan peta wilayah Semarang & sekitarnya
  - User drag pin ke lokasi lahan
  - Tersedia tombol "Gunakan lokasi saya sekarang" (geolocation API)
  - Koordinat lat/lng ditampilkan setelah pin diletakkan
      |
      |-- [User menolak izin lokasi browser] --> Tetap bisa drag pin manual, geolocation dinonaktifkan
      |
      v
[Step 4: Upload Dokumen Privat (Opsional di MVP)]
  - Upload foto KTP penjual
  - Upload foto sertifikat / dokumen lahan
  - Catatan: dokumen ini hanya bisa dilihat admin, tidak publik
      |
      v
[Halaman Ringkasan — Review sebelum submit]
  - Tampilkan semua data yang diisi
  - Tombol "Edit" per section
  - Tombol "Ajukan untuk Review"
      |
      v
[Status listing → PENDING]
  - Penjual menerima notifikasi WA: "Listing kamu sedang direview tim Dessa.id. Estimasi 1x24 jam."
  - Di dashboard, listing muncul dengan badge "Menunggu Review"
      |
      |-- [Disetujui Admin] --> Status → PUBLISHED
      |                         Notifikasi WA ke penjual: "Listing kamu sudah tayang!"
      |                         Link langsung ke halaman listing
      |
      |-- [Ditolak Admin]   --> Status → DITOLAK
                               Notifikasi WA ke penjual: "Listing ditolak. Alasan: [catatan admin]"
                               Tombol "Revisi & Ajukan Ulang" di dashboard
```

**Aturan tambahan flow penjual:**
- Form mendukung **auto-save draft** setiap 30 detik (disimpan ke localStorage sebagai fallback)
- Penjual bisa edit listing yang sudah PUBLISHED → status kembali ke PENDING (moderasi ulang)
- Penjual **tidak bisa** menandai lahan sebagai Terjual sendiri — harus konfirmasi ke admin via WA
- Listing aktif **tidak expired otomatis** di MVP, tapi bisa ditambahkan di v1.1

---

### 3.2 Flow Pembeli — Discovery hingga Hubungi Penjual

```
[Landing Page / /jelajahi]
      |
      v
[Map View — tampilkan pin lahan tersedia]
      |
      v
[Pembeli filter: harga, luas, kategori, status dokumen]
      |
      v
[Klik pin di peta / klik card di list view]
      |
      v
[Halaman Detail Lahan /lahan/[id]]
  - Foto galeri (swipeable di mobile)
  - Judul, deskripsi, spesifikasi lengkap
  - Status dokumen + badge Verified (jika diverifikasi admin)
  - Lokasi di mini-map
  - Tombol "Navigasi ke Lokasi" → deep link Google Maps/Waze
  - Tombol "Hubungi Penjual via WhatsApp" → wa.me/[nomor]
      |
      |-- [Lahan sudah Terjual] --> Tampilkan banner "Lahan ini sudah terjual"
                                    Sembunyikan tombol hubungi penjual
                                    Tampilkan "Lihat lahan serupa"
```

---

### 3.3 Flow Admin — Moderasi Listing

```
[Login /masuk sebagai Admin]
      |
      v
[/admin — Dashboard Antrian]
  - Tampilkan semua listing berstatus PENDING
  - Urutkan: terlama menunggu di atas
      |
      v
[Klik listing → /admin/listing/[id]]
  - Review semua data listing
  - Lihat dokumen privat (KTP, sertifikat)
  - Input catatan (wajib jika menolak)
      |
      |-- [Approve] --> Status → PUBLISHED, notifikasi WA ke penjual
      |-- [Tolak]   --> Status → DITOLAK, notifikasi WA + catatan ke penjual
      |-- [Tandai Terjual] --> Status → SOLD, halaman listing tampilkan banner "Terjual"
```

---

## 4. Arsitektur & Tech Stack

| Layer | Teknologi | Keterangan |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) | React framework, SSR/SSG, routing, API routes |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first CSS, komponen siap pakai |
| **Map** | Mapbox GL JS / Leaflet | Tampilan peta interaktif & GPS pinpoint |
| **Backend/DB** | Supabase (PostgreSQL) | Database, Auth, Storage, Realtime |
| **Auth** | Supabase Auth | Login via email, WhatsApp OTP (via Twilio) |
| **Storage** | Supabase Storage | Upload foto lahan, dokumen privat |
| **Deployment** | Vercel | Hosting Next.js, CI/CD otomatis dari GitHub |
| **Notifikasi** | Twilio WhatsApp API | Kirim notifikasi ke penjual saat status listing berubah |
| **Watermark** | Sharp (Node.js) | Proses watermark server-side di API route Next.js |
| **WhatsApp CTA** | wa.me deep link | Tombol hubungi langsung ke WhatsApp penjual |

---

## 5. Fitur & Requirements

**Keterangan prioritas:**
- `Wajib` = harus ada di MVP
- `Penting` = idealnya ada di MVP, bisa diimplementasi setelahnya
- `Nice to have` = roadmap fase berikutnya

---

### 5.1 Modul Autentikasi

| ID | Fitur | Deskripsi | Acceptance Criteria | Prioritas |
|---|---|---|---|---|
| A-01 | Registrasi penjual | Daftar via email atau nomor WhatsApp | - Form validasi field kosong & format email/nomor WA<br>- Jika nomor/email sudah terdaftar, tampilkan pesan spesifik<br>- OTP terkirim dalam 30 detik | Wajib |
| A-02 | Login penjual | Login dengan email+password atau OTP WhatsApp | - Sesi tersimpan (persistent login)<br>- Redirect ke `/dashboard` setelah login sukses<br>- Tampilkan error jelas jika kredensial salah | Wajib |
| A-03 | Login admin | Login khusus admin dengan email+password | - Role `admin` di-check via tabel `profiles`<br>- Non-admin yang akses `/admin` di-redirect ke `/dashboard` | Wajib |
| A-04 | Profil penjual | Edit nama, nomor WA, foto profil | - Perubahan tersimpan real-time<br>- Foto profil maks 2MB | Penting |
| A-05 | Lupa password | Reset password via email | - Email reset terkirim dalam 60 detik<br>- Link reset expired setelah 1 jam | Penting |

---

### 5.2 Modul Listing Lahan (Penjual)

| ID | Fitur | Deskripsi | Acceptance Criteria | Prioritas |
|---|---|---|---|---|
| L-01 | Buat listing baru | Form multi-step: data dasar, foto, GPS, dokumen | - Semua field wajib divalidasi sebelum bisa submit<br>- Form auto-save draft setiap 30 detik | Wajib |
| L-02 | Upload foto lahan | Multi-upload foto, maks 10 foto, maks 5MB/foto | - Progress upload per foto ditampilkan<br>- Retry individual jika 1 foto gagal<br>- Format: JPG, PNG saja | Wajib |
| L-03 | GPS pinpoint | Tandai lokasi lahan di peta secara presisi | - Drag pin manual<br>- Tombol "Gunakan lokasi saya" (geolocation)<br>- Koordinat lat/lng ditampilkan setelah pin diletakkan | Wajib |
| L-04 | Status dokumen | Pilih status: SHM, SHGB, Girik, AJB | - Dropdown dengan 4 pilihan<br>- Wajib dipilih sebelum submit | Wajib |
| L-05 | Dashboard listing | Lihat semua listing milik penjual beserta statusnya | - Status ditampilkan dengan warna berbeda: Draft (abu), Pending (kuning), Published (hijau), Terjual (biru), Ditolak (merah)<br>- Catatan penolakan tampil jika status Ditolak | Wajib |
| L-06 | Edit listing | Edit data listing | - Jika listing sudah PUBLISHED, edit akan mengubah status kembali ke PENDING<br>- Tampilkan warning sebelum konfirmasi edit | Penting |
| L-07 | Hapus listing | Hapus listing | - Hanya bisa hapus listing berstatus Draft atau Ditolak<br>- Konfirmasi dialog sebelum hapus | Penting |
| L-08 | Upload dokumen privat | Upload KTP & sertifikat untuk verifikasi admin | - File tidak bisa diakses publik (Supabase RLS)<br>- Format: JPG, PNG, PDF<br>- Maks 10MB per file | Penting |

---

### 5.3 Modul Pencarian & Discovery (Pembeli)

| ID | Fitur | Deskripsi | Acceptance Criteria | Prioritas |
|---|---|---|---|---|
| P-01 | Map view | Peta interaktif dengan pin lahan tersedia | - Hanya tampilkan lahan berstatus PUBLISHED<br>- Cluster pin jika zoom out<br>- Klik pin → tampilkan preview card | Wajib |
| P-02 | Filter pencarian | Filter: harga min-max, luas min-max, kategori, status dokumen | - Filter bisa dikombinasikan<br>- Hasil update real-time (tanpa reload halaman)<br>- Tombol "Reset Filter" tersedia | Wajib |
| P-03 | Halaman detail lahan | Foto galeri, deskripsi, spesifikasi, lokasi, status legalitas | - Foto swipeable di mobile<br>- Mini-map menampilkan lokasi pin<br>- Meta tag OG untuk share preview yang rapi | Wajib |
| P-04 | Tombol navigasi GPS | Deep link ke Google Maps/Waze | - Buka Google Maps secara default<br>- Koordinat lat/lng diteruskan ke URL Maps | Wajib |
| P-05 | Tombol WA penjual | Buka WhatsApp langsung ke nomor penjual | - Format wa.me/62xxx<br>- Pesan default sudah terisi: "Halo, saya tertarik dengan lahan [judul listing] di Dessa.id" | Wajib |
| P-06 | Badge Verified | Badge pada lahan yang sudah divalidasi admin | - Badge hanya muncul jika `is_verified = true`<br>- Tooltip menjelaskan arti Verified | Wajib |
| P-07 | Pencarian teks | Cari berdasarkan nama desa / kecamatan / kota | - Search bar di atas peta / list<br>- Minimum 3 karakter untuk trigger search<br>- Highlight keyword di hasil | Penting |
| P-08 | List view | Tampilan daftar listing sebagai alternatif map view | - Toggle antara Map View dan List View<br>- List menampilkan: foto cover, judul, harga, luas, badge Verified | Penting |
| P-09 | Simpan / bookmark | Simpan listing favorit (perlu login) | - Login wall muncul jika user belum login | Nice to have (v1.1) |
| P-10 | Share listing | Bagikan listing via link atau media sosial | - Salin link, share ke WA, share ke Twitter/X | Nice to have (v1.1) |

---

### 5.4 Modul Admin Panel

| ID | Fitur | Deskripsi | Acceptance Criteria | Prioritas |
|---|---|---|---|---|
| ADM-01 | Dashboard antrian | Lihat semua listing PENDING | - Urutkan: terlama menunggu di atas<br>- Tampilkan: judul, nama penjual, waktu submit | Wajib |
| ADM-02 | Approve listing | Setujui listing untuk tayang publik | - Status → PUBLISHED<br>- Notifikasi WA otomatis ke penjual | Wajib |
| ADM-03 | Tolak listing | Tolak listing dengan catatan | - Field catatan wajib diisi sebelum bisa tolak<br>- Status → DITOLAK<br>- Notifikasi WA + catatan ke penjual | Wajib |
| ADM-04 | Tandai Terjual | Tandai lahan sebagai Terjual | - Status → SOLD<br>- Halaman listing tampilkan banner "Terjual"<br>- Sembunyikan tombol hubungi penjual | Wajib |
| ADM-05 | Lihat dokumen privat | Akses KTP & sertifikat penjual | - Hanya role `admin` bisa akses via Supabase RLS<br>- File tampil inline (preview), bukan download otomatis | Wajib |
| ADM-06 | Kelola listing | Edit / hapus listing dari sisi admin | - Admin bisa edit semua field<br>- Hapus listing butuh konfirmasi | Penting |
| ADM-07 | Dashboard statistik | Jumlah listing aktif, views, klik WA | - Tampilkan: total listing per status, total views 7 hari terakhir | Nice to have (v1.1) |

---

### 5.5 Fitur Keamanan & Konten

| ID | Fitur | Deskripsi | Acceptance Criteria | Prioritas |
|---|---|---|---|---|
| S-01 | Watermark otomatis | Tambahkan watermark "dessa.id" pada foto listing | - Diproses server-side (Sharp) setelah upload<br>- Posisi: pojok kanan bawah, semi-transparan<br>- Foto asli tidak disimpan di storage publik | Wajib |
| S-02 | Sembunyikan data sensitif | KTP & dokumen privat hanya bisa diakses admin | - Supabase RLS: bucket dokumen privat hanya bisa di-read role `admin`<br>- URL file tidak bisa diakses tanpa auth | Wajib |
| S-03 | Moderasi wajib | Setiap listing baru harus disetujui admin sebelum tayang | - Listing baru otomatis masuk status PENDING<br>- Tidak bisa tayang tanpa approval admin | Wajib |
| S-04 | Rate limiting listing | Batasi jumlah submit listing per penjual | - Maks 5 listing baru per penjual per hari<br>- Tampilkan pesan error jika limit tercapai | Penting |

---

## 6. Halaman & Routing (Next.js)

| Route | Nama Halaman | Akses | Deskripsi |
|---|---|---|---|
| `/` | Landing Page | Publik | Hero, value proposition, CTA daftar & jelajahi lahan |
| `/jelajahi` | Map Explorer | Publik | Peta interaktif + filter + toggle list view |
| `/lahan/[id]` | Detail Lahan | Publik | Foto galeri, info legalitas, tombol navigasi & WA |
| `/daftar` | Registrasi Penjual | Guest only | Form daftar akun penjual |
| `/masuk` | Login | Guest only | Halaman login penjual & admin |
| `/dashboard` | Dashboard Penjual | Auth (seller) | Kelola listing milik penjual |
| `/dashboard/listing/baru` | Buat Listing | Auth (seller) | Form multi-step buat listing baru |
| `/dashboard/listing/[id]/edit` | Edit Listing | Auth (seller, owner) | Edit listing yang sudah ada |
| `/admin` | Admin Panel | Auth (admin) | Dashboard antrian moderasi |
| `/admin/listing/[id]` | Detail Moderasi | Auth (admin) | Review listing + approve/tolak |

**Route protection rules:**
- `/dashboard*` → redirect ke `/masuk` jika belum login
- `/admin*` → redirect ke `/` jika role bukan `admin`
- `/daftar` dan `/masuk` → redirect ke `/dashboard` jika sudah login

---

## 7. Desain Database (Supabase/PostgreSQL)

### Tabel: `profiles`
> Extend dari `auth.users` Supabase

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid (FK auth.users) | Primary key, referensi ke auth |
| `full_name` | text | Nama lengkap penjual |
| `whatsapp` | text | Nomor WhatsApp (format: 628xxx) |
| `role` | text | Nilai: `seller` atau `admin` |
| `created_at` | timestamptz | Waktu registrasi |

---

### Tabel: `listings`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid | Primary key |
| `seller_id` | uuid (FK profiles) | Pemilik listing |
| `title` | text | Judul listing |
| `description` | text | Deskripsi lahan |
| `area_m2` | numeric | Luas lahan dalam meter persegi |
| `price` | bigint | Harga dalam Rupiah |
| `category` | text | `Hunian` / `Kebun` / `Investasi` / `Lainnya` |
| `doc_status` | text | `SHM` / `SHGB` / `Girik` / `AJB` |
| `latitude` | double precision | Koordinat GPS lintang |
| `longitude` | double precision | Koordinat GPS bujur |
| `status` | text | `draft` / `pending` / `published` / `sold` / `rejected` |
| `is_verified` | boolean | `true` jika sudah diverifikasi admin |
| `admin_note` | text | Catatan moderasi dari admin (isi saat tolak) |
| `view_count` | integer | Jumlah views halaman detail (default: 0) |
| `created_at` | timestamptz | Waktu listing dibuat |
| `updated_at` | timestamptz | Waktu listing terakhir diubah |

---

### Tabel: `listing_photos`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid | Primary key |
| `listing_id` | uuid (FK listings) | Relasi ke listings |
| `storage_path` | text | Path file di Supabase Storage (sudah watermark) |
| `is_cover` | boolean | `true` jika foto utama (cover) |
| `order_index` | int | Urutan tampilan foto |

---

### Tabel: `listing_documents`
> Baru di v1.1 — dokumen privat penjual

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid | Primary key |
| `listing_id` | uuid (FK listings) | Relasi ke listings |
| `doc_type` | text | `ktp` / `sertifikat` / `lainnya` |
| `storage_path` | text | Path file di bucket privat Supabase Storage |
| `uploaded_at` | timestamptz | Waktu upload |

---

### Supabase RLS Policies (ringkasan)

| Tabel / Bucket | Policy |
|---|---|
| `listings` SELECT | Publik bisa baca listing berstatus `published` atau `sold` |
| `listings` INSERT/UPDATE | Hanya pemilik (`seller_id = auth.uid()`) |
| `listing_documents` SELECT | Hanya role `admin` |
| Storage bucket `listing-photos` | Publik bisa read, hanya pemilik yang bisa upload |
| Storage bucket `listing-documents` | Hanya role `admin` yang bisa read |

---

## 8. Error States & Edge Cases

> Bagian ini baru di v1.1. Wajib diimplementasi agar UX tidak rusak di kondisi non-ideal.

### 8.1 Error States Global

| Kondisi | Tampilan ke User |
|---|---|
| Koneksi internet terputus | Banner "Tidak ada koneksi internet. Beberapa fitur tidak tersedia." |
| API Supabase error (500) | Toast error: "Terjadi kesalahan server. Coba lagi beberapa saat." |
| Halaman tidak ditemukan | Halaman 404 dengan CTA kembali ke `/jelajahi` |
| Akses ditolak (unauthorized) | Redirect ke halaman login atau halaman utama |

### 8.2 Error States Form Listing

| Kondisi | Tampilan ke User |
|---|---|
| Field wajib kosong saat submit | Highlight field merah + pesan error inline |
| Harga kurang dari Rp 1.000.000 | "Harga minimal Rp 1.000.000" |
| Foto melebihi 5MB | "Foto [nama file] terlalu besar. Maks 5MB per foto." |
| Foto melebihi 10 file | "Maksimal 10 foto per listing." |
| Upload foto gagal (network) | Indikator error per foto + tombol "Coba lagi" |
| GPS tidak bisa diakses (izin ditolak) | Sembunyikan tombol geolocation, tampilkan teks "Tandai lokasi secara manual di peta" |
| Submit listing melebihi rate limit | "Kamu sudah mencapai batas 5 listing baru hari ini. Coba lagi besok." |

### 8.3 Edge Cases Halaman Detail Lahan

| Kondisi | Tampilan ke User |
|---|---|
| Lahan berstatus `sold` | Banner kuning: "Lahan ini sudah terjual." Tombol WA & navigasi disembunyikan. Tampilkan rekomendasi lahan serupa. |
| Lahan berstatus `pending` / `draft` | Halaman tidak bisa diakses publik → 404 |
| Foto listing tidak ada | Tampilkan placeholder image dengan teks "Foto belum tersedia" |
| Penjual tidak punya nomor WA | Sembunyikan tombol WA, tampilkan teks "Hubungi admin Dessa.id untuk info lebih lanjut" |

---

## 9. Non-Functional Requirements

| Kategori | Requirement |
|---|---|
| **Performa** | Halaman utama load < 3 detik pada koneksi 4G. Peta interaktif render < 2 detik setelah data tersedia. |
| **Responsif** | UI berfungsi penuh di desktop (1280px+), tablet (768px), dan mobile (375px+). |
| **Keamanan** | Semua komunikasi via HTTPS. Data sensitif penjual (KTP, sertifikat) hanya bisa diakses admin via Supabase RLS. |
| **Skalabilitas** | Supabase free tier cukup untuk MVP (~500 listing). Arsitektur mendukung migrasi ke tier berbayar saat trafik meningkat. |
| **Ketersediaan** | Target uptime 99% menggunakan Vercel + Supabase managed cloud. |
| **SEO** | Halaman listing dirender secara server-side (SSR/SSG) agar bisa diindeks mesin pencari. Meta tag OG lengkap per listing. |
| **Aksesibilitas** | Kontras warna memenuhi WCAG AA. Form dilengkapi label yang jelas. Tombol memiliki aria-label. |
| **Image Processing** | Watermark diproses server-side menggunakan Sharp di API route Next.js. Foto asli tidak disimpan di bucket publik. |

---

## 10. Milestone & Roadmap

| Fase | Timeline | Deliverable |
|---|---|---|
| **Fase 0** | Minggu 1–2 | Setup proyek: Next.js + Supabase + Vercel. Buat skema database + RLS policies. Desain UI wireframe. |
| **Fase 1** | Minggu 3–5 | Auth (penjual & admin), form listing multi-step, GPS pinpoint, upload foto, watermark server-side. |
| **Fase 2** | Minggu 6–8 | Map view + clustering, filter, halaman detail lahan, tombol GPS & WA, admin panel moderasi + notifikasi WA. |
| **Fase 3** | Minggu 9–10 | Landing page, SEO & OG tags, error states, rate limiting, bug fixing, uji coba internal dengan 10 listing perdana. |
| **v1.1** | Bulan 4–6 | Bookmark, share listing, dashboard statistik admin, notifikasi email moderasi, tabel `listing_documents`. |

---

## 11. Out of Scope (MVP)

Fitur berikut secara eksplisit **TIDAK** termasuk dalam MVP:

- Fitur pembayaran / escrow online
- Kontrak digital atau tanda tangan elektronik
- Fasilitasi proses notaris / PPAT secara digital
- Chat / messaging real-time antar pengguna di dalam platform
- Notifikasi push (mobile)
- Aplikasi mobile native (iOS / Android)
- Integrasi API harga tanah otomatis
- Multi-bahasa (selain Bahasa Indonesia)
- Penjual menandai sendiri lahan sebagai Terjual (harus lewat admin di MVP)

---

## 12. Risiko & Mitigasi

| Risiko | Level | Mitigasi |
|---|---|---|
| Sedikit penjual yang mau listing digital | **Tinggi** | Sosialisasi langsung ke desa, bantu upload listing perdana secara manual |
| Data lahan tidak akurat / palsu | **Tinggi** | Moderasi wajib + verifikasi dokumen sebelum tayang |
| Notifikasi WA tidak terkirim (Twilio error) | **Sedang** | Fallback: penjual cek status di dashboard. Log error untuk retry manual. |
| Peta lambat di koneksi lemah | **Sedang** | Gunakan tile caching + fallback ke list view |
| Supabase free tier melebihi batas | **Sedang** | Monitor usage sejak awal, upgrade saat trafik meningkat |
| Foto lahan diambil tanpa izin | **Sedang** | Watermark otomatis + terms of service yang jelas |
| GPS pinpoint tidak akurat (user salah taruh pin) | **Rendah** | Tampilkan koordinat lat/lng secara eksplisit + konfirmasi sebelum submit |

---

*— End of Document —*

*PRD Dessa.id v1.1 | Mohammad Abdul Faiz | A11.2023.15305*
*Dessa.id © 2025*