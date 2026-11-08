# Checklist Demo Presentasi

1. Buka aplikasi dan tunjukkan empty state `Belum ada kategori`, ringkasan `Belum diatur`, dan status `?` yang netral.
2. Isi `Pendapatan bulanan` dengan `5.000.000` dan tunjukkan format ribuan otomatis.
3. Tambahkan kategori pertama dan tunjukkan nested item pengeluaran.
4. Isi kategori `Kebutuhan Rumah`, item `Listrik`, nominal `500.000`.
5. Tambahkan item kedua, isi `Air`, nominal `200.000`, lalu tunjukkan total kategori `700.000` di area kerja.
6. Tunjukkan bahwa panel ringkasan masih menampilkan kondisi terakhir sebelum konfirmasi.
7. Klik `Perbarui ringkasan` dan tunjukkan total pengeluaran `700.000`, sisa `4.300.000`, progress, dan status `Aman`.
8. Ubah pendapatan atau nominal tanpa menekan tombol dan tunjukkan bahwa angka ringkasan tetap memakai snapshot terakhir.
9. Klik `Perbarui ringkasan` lagi dan tunjukkan ringkasan berubah ke nilai baru.
10. Klik `Tutup Kebutuhan Rumah`, lalu `Lihat detail Kebutuhan Rumah`.
11. Tambahkan kategori kedua dengan nama `kebutuhan rumah` dan tunjukkan pesan duplikat tanpa memperhatikan kapitalisasi.
12. Hapus kategori kedua untuk menghilangkan error.
13. Tambahkan kategori ketiga, lalu hapus kategori tengah dan tunjukkan indeks kategori lain tetap benar.
14. Di dalam satu kategori, tambahkan item dengan nama yang sama dan tunjukkan pesan duplikat item.
15. Ubah pendapatan menjadi `100.000` atau isi pengeluaran lebih besar, lalu tunjukkan status draf `Melebihi anggaran` dan pesan validasi tanpa mengganti snapshot ringkasan.
16. Klik `Perbarui ringkasan` pada kondisi invalid dan tunjukkan error tanpa state loading yang salah.
17. Tambahkan kategori sampai batas `10`, lalu tunjukkan pesan `Maksimal 10 kategori diperbolehkan.`
18. Klik `Reset anggaran` dan tunjukkan form kembali kosong serta ringkasan kembali ke kondisi awal.
19. Ulangi pemeriksaan pada viewport mobile dan pastikan tidak ada horizontal overflow serta target sentuh tetap nyaman.
