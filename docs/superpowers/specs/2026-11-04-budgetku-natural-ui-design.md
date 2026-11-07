# Desain UI/UX Natural BudgetKu

## Intent

Merombak tampilan BudgetKu agar terasa seperti alat bantu pribadi yang dibuat untuk menyelesaikan satu pekerjaan, bukan dashboard atau template yang dihasilkan otomatis. Pengguna diarahkan secara alami dari pendapatan, ke kategori, ke rincian pengeluaran, lalu ke pemeriksaan kondisi anggaran.

Desain tetap sederhana, minimalis, terang, dan interaktif. Referensi gaya “Apple” diterjemahkan sebagai perhatian pada ruang, tipografi, hierarchy, dan kualitas detail, bukan penyalinan identitas atau layout Apple.

## Pengguna dan pekerjaan utama

- Pengguna ingin menyusun anggaran bulanan tanpa harus memahami struktur teknis Angular.
- Pekerjaan utama adalah menjawab: berapa pendapatan, uang dipakai untuk apa, dan apakah totalnya masih aman.
- Saat presentasi UTS, penguji harus dapat melihat bukti nested `FormArray`, dynamic multi-input, cross-validation, state, dan controller flow tanpa UI terasa seperti halaman demo teknis.

## Goals

- Mengurangi kepadatan visual dan dekorasi yang tidak membantu keputusan pengguna.
- Membuat urutan kerja terasa linear: mulai, isi, periksa, koreksi.
- Menjadikan satu tindakan utama jelas pada setiap tahap.
- Menampilkan validasi dekat input yang bermasalah.
- Mempertahankan seluruh perilaku yang sudah diuji dan selector E2E.
- Menjaga bukti rubrik tetap mudah ditemukan di template dan demo.
- Memastikan desktop dan mobile nyaman digunakan dengan keyboard dan touch.

## Non-goals

- Tidak menambah backend, database, autentikasi, routing, persistence, atau dependency.
- Tidak mengubah aplikasi menjadi CRUD.
- Tidak menambah fitur finansial yang tidak diminta seperti grafik historis, sinkronisasi rekening, atau rekomendasi otomatis.
- Tidak membuat aset visual, avatar, testimonial, klaim statistik, atau logo baru.

## Anti-goals

- Tidak memakai hero marketing, badge generik, bento grid, fake dashboard, gradient besar, glow, atau dekorasi AI.
- Tidak menampilkan semua aksi dengan bobot visual yang sama.
- Tidak menyembunyikan struktur tugas sampai penguji sulit melihat dynamic input dan validasi.
- Tidak mengganti teks yang dipakai selector E2E tanpa memperbarui test secara sengaja.

## Pendekatan yang dipilih

### Arah: Ruang kerja anggaran

Struktur layar:

```text
BudgetKu                         [status singkat]
Susun anggaran bulan ini
Isi pendapatan, lalu tambahkan kebutuhan yang ingin kamu pantau.

[Pendapatan bulan ini]           [Ringkasan anggaran]
Rp [________________]            Sisa       Rp ...
                                 Terpakai   ...%
                                 Status     Aman

Pengeluaran
Belum ada kategori               atau daftar kategori aktif
[Tambah kategori pertama]

[Kategori] [total] [Buka/Tutup] [hapus]
  Rincian pengeluaran
  item 1                         nominal
  [+ Tambah item pengeluaran]

[Reset anggaran]                [Perbarui ringkasan]
```

Pendapatan menjadi titik awal, bukan salah satu dari banyak kartu. Ringkasan membantu pengguna memeriksa hasil, tetapi tidak mengambil perhatian dari pekerjaan mengisi anggaran.

## Keputusan visual

- **Palet:** latar hangat sangat terang, permukaan putih, teks hampir hitam, abu-abu untuk metadata, satu aksen hijau untuk tindakan dan kondisi aman. Merah/kuning hanya untuk state risiko nyata.
- **Tipografi:** system sans stack agar cepat, akrab, dan tidak terasa seperti font demo. Ukuran heading cukup kuat untuk hierarchy, tetapi tidak memakai heading raksasa sebagai dekorasi.
- **Layout:** dua kolom pada desktop, satu kolom pada mobile. Kolom kerja lebih lebar, ringkasan lebih sempit. Tidak ada grid kartu statistik tiga kolom.
- **Permukaan:** panel putih dengan border tipis. Shadow hanya bila membantu memisahkan kolom ringkasan dari area kerja.
- **Radius:** panel dan input memakai radius sedang yang konsisten, tombol tidak semuanya pill.
- **Motif identitas:** garis aksen hijau dan label progres pendek yang berulang untuk memberi rasa alat kerja, bukan ornamentasi.
- **Motion:** hanya transisi kecil pada focus, hover, expand/collapse, dan progress width. Tidak ada animasi loop.

## Keputusan interaksi

- Empty state memberi satu tindakan utama, `Tambah kategori pertama`.
- Kategori yang dibuat langsung memiliki satu item pengeluaran agar nested FormArray terlihat dan pengguna tidak menemui layar kosong kedua.
- `Tutup`/`Buka` kategori menyembunyikan detail tanpa menghapus data.
- Error nama kategori muncul tepat di bawah input kategori dan tetap dirangkum di panel validasi.
- Error income dan nominal muncul dekat field masing-masing.
- Submit invalid menandai field dan tidak menampilkan state `Menghitung...`.
- Submit valid menampilkan state singkat `Menghitung...`, lalu kembali ke ringkasan normal.
- Reset meminta satu aksi langsung dan mengembalikan aplikasi ke empty state tanpa dialog tambahan.

## Kesesuaian rubrik UTS

- Dynamic Multi-Input: tombol tambah/hapus kategori dan item tetap tersedia pada area kerja.
- Nested FormArray: kategori dan item tetap ditampilkan sebagai struktur bertingkat.
- Cross-validation: duplicate category dan over-budget terlihat sebagai state nyata.
- Controller-heavy: kalkulasi, status, validator, dan tracking tetap berada di `app.ts`.
- Template branching: empty, expanded/collapsed, validation, loading, dan budget status tetap terlihat.
- Context variables dan `trackBy`: dipertahankan di loop kategori/item.
- Sequence demo: mulai dari empty state, isi income, tambah kategori, tambah item, picu validasi, reset.

## Batas implementasi

- Perubahan utama: `src/app/app.html`, `src/app/app.css`, dan bila diperlukan helper tampilan kecil di `src/app/app.ts`.
- `src/app/app.spec.ts` dan `e2e/budgetku.spec.ts` diperbarui untuk perilaku baru atau selector yang sengaja berubah.
- Artefak UTS di `docs/uts/` diperbarui hanya bila struktur interaksi atau nama state berubah.
- `dist/` tidak diedit.

## Kriteria selesai

- Alur desktop terasa sebagai satu workspace, bukan kumpulan kartu statistik.
- Mobile tidak horizontal overflow dan semua kontrol utama tetap mudah disentuh.
- Semua kontrol memiliki perilaku nyata, label aksesibel, focus state, hover/active/disabled state.
- Empty, loading, validation, safe, warning, over-budget, collapsed, dan reset state dapat didemokan.
- `npm run build` berhasil.
- `npm test` dijalankan jika Chrome Karma tersedia, atau kendala lingkungan dicatat.
- `npm run test:e2e` lulus pada Chromium desktop dan mobile.
