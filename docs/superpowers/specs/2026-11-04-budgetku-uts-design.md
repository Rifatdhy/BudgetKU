# Desain BudgetKu untuk UTS FBP

## Intent

Menjadikan BudgetKu sebagai aplikasi Angular yang mudah didemokan dan dinilai berdasarkan rubrik UTS: Dynamic Multi-Input FormArray, cross-validation, Controller-heavy logic, template branching, nested loop, context variables, UI state management, dan konsistensi antara implementasi dengan artefak analisis.

Tampilan menggunakan prinsip minimalis yang terinspirasi aplikasi produktivitas modern: ruang putih terukur, tipografi jelas, permukaan netral, aksen warna terbatas, dan tanpa menyalin identitas Apple.

## Goals

- Mempertahankan alur anggaran yang sudah diuji: pendapatan, kategori, item pengeluaran, ringkasan, validasi, reset, dan status.
- Membuat struktur template dan controller mudah dipetakan ke rubrik tugas.
- Menyajikan empty, loading, valid, warning, over-budget, dan validation-error state secara jelas.
- Memperbaiki hierarchy visual, focus state, kontras, breakpoint mobile, dan tap target.
- Menyiapkan dokumen pendukung yang konsisten dengan kode: use case, deskripsi use case, sequence diagram, dan component/data mapping.

## Non-goals

- Tidak menambahkan backend, database, autentikasi, routing, atau persistence.
- Tidak menambahkan dependency baru.
- Tidak membuat logo, avatar, testimonial, statistik produk, atau aset visual eksternal.
- Tidak mengubah proyek menjadi CRUD.

## Anti-goals

- Jangan menyembunyikan bukti `FormArray`, loop, validasi, atau state di balik abstraksi yang sulit dijelaskan saat presentasi.
- Jangan memindahkan logika perhitungan dan cross-validation kompleks ke template.
- Jangan memakai layout dashboard generik, dekorasi gradient/glow, atau komponen interaktif yang tidak memiliki perilaku.

## Pendekatan yang dipertimbangkan

1. **CSS-only refinement**: risiko regresi paling rendah, tetapi tidak cukup untuk merapikan bukti rubrik dan artefak dokumentasi.
2. **Perbaikan UI, template, controller, dan artefak dokumentasi**: dipilih karena kode inti sudah memenuhi sebagian besar kebutuhan, sementara hasil akhir perlu mudah diverifikasi dan dipresentasikan.
3. **Bangun ulang aplikasi**: ditolak karena menambah risiko dan tidak memberi nilai yang sebanding dengan implementasi saat ini.

## Desain yang dipilih

### Struktur aplikasi

- `BudgetPlannerComponent` tetap menjadi root component dan pemilik state form.
- `budgetForm` tetap berupa typed reactive form dengan `income` dan `categories: FormArray<CategoryGroup>`.
- Setiap kategori memiliki `expenses: FormArray<ExpenseGroup>`.
- Controller mempertahankan fungsi terpisah untuk tambah/hapus, perhitungan, status, validasi, dan tracking.
- Template memakai `@if` dan `@for` bila kompatibel dengan konfigurasi Angular saat perubahan dilakukan, sambil menjaga selector E2E yang sudah ada.

### Validasi dan state

- Validasi field: `required` dan `min(1)`.
- Cross-validation kategori: nama dinormalisasi dengan `trim().toLowerCase()` dan duplikasi dilaporkan sebagai pesan yang dapat dibaca.
- Cross-validation anggaran: total pengeluaran dibandingkan dengan pendapatan.
- Status utama: `Belum diatur`, `Aman`, `Mendekati batas`, dan `Melebihi anggaran`.
- Submit menampilkan state `Menghitung...` sementara, lalu kembali ke tombol normal.
- Empty state menyediakan aksi nyata untuk membuat kategori pertama.

### UI

- Layout satu kolom utama dengan summary sebagai orientasi cepat, lalu form sebagai area kerja.
- Palet dibatasi pada netral terang, teks gelap, dan satu aksen hijau; warna merah/kuning hanya muncul untuk state risiko yang nyata.
- Radius digunakan bertingkat, bukan semua elemen berbentuk pill.
- Shadow hanya pada panel yang perlu dipisahkan dari latar.
- Tidak ada ikon dekoratif yang tidak menambah makna; label dan angka menjadi fokus.
- Responsif untuk Chromium desktop dan iPhone 13, tanpa horizontal overflow.
- Semua tombol tetap native, memiliki label aksesibel, focus ring, hover, active, dan disabled state.

### Artefak UTS

- Use case diagram: pengguna mengatur pendapatan, mengelola kategori/item, memeriksa ringkasan, dan mereset anggaran.
- Use case description: fokus pada alur dynamic multi-input dan cross-validation, lengkap dengan precondition, main flow, alternate flow, dan postcondition.
- Sequence diagram: input pengguna, event binding template, controller, FormArray/FormControl, cross-validation, dan pembaruan UI; tanpa backend/database.
- Component and data mapping: `BudgetPlannerComponent`, template, typed form model, state getter, validator, tracking, dan UI state.
- Bukti presentasi: demo empty state, tambah kategori, tambah item, duplikasi kategori, over-budget, collapse/expand, update summary, reset, dan mobile layout.

## Batas implementasi

- Perubahan utama berada di `src/app/app.css`, `src/app/app.html`, dan `src/app/app.ts` bila diperlukan untuk menyelaraskan Angular template/controller dengan rubrik.
- E2E selector yang sudah ada harus tetap berfungsi atau diperbarui secara sengaja bersama test.
- `dist/` tetap generated output dan tidak diedit.

## Kriteria selesai

- `npm run build` berhasil.
- `npm test` berhasil.
- E2E utama BudgetKu berhasil pada desktop dan mobile dengan server port `4300`.
- Tidak ada horizontal overflow pada mobile.
- Setiap kontrol utama dapat digunakan dengan keyboard dan memiliki nama aksesibel.
- Dokumen UTS mencerminkan nama method, state, dan alur aktual dalam kode.
