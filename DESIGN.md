# Arah Desain BudgetKu

Dokumen ini mencatat arah visual dan alasan keputusan desain. Filter antislop dipakai di atas arah ini, bukan sebagai pengganti arah.

## Design read

BudgetKu adalah ruang kerja anggaran satu layar untuk satu pengguna yang menyusun rencana bulanan. Bahasa visualnya tenang, editorial, dan utilitarian. Dial yang dipakai: **ENERGY 1 / RHYTHM 2 / MOTION 1**.

- **ENERGY 1**: aplikasi kerja, bukan halaman pemasaran. Tidak ada animasi masuk, parallax, atau dekorasi yang bersaing dengan angka.
- **RHYTHM 2**: susunan utama stabil, tetapi area pendapatan, area kategori, dan panel ringkasan punya bentuk yang berbeda sesuai perannya.
- **MOTION 1**: hanya transisi hover, focus, dan progress. Semua gerak berhenti saat `prefers-reduced-motion: reduce`.

## Identitas

- **Palet**: permukaan putih dan abu-abu netral untuk pemindaian angka, hijau `#007a4d` sebagai satu aksen untuk tindakan dan kondisi aman, merah `#b42318` hanya untuk kesalahan. Tidak ada gradient, glassmorphism, glow, atau orb.
- **Tipografi**: system font stack agar teks langsung tampil tanpa memblokir render font eksternal. H1 besar dan rapat menjadi penanda identitas, sedangkan teks kerja memakai ukuran kecil dengan kontras minimal 4.5:1.
- **Layout**: pendapatan menjadi titik awal, kategori menjadi area kerja utama, ringkasan menjadi pendamping yang menempel di desktop. Di tablet ringkasan naik ke atas agar kondisi anggaran terlihat lebih dulu. Di mobile semua menjadi satu kolom.
- **Radius**: 9 sampai 16 piksel. Radius dipakai untuk memisahkan input, kartu, dan panel, bukan untuk membuat semua elemen berbentuk pil.
- **Elevation**: tidak ada shadow dekoratif. Pemisahan memakai border tipis dan ruang. Shadow hanya muncul sebagai cincin fokus.
- **Ikon**: hanya glyph yang membawa aksi atau status, misalnya `+` untuk menambah, `×` untuk menghapus, dan `?`/`✓`/`!` untuk status. Tidak ada ikon dekoratif atau status dot tanpa makna.
- **Tema**: hanya mode terang. Aplikasi ini dipakai untuk memasukkan dan membandingkan angka dalam waktu singkat; permukaan terang dengan kontras tinggi lebih mudah dipindai. Tidak ada toggle tema yang setengah jadi.
- **Copy**: bahasa Indonesia langsung, tanpa buzzword. Label tombol menyebut aksi yang terjadi, misalnya `Perbarui ringkasan` dan `Tambah item pengeluaran`, bukan `Mulai` atau `Lanjutkan`.

## Alasan keputusan utama

| Keputusan | Alasan |
| --- | --- |
| Hijau sebagai satu aksen | Uang aman dan tindakan utama butuh satu penanda yang konsisten; merah disisakan untuk kesalahan. |
| Ringkasan memakai snapshot | Angka ringkasan harus stabil dan hanya berubah saat pengguna mengonfirmasi, sehingga tombol `Perbarui ringkasan` punya makna. |
| Progress kategori memakai nilai form langsung | Area kerja perlu feedback segera saat nominal diubah; panel ringkasan tetap stabil. |
| Tanpa shadow di kartu | Border dan ruang sudah cukup memisahkan kelompok data; shadow di semua kartu akan menghapus hierarki. |
| Status dot dihapus | Dot hijau sebelumnya tidak menandai state nyata dan bisa menyesatkan saat anggaran belum diatur. |
| Ikon `?` saat belum diatur | Status `Belum diatur` tidak boleh memakai tanda centang yang menyiratkan kondisi aman. |
| Mode terang saja | Aplikasi ini alat kerja cepat dengan angka; mode gelap tidak memberi manfaat yang sebanding dengan biaya verifikasi kontras di dua tema. |
