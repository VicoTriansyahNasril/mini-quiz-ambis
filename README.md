# 🏆 Mini Quiz Ambis

**Mini Quiz Ambis** adalah platform kuis interaktif berbasis web (*Frontend*) yang dibangun dengan fokus pada performa, pengalaman pengguna (*User Experience*), dan arsitektur kode yang *scalable*.

Project ini dikembangkan menggunakan ekosistem **Next.js 15 (App Router)** terbaru dengan penerapan **Clean Code** dan **Feature-Based Architecture**.

---

## 🌐 Live Demo

Aplikasi telah dideploy dan dapat diakses melalui link berikut:

👉 **https://mini-quiz-ambis.vercel.app/**

---

## 🚀 Tech Stack

Project ini dibangun menggunakan teknologi modern yang dipilih berdasarkan efisiensi dan performa:

- **Core:** [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (Zero-runtime CSS)
- **State Management (Client):** [Zustand](https://github.com/pmndrs/zustand) + Persist Middleware (Ringan & Cepat)
- **State Management (Server):** [TanStack Query v5](https://tanstack.com/query/latest) (Caching & Synchronization)
- **Form & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Networking:** Axios dengan Interceptors
- **Icons:** Lucide React

---

## 🛠️ Cara Menjalankan Project (Getting Started)

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di komputer lokal Anda.

### 1. Prasyarat
Pastikan Anda telah menginstal **Node.js** (Versi 18 atau lebih baru).

### 2. Instalasi
```bash
# 1. Clone repository ini
git clone https://github.com/VicoTriansyahNasril/mini-quiz-ambis.git

# 2. Masuk ke direktori project
cd mini-quiz-ambis

# 3. Install dependencies (pilih satu)
npm install
# atau
yarn install
# atau
pnpm install
```

### 3. Konfigurasi Environment (Penting)
Project ini menggunakan **API Proxy** bawaan Next.js untuk menghindari masalah CORS dan menyembunyikan endpoint API asli.

Secara default, konfigurasi sudah diarahkan ke API publik Ambis di file:
`src/app/api/proxy/[...path]/route.ts`

Jika Anda perlu mengubah URL Backend atau menggunakan Environment Variables:
1. Buat file `.env.local` di root folder.
2. Tambahkan variabel: `NEXT_PUBLIC_API_URL=https://api-tujuan-anda.com`
3. Sesuaikan file proxy untuk membaca variabel tersebut.

### 4. Jalankan Server Development
Setelah dependensi terinstal, jalankan server lokal:

```bash
npm run dev
```
Buka browser Anda dan akses: http://localhost:3000

## 📂 Struktur Arsitektur: Feature-Based

Project ini menerapkan **Feature-Based Architecture**. Berbeda dengan struktur standar yang mengelompokkan file berdasarkan jenisnya (seperti menumpuk semua hooks di satu folder `src/hooks`), arsitektur ini mengelompokkan kode berdasarkan **Fitur Bisnis**.

Pilihan ini diambil untuk memenuhi kriteria **Scalability** dan **Maintainability** dalam pengembangan software modern.

```bash
src/
├── app/                  # Next.js App Router (Hanya untuk Routing & Layouting)
├── components/           # UI Components Global (Button, Input, Modal, Card - Reusable)
├── features/             # 🧠 LOGIKA UTAMA APLIKASI (Smart Components)
│   ├── auth/             # Login, Register, Verify Email logic
│   ├── quiz/             # Core Logic: Session, Timer, Question Navigation, Submission
│   ├── history/          # List Riwayat & Detail Analisis Hasil
│   └── profile/          # Edit Profile & Security logic
├── lib/                  # Utilitas Global (Axios Instance, Error Handler, formatting)
└── types/                # TypeScript Definitions Global
```

### 💡 Mengapa Menggunakan Struktur Ini? (Poin Interview)
1.  **Colocation (Lokalisasi Kode):**
    Semua hal yang berkaitan dengan satu fitur (API calls, Hooks, Components, Types) berada di satu folder. Ini sangat memudahkan proses *debugging* dan *refactoring*. Jika fitur "Kuis" bermasalah, developer hanya perlu fokus pada folder `features/quiz` tanpa perlu mencari file yang tersebar di folder global.
2.  **Separation of Concerns:**
    Memisahkan komponen UI murni (`src/components/ui`) yang bersifat *dumb/stateless* dengan komponen fitur (`src/features`) yang bersifat *smart/stateful* dan memuat logika bisnis.
3.  **Scalability:**
    Saat aplikasi membesar, folder `components` atau `hooks` global tidak akan menjadi "tempat sampah" yang berantakan. Struktur ini juga memudahkan jika di masa depan fitur tertentu ingin dipisah menjadi *package* atau *micro-frontend* tersendiri.

---

## 🧠 Keputusan Teknis & Solusi (Key Technical Decisions)

Bagian ini menjelaskan rasionalisasi teknis di balik pengembangan aplikasi untuk menjawab kriteria penilaian terkait **Manajemen State**, **Performa**, dan **Penanganan Error**.

### 1. Strategi Manajemen State (Hybrid)
Kami memisahkan state menjadi dua kategori untuk performa optimal:

*   **Server State (Menggunakan TanStack Query v5):**
    *   Digunakan untuk data yang bersumber dari database (Daftar Kuis, History, Profil).
    *   **Alasan:** Library ini otomatis menangani *caching*, *background refetching*, *loading state*, dan sinkronisasi data server yang kompleks, menggantikan ribuan baris kode `useEffect` manual.
*   **Client State (Menggunakan Zustand + Persist):**
    *   Digunakan untuk data sesi lokal yang bersifat sementara (Draft Jawaban, Flag Ragu-ragu, Session ID).
    *   **Alasan:** Zustand jauh lebih ringan daripada Redux (tanpa boilerplate). Middleware `persist` digunakan agar **jawaban user tidak hilang** meskipun browser di-refresh (sangat krusial untuk aplikasi ujian online).

### 2. Autentikasi & Keamanan
*   **Token Handling:** JWT disimpan di `localStorage` (Client-side) untuk kemudahan akses SPA, namun diproses secara terpusat melalui **Axios Interceptor**.
*   **Interceptor Request:** Otomatis menyisipkan header `Authorization: Bearer <token>` di setiap request ke API.
*   **Interceptor Response:** Menangani global error. Jika API merespon `401 Unauthorized` (Token expired/invalid), aplikasi otomatis menghapus sesi lokal dan memaksa user Logout ke halaman login.

### 3. Error Handling & Resilience (Ketahanan Aplikasi)
Aplikasi dirancang untuk menangani *edge cases* dengan UX yang baik:
*   **Conflict (409):** Jika user mencoba mulai kuis baru saat masih ada sesi aktif di server, sistem mendeteksi error 409 dan otomatis me-redirect user ke sesi yang sedang berjalan.
*   **Server Error (500):** Menampilkan halaman khusus "Gangguan Server" dengan tombol muat ulang, alih-alih membiarkan aplikasi *crash* atau menampilkan layar putih (*blank screen*).
*   **Session Timeout:** Validasi ganda (Client timer & Server validation). Jika waktu habis saat load halaman, sistem otomatis melakukan *Force Submit*.

### 4. UX Optimization: Splash Screen & Loading
*   **Interstitial Loading (Splash Screen):** Saat masuk ke sesi kuis, aplikasi menampilkan animasi loading khusus. Tujuannya adalah menutupi proses *fetching* data soal yang kompleks dan memberikan transisi visual yang halus ("Menyiapkan soal..."), sehingga user tidak melihat layout yang "melompat".
*   **Specific Loading State:** Di Dashboard, indikator loading (spinner) hanya muncul pada tombol/kartu kuis yang diklik secara spesifik. Ini mencegah UI blocking pada seluruh layar, membuat aplikasi terasa lebih responsif.

---
