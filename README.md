# Aplikasi Cek Kelulusan 📋

Aplikasi web sederhana untuk **cek kelulusan siswa** dengan Next.js 15, Tailwind CSS v4, shadcn/ui, NextAuth (v4), dan Drizzle ORM + PostgreSQL.

## Fitur utama

- Halaman publik: siswa masukkan **NIS + Tanggal Lahir**, cek apakah lulus atau tidak  
- Hasil menunjukkan: NIS, Nama, Kelas + status lulus + apakah hasil sudah dibuka  
- Admin:
  - Login (username/password)  
  - Dashboard statistik (total, lulus, tidak lulus, sudah dibuka)  
  - Manajemen siswa (CRUD, pencarian)  
  - Upload data siswa via Excel / CSV  
  - Pengaturan buka/tutup cek kelulusan / jadwal buka otomatis  
- Keamanan: tokenisasi hasil, rate limit sederhana, proteksi halaman admin, validasi input

---

## Teknologi & Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend / UI | Next.js 15 (App Router), Tailwind CSS v4, shadcn/ui |
| Autentikasi | NextAuth v4 (Credentials Provider) |
| Database / ORM | PostgreSQL dengan Drizzle ORM |
| Validasi & util | Zod, custom token util |
| Excel import | SheetJS (xlsx) |
| Deployment | Vercel / container / layanan PostgreSQL (Neon, Supabase, Railway, dst) |

---

## Instalasi & Setup Lokal

1. Clone repo  
   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```

2. Install dependencies  
   ```bash
   pnpm install
   ```

3. Buat database PostgreSQL lokal (atau remote)  
   Misalnya pakai Docker:
   ```bash
   docker run --name kelulusan-db -e POSTGRES_PASSWORD=admin -e POSTGRES_USER=admin -e POSTGRES_DB=kelulusan -p 5432:5432 -d postgres:15
   ```

4. Buat file `.env` berdasarkan `.env.example`  
   Contoh isi:
   ```
   DATABASE_URL=postgres://admin:admin@localhost:5432/kelulusan
   AUTH_SECRET=isi_dengan_random_string
   NEXTAUTH_URL=http://localhost:3000
   ADMIN_DEFAULT_USERNAME=admin
   ADMIN_DEFAULT_PASSWORD=admin123
   ```

5. Jalankan migrasi Drizzle
   ```bash
   pnpm drizzle-kit push
   ```

6. (Opsional) Seed data awal  
   - Jalankan SQL `seed.sql`  
   - Atau `pnpm tsx scripts/seed.ts` (jika tersedia)

7. Jalankan dev server  
   ```bash
   pnpm dev
   ```

Akses di `http://localhost:3000`
