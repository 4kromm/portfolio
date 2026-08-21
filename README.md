# 4krom Portfolio

Project web portofolio pribadi Akrom. Situs web ini dibangun menggunakan Astro dan Tailwind CSS dengan tema Neo Brutalism .

```sh
git clone https://github.com/4kromm/portofolio.git
```

> Live Demo: [https://www.akrom.my.id/](https://www.akrom.my.id/)

## Ringkasan Proyek

Portofolio ini menampilkan profil, keahlian teknis, riwayat pengalaman, dan karya proyek pengembang web. Desain mengusung konsep Neo Brutalism dengan batas garis tebal, bayangan kontras tinggi, serta fitur interaktif berbasis JavaScript.

## Fitur Utama

* **Tata Letak Neo Brutalism** — Desain visual unik dengan bayangan tebal, pola halftone, serta mode terang dan gelap.
* **Kartu Profil Interaktif** — Fitur 4K Babel yang menampilkan baris kode dari berbagai bahasa pemrograman secara bergantian.
* **Widget Game Dino** — Permainan retro Dino yang disesuaikan dan dapat dimainkan langsung di dalam halaman web.
* **Visualisasi GitHub Snake** — Animasi kontribusi GitHub dalam bentuk permainan ular.
* **Audio** — Pemutar musik latar belakang interaktif dengan efek suara aksi pengguna.
* **Filter Project** — Penyaringan proyek berdasarkan kategori serta pop up modal untuk melihat rincian dan kode proyek.
* **Statistik GitHub Otomatis** — Script otomatisasi untuk mengambil jumlah komit dan data statistik profil GitHub.

## Struktur Project

Astro mencari berkas `.astro` atau `.md` di dalam direktori `src/pages/`. Setiap halaman diekspos sebagai rute berdasarkan nama berkasnya.

```text
/
├── public/
│   └── js/
│       ├── features/
│       │   ├── core.js
│       │   ├── dinoGame.js
│       │   ├── githubSnake.js
│       │   ├── interactive.js
│       │   └── projects.js
│       └── main.js
├── scripts/
│   └── fetchstats.js
├── src/
│   ├── components/
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── LifeLogs.astro
│   │   ├── Modal.astro
│   │   ├── Navbar.astro
│   │   ├── Overview.astro
│   │   ├── Projects.astro
│   │   └── TechArsenalWrapper.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       ├── animations.css
│       ├── base.css
│       ├── components.css
│       ├── global.css
│       ├── patterns.css
│       └── variables.css
├── env.d.ts
├── .gitignore
├── astro.config.mjs
├── package-lock.json
├── package.json
└── tailwind.config.mjs
```

* `public/js/` — Berkas JavaScript client side: logika game dino, ular GitHub, filter proyek, dan interaksi audio.
* `scripts/fetchstats.js` — Script Node.js untuk memperbarui data statistik GitHub secara otomatis.
* `src/components/` — Komponen Astro untuk setiap bagian halaman.
* `src/layouts/` — Tata letak utama halaman web (`Layout.astro`).
* `src/pages/` — Rute halaman utama (`index.astro`).
* `src/styles/` — Isinya berbagai css, variabel warna, animasi, dan pola visual.

## Komponen Utama

* `Hero.astro` — Bagian teratas yang memuat kartu profil, badge komit GitHub, animasi pet, dan tombol navigasi cepat.
* `Overview.astro` — Ringkasan profil, latar belakang pendidikan, serta integrasi widget interaktif Game Dino dan visualisasi ular GitHub.
* `TechArsenalWrapper.astro` — Daftar pustaka, bahasa pemrograman, dan alat pengembang yang dikuasai.
* `Projects.astro` — Daftar karya proyek lengkap dengan tombol filter kategori.
* `LifeLogs.astro` — Catatan pribadi dan jurnal hobi di luar aktivitas ngoding (game, musik, anime, film, dan kehidupan mahasiswa).
* `Modal.astro` — Jendela dialog pop-up untuk menampilkan pratinjau gambar visual dan tautan repositori proyek pilihan.
* `Navbar.astro` — Bar navigasi atas yang responsif.
* `Footer.astro` — Bagian bawah halaman yang berisi tautan sosial dan informasi hak cipta.
  
## Teknologi yang Digunakan

* **Astro 4** — Framework web statis yang cepat dan efisien.
* **Tailwind CSS 3** — Framework CSS berbasis utilitas untuk dekorasi antarmuka.
* **JavaScript Vanilla** — Logika fitur interaktif tanpa dependensi framework berat.
* **Node.js** — Lingkungan eksekusi script pembaca API GitHub.

## Panduan Instalasi dan Penggunaan

Semua perintah dijalankan dari root proyek, melalui terminal:

| Perintah | Aksi |
| :--- | :--- |
| `npm install` | Menginstal dependensi |
| `npm run dev` | Menjalankan server pengembang lokal di `localhost:4321` |
| `node scripts/fetchstats.js` | (Opsional) Memperbarui data statistik GitHub |
| `npm run build` | Build situs untuk produksi ke `./dist/` |
| `npm run preview` | Melihat pratinjau hasil build secara lokal sebelum deploy |

Langkah singkat:

```sh
git clone https://github.com/4kromm/portofolio.git
npm install
npm run dev
```

Akses situs melalui peramban web di alamat `http://localhost:4321`.

## Ingin Belajar Lebih Lanjut?

Silakan cek [dokumentasi Astro](https://docs.astro.build) atau langsung telusuri kode sumber di `src/components/`.

## Lisensi dan Hak Cipta

Hak cipta sepenuhnya dimiliki oleh Akrom. Bebas dipelajari untuk keperluan referensi pengembangan web.
