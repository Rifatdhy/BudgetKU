# BudgetKu

Aplikasi perencana anggaran bulanan berbasis Angular untuk tugas UTS Framework Based Programming. Pengguna mengisi pendapatan, menyusun kategori pengeluaran, lalu menambahkan item di dalam setiap kategori.

Fokus aplikasi ada pada View dan Controller: nested `FormArray`, dynamic multi-input, cross-validation, perhitungan anggaran, template branching, context variable, `trackBy`, dan UI state. Tidak ada backend, database, login, atau penyimpanan permanen. Data hanya bertahan selama halaman terbuka.

## Stack

- Angular 20 dengan standalone component
- Typed reactive forms (`FormGroup`, `FormArray`, `FormControl`)
- TypeScript strict dan `strictTemplates`
- Karma dan Jasmine untuk unit test
- Playwright untuk E2E desktop Chromium dan iPhone 13 mobile

## Daftar isi

- [Fitur](#fitur)
- [Prasyarat](#prasyarat)
- [Menjalankan aplikasi](#menjalankan-aplikasi)
- [Cara memakai BudgetKu](#cara-memakai-budgetku)
- [Contoh penggunaan interaktif](#contoh-penggunaan-interaktif)
- [Aturan validasi](#aturan-validasi)
- [Cara kerja ringkasan](#cara-kerja-ringkasan)
- [Aksesibilitas dan responsivitas](#aksesibilitas-dan-responsivitas)
- [Test dan build](#test-dan-build)
- [Struktur project](#struktur-project)
- [Troubleshooting](#troubleshooting)

## Fitur

- Pendapatan dan nominal otomatis memakai format Rupiah Indonesia.
- Maksimal 10 kategori pengeluaran dengan item dinamis di dalamnya.
- Total kategori dan progress pemakaian yang diperbarui saat form diketik.
- Ringkasan sisa anggaran, pendapatan, pengeluaran, status, dan progress.
- Status `Belum diatur`, `Aman`, `Mendekati batas`, atau `Melebihi anggaran`.
- Validasi nama kategori dan item duplikat tanpa membedakan kapitalisasi atau spasi luar.
- Submit ditolak saat form invalid atau pengeluaran melebihi pendapatan.
- Dialog konfirmasi reset dengan dukungan tombol `Escape`.
- Live feedback setelah reset dan fokus kembali ke input pendapatan.
- Skip link, label input, ARIA state, focus ring, dan layout mobile tanpa overflow.

## Prasyarat

- Node.js dan npm yang kompatibel dengan Angular 20.
- Browser Chromium untuk Playwright.
- Chrome atau Chromium untuk Karma headless.

Versi dependency yang dipakai tercatat di `package.json` dan `package-lock.json`. Gunakan `npm ci` agar instalasi mengikuti lockfile.

## Menjalankan aplikasi

```bash
npm ci
npm start
```

Buka `http://localhost:4200/`.

### Menjalankan di background

Di PowerShell, jalankan:

```powershell
Start-Process npm -ArgumentList 'start','--','--port','4300' -WorkingDirectory (Get-Location)
```

Buka `http://localhost:4300/`. Jika muncul pesan `Port 4300 is already in use`, server pada port tersebut sudah berjalan.

## Cara memakai BudgetKu

1. Isi **Pendapatan bulanan**, misalnya `5000000`. Aplikasi menampilkan `5.000.000`.
2. Klik **Tambah kategori pertama**, lalu isi **Nama kategori**, misalnya `Kebutuhan Rumah`.
3. Isi item pertama, misalnya nama `Listrik` dan nominal `500000`.
4. Klik **Tambah item pengeluaran** untuk menambah `Air`, `Internet`, atau item lain.
5. Periksa total kategori dan progress yang diperbarui langsung.
6. Klik **Perbarui ringkasan** setelah semua data valid. Tombol sementara menampilkan `Menghitung…`.
7. Gunakan **Lihat detail** atau **Tutup detail** untuk mengatur kepadatan kartu kategori.
8. Untuk menghapus semua data, klik **Reset anggaran**, lalu pilih **Batal** atau **Hapus semua data**.

### Contoh penggunaan interaktif

| Urutan | Aksi | Hasil |
| ---: | --- | --- |
| 1 | Isi pendapatan `5000000` | Field menjadi `5.000.000` |
| 2 | Tambah kategori pertama | Kartu kategori dan satu item muncul |
| 3 | Isi `Kebutuhan Rumah`, `Listrik`, `500000` | Total kategori menjadi `Rp 500.000` |
| 4 | Tambah item `Air`, `200000` | Total kategori menjadi `Rp 700.000` |
| 5 | Perbarui ringkasan | Sisa anggaran menjadi `Rp 4.300.000` |
| 6 | Tambah kategori `kebutuhan rumah` | Validasi duplikat muncul |
| 7 | Hapus kategori kedua | Validasi duplikat hilang |
| 8 | Buka reset lalu pilih `Batal` | Data tetap ada |
| 9 | Konfirmasi reset | Form kembali ke kondisi awal |

## Aturan validasi

- Pendapatan harus lebih besar dari `0`.
- Nama kategori dan nama item wajib diisi.
- Nama kategori tidak boleh duplikat.
- Nama item tidak boleh duplikat dalam kategori yang sama.
- Nominal harus lebih besar dari `0`.
- Total pengeluaran tidak boleh melebihi pendapatan.
- Maksimal 10 kategori.
- Minimal satu item dipertahankan pada setiap kategori.

Validasi nama mengabaikan spasi di awal atau akhir dan perbedaan huruf besar-kecil. `Rumah`, ` rumah `, dan `RUMAH` dianggap sama.

## Cara kerja ringkasan

BudgetKu membedakan data draf dan data yang sudah dikonfirmasi:

```text
Form yang sedang diketik
  ├─ total kategori, progress, dan validasi diperbarui langsung
  └─ klik Perbarui ringkasan
       ├─ valid dan tidak over-budget: snapshot ringkasan diperbarui
       └─ invalid atau over-budget: snapshot lama dipertahankan
```

`confirmedIncome` dan `confirmedExpenses` menjadi snapshot yang dikirim ke `SummaryPanelComponent`. Karena itu, mengubah field setelah submit tidak langsung mengubah panel ringkasan sampai pengguna mengonfirmasi lagi.

## Aksesibilitas dan responsivitas

- Skip link **Lewati ke formulir anggaran** dapat dipakai dengan keyboard.
- Semua field memiliki label yang terlihat dan metadata `name`.
- Tombol dinamis memiliki nama ARIA seperti `Hapus kategori 2`.
- Toggle detail memakai `aria-expanded` dan `aria-controls`.
- Progress memakai `role="progressbar"` dan nilai ARIA.
- Pesan validasi memakai `role="alert"`.
- Reset diumumkan melalui live region dan fokus dikembalikan ke pendapatan.
- Desktop memakai area kerja dan panel ringkasan berdampingan; mobile menjadi satu kolom.

Untuk mencoba keyboard navigation, tekan `Tab` dari awal halaman, aktivasi skip link dengan `Enter`, buka dialog reset, lalu tutup dengan `Escape`.

## Test dan build

### Production build

```bash
npm run build
```

Hasilnya berada di `dist/budgetku`. Folder `dist/` adalah output generate dan tidak diedit sebagai source.

### Unit test

```bash
npm test -- --watch=false
```

Angular Karma memakai Chrome yang terpasang di sistem. Jika Chrome tidak tersedia, arahkan `CHROME_BIN` ke browser Chromium yang kompatibel. Contoh di Windows dengan Chromium bawaan Playwright:

```powershell
$env:CHROME_BIN="$env:LOCALAPPDATA\ms-playwright\chromium_headless_shell-1254\chrome-headless-shell-win64\chrome-headless-shell.exe"
npm test -- --watch=false --browsers=ChromeHeadless
```

### E2E test

Playwright memakai `http://localhost:4300` dan tidak menyalakan server otomatis. Jalankan server terpisah lebih dulu:

```bash
npm start -- --port 4300
```

Lalu di terminal lain:

```bash
npm run test:e2e
```

Gunakan `npx playwright test --workers=1` jika ingin menghindari flake artefak trace saat beberapa worker berjalan bersamaan.

Perintah berguna lainnya:

```bash
npx playwright test --project=mobile
npx playwright test --project=chromium
npx playwright test e2e/budgetku.spec.ts:147
npx playwright test --ui
```

## Troubleshooting

### `ERR_CONNECTION_REFUSED` saat E2E

Pastikan server berjalan pada port 4300 dan halaman ini dapat dibuka:

```text
http://localhost:4300/
```

### ChromeHeadless tidak ditemukan

Karma memerlukan Chrome atau Chromium. Jika Chrome tidak berada di lokasi default, arahkan `CHROME_BIN` ke executable yang tersedia. Contoh PowerShell:

```powershell
$env:CHROME_BIN="$env:LOCALAPPDATA\ms-playwright\chromium_headless_shell-1254\chrome-headless-shell-win64\chrome-headless-shell.exe"
npm test -- --watch=false --browsers=ChromeHeadless
```

### Port sudah digunakan

Gunakan port lain untuk development biasa:

```bash
npm start -- --port 4400
```

Untuk E2E, gunakan port 4300 sesuai `playwright.config.ts`.

### Data hilang setelah reload

Ini perilaku yang disengaja. Data disimpan di reactive form dalam memori dan belum memakai backend, database, atau local storage.

## Dokumentasi UTS

- `file.md`: brief proyek dan pemetaan rubrik.
- `docs/uts/use-case.md`: aktor, daftar use case, dan use case description.
- `docs/uts/use-case-diagram.md`: sumber diagram use case, tersedia juga sebagai `.png` dan `.pdf`.
- `docs/uts/sequence-diagram.md`: sequence diagram View dan Controller, tersedia juga sebagai `.png` dan `.pdf`.
- `docs/uts/component-data-mapping.md`: component tree, pemetaan `@Input`/`@Output`, data mapping, dan pemetaan elemen View.
- `docs/uts/component-architecture.md`: sumber diagram arsitektur komponen, tersedia juga sebagai `.png` dan `.pdf`.
- `docs/uts/demo-checklist.md`: urutan demo presentasi.
- `docs/uts/laporan.md`: laporan UTS lengkap, tersedia juga sebagai `laporan.pdf`.
- `docs/uts/laporan-outline.md`: catatan bahwa laporan lengkap sudah menggantikan kerangka awal.
- `DESIGN.md`: arah desain, dial, dan alasan keputusan visual.

## Struktur source

```text
src/
├── main.ts
├── index.html
├── styles.css
└── app/
    ├── app.ts
    ├── app.html
    ├── app.css
    ├── app.spec.ts
    └── app.config.ts
e2e/
└── budgetku.spec.ts
```
