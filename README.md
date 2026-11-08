# BudgetKu

Aplikasi perencana anggaran bulanan berbasis Angular untuk tugas UTS Framework Based Programming. Pengguna mengisi pendapatan, menyusun kategori pengeluaran, lalu menambahkan item di dalam setiap kategori.

Fokus aplikasi ada pada View dan Controller: nested `FormArray`, dynamic multi-input, cross-validation, perhitungan anggaran, template branching, context variable, `trackBy`, dan UI state. Tidak ada backend, database, login, atau penyimpanan permanen. Data hanya bertahan selama halaman terbuka.

## Stack

- Angular 20 dengan standalone component
- Typed reactive forms (`FormGroup`, `FormArray`, `FormControl`)
- TypeScript strict dan `strictTemplates`
- Karma dan Jasmine untuk unit test
- Playwright untuk E2E desktop Chromium dan iPhone 13 mobile

## Menjalankan aplikasi

```bash
npm ci
npm start
```

Buka `http://localhost:4200/`.

## Build

```bash
npm run build
```

Hasil build berada di `dist/budgetku` dan tidak boleh diedit sebagai source.

## Unit test

```bash
npm test -- --watch=false
```

Angular Karma memakai Chrome yang terpasang di sistem. Jika Chrome tidak tersedia, arahkan `CHROME_BIN` ke browser Chromium yang kompatibel. Contoh di Windows dengan Chromium bawaan Playwright:

```powershell
$env:CHROME_BIN="$env:LOCALAPPDATA\ms-playwright\chromium_headless_shell-1254\chrome-headless-shell-win64\chrome-headless-shell.exe"
npm test -- --watch=false --browsers=ChromeHeadless
```

## E2E test

Playwright memakai `http://127.0.0.1:4300` dan tidak menyalakan server otomatis. Jalankan server terpisah lebih dulu:

```bash
npm start -- --host 127.0.0.1 --port 4300
```

Lalu di terminal lain:

```bash
npm run test:e2e
```

Gunakan `npx playwright test --workers=1` jika ingin menghindari flake artefak trace saat beberapa worker berjalan bersamaan.

## Perilaku ringkasan

- Input form dan validasi memberi feedback langsung.
- Panel `Ringkasan anggaran` memakai snapshot `confirmedIncome` dan `confirmedExpenses`.
- Snapshot hanya diperbarui oleh `submitBudget()` ketika form valid dan tidak over-budget.
- Submit invalid atau over-budget mempertahankan snapshot sebelumnya.
- Kondisi over-budget tetap terlihat sebagai status draf di panel validasi.
- `resetBudget()` mengembalikan form dan snapshot ke kondisi awal.

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
