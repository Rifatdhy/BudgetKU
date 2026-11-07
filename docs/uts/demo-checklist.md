# Checklist Demo Presentasi

1. Buka aplikasi dan tunjukkan empty state `Belum ada kategori`.
2. Isi `Pendapatan bulanan` dengan `5.000.000`.
3. Tambahkan kategori pertama dan tunjukkan nested item pengeluaran.
4. Isi kategori `Kebutuhan Rumah`, item `Listrik`, nominal `500.000`.
5. Tambahkan item kedua, isi `Air`, nominal `200.000`, klik `Perbarui ringkasan`, lalu tunjukkan total `700.000` dan sisa `4.300.000`.
6. Ubah pendapatan atau nominal tanpa menekan tombol dan tunjukkan bahwa panel ringkasan masih memakai hasil konfirmasi terakhir. Klik `Perbarui ringkasan` dan tunjukkan hasil baru.
7. Klik `Tutup Kebutuhan Rumah`, lalu `Lihat detail Kebutuhan Rumah`.
8. Tambahkan kategori kedua dengan nama `kebutuhan rumah` dan tunjukkan pesan duplikat tanpa memperhatikan kapitalisasi.
9. Hapus kategori kedua untuk menghilangkan error.
10. Ubah pendapatan menjadi `100.000` atau isi pengeluaran lebih besar, lalu tunjukkan validasi `Melebihi anggaran` tanpa mengganti snapshot ringkasan yang valid.
11. Klik `Perbarui ringkasan` pada kondisi invalid dan tunjukkan error tanpa state loading yang salah.
12. Klik `Reset anggaran` dan tunjukkan form kembali kosong serta ringkasan kembali ke kondisi awal.
13. Ulangi pemeriksaan pada viewport mobile dan pastikan tidak ada horizontal overflow.
