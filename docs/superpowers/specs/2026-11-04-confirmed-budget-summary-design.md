# Desain Ringkasan Anggaran Berbasis Konfirmasi

## Intent

Tombol `Perbarui ringkasan` menjadi aksi yang bermakna: perubahan form tidak langsung mengubah panel ringkasan. Ringkasan hanya menampilkan data terbaru setelah pengguna mengklik tombol dan form valid.

## Perilaku

- Form pendapatan, kategori, dan nominal tetap dapat berubah seperti biasa.
- Validasi input dan pesan error tetap mengikuti nilai form saat ini.
- Panel ringkasan memakai snapshot nilai terakhir yang berhasil dikonfirmasi.
- Submit invalid tidak mengubah snapshot.
- Submit valid memperbarui snapshot, menampilkan state `Menghitung...` singkat, lalu menampilkan hasil baru.
- Reset mengosongkan form dan mengembalikan snapshot ke kondisi awal.

## Pendekatan dan keputusan

- **Snapshot di controller (dipilih):** menyimpan income dan total pengeluaran terakhir yang dikonfirmasi. Ringkas, cocok dengan controller-heavy Angular saat ini, dan tidak mengubah struktur `FormArray`.
- **Mengunci form sampai submit:** ditolak karena mengurangi interaksi dan membuat validasi/editing lebih kaku.
- **Menghitung hanya di template setelah flag submit:** ditolak karena state ringkasan akan tersebar di template dan lebih sulit diuji.

## Batasan

- Tidak mengubah format angka, validasi, atau struktur form.
- Tidak menambah dependency atau persistence.
- Accessible names dan selector E2E yang sudah ada dipertahankan.

## Kriteria selesai

- Perubahan form tidak mengubah angka ringkasan sebelum tombol diklik.
- Submit valid memperbarui seluruh detail ringkasan dan status.
- Submit invalid mempertahankan snapshot sebelumnya.
- Reset mengembalikan ringkasan awal.
- Test E2E dan build lulus.
