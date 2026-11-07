# BudgetKu Natural UI/UX Implementation Plan

> **Untuk agen implementasi:** gunakan sub-skill `subagent-driven-development` atau `executing-plans` untuk menjalankan rencana ini per tugas. Setiap langkah memakai checkbox untuk pelacakan.

**Goal:** Merombak UI/UX BudgetKu menjadi ruang kerja anggaran yang natural, simpel, minimalis, interaktif, dan tetap membuktikan seluruh ketentuan UTS.

**Architecture:** Pertahankan `BudgetPlannerComponent` sebagai pemilik typed reactive form, validator, status, dan event handler. Ubah struktur template menjadi header sederhana, area kerja pendapatan/pengeluaran, serta ringkasan yang mengikuti alur kerja; ubah CSS secara menyeluruh untuk hierarchy dan responsive layout tanpa dependency baru. Selector aksesibilitas yang sudah dipakai E2E dipertahankan.

**Tech Stack:** Angular 20, strict TypeScript, Reactive Forms, CSS, Karma/Jasmine, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-04-budgetku-natural-ui-design.md`

## Global Constraints

- Tidak menambah backend, database, autentikasi, routing, persistence, atau dependency.
- Data tetap in-memory dan hilang saat halaman dimuat ulang.
- Pertahankan nested `FormArray`, dynamic multi-input, cross-validation, controller-heavy logic, branching, context variables, dan `trackBy`.
- Semua copy UI dan accessible name tetap berbahasa Indonesia.
- Semua kontrol harus punya perilaku nyata, native semantics, label, focus, hover, active, disabled, dan ukuran touch yang memadai.
- Tidak memakai hero marketing, bento grid, fake dashboard, gradient besar, glow, badge generik, atau dekorasi AI.
- `dist/` tidak diedit.

## Review Focus

- Pengguna baru harus dapat menemukan satu tindakan awal tanpa membaca seluruh halaman. **Test:** E2E empty state melihat tombol `Tambah kategori pertama` dan dapat memulai alur.
- Setelah kategori dibuat, nested expense input harus langsung terlihat dan usable. **Test:** E2E tambah kategori, isi nama, isi item dan nominal.
- Pada mobile setelah beberapa item ditambahkan, semua field dan aksi harus tetap berada dalam viewport. **Test:** E2E mobile menambah baris lalu memeriksa `scrollWidth <= clientWidth`.
- Error duplicate dan over-budget harus dekat dengan sumber masalah serta tetap terwakili pada panel validasi. **Test:** E2E duplicate category dan over-budget.
- Submit invalid harus memberi feedback tanpa state loading palsu, sementara submit valid tetap menampilkan loading singkat. **Test:** unit/E2E untuk kedua jalur submit.

---

### Task 1: Kunci perilaku UI yang dipertahankan

**Files:**
- Modify: `src/app/app.spec.ts`
- Modify: `e2e/budgetku.spec.ts`

**Interfaces:**
- Consumes: API dan accessible names dari `BudgetPlannerComponent` saat ini.
- Produces: assertions yang melindungi alur UTS sebelum template dirombak.

- [ ] **Step 1: Tambahkan test E2E empty-to-first-category** yang memastikan empty state menampilkan satu aksi utama, kategori baru muncul, dan `Nama pengeluaran` langsung tersedia.
- [ ] **Step 2: Tambahkan test E2E desktop/mobile** yang membuat kategori dengan dua item dan memeriksa summary, `trackBy`-compatible rows, serta tidak ada horizontal overflow.
- [ ] **Step 3: Tambahkan test E2E** untuk duplicate category, over-budget, collapse/expand, reset, dan submit invalid tanpa `Menghitung...`.
- [ ] **Step 4: Jalankan `npm run test:e2e`** sebelum template diubah; semua test yang ada harus PASS sebagai baseline perilaku.

### Task 2: Rombak struktur template menjadi workspace natural

**Files:**
- Modify: `src/app/app.html`
- Modify: `src/app/app.ts` hanya bila helper teks status diperlukan

**Interfaces:**
- Consumes: getter, event handler, typed form, validator, context variables, dan `trackBy` dari controller.
- Produces: struktur `page-shell` baru dengan header sederhana, workspace pendapatan/pengeluaran, summary panel, empty state, category card, state panel, dan form actions.

- [ ] **Step 1: Pertahankan accessible names yang digunakan test** untuk `Pendapatan bulanan`, `Tambah kategori pertama`, `Nama kategori`, `Nama pengeluaran`, `Nominal`, `Tutup/Buka`, `Reset anggaran`, dan `Perbarui ringkasan`.
- [ ] **Step 2: Susun ulang markup** agar income menjadi titik awal, summary menjadi panel pendamping, dan pengeluaran menjadi area kerja utama; hilangkan elemen dekoratif yang tidak menambah informasi.
- [ ] **Step 3: Pertahankan nested `formArrayName`/`formGroupName`, `$index`/`first`/`last`, `trackByCategory`, `trackByExpense`, empty branch, collapsed branch, validation branch, loading branch, dan status branch.
- [ ] **Step 4: Tambahkan `aria-describedby` pada field yang memiliki pesan error dinamis** dan pastikan id error unik untuk income, kategori, dan item.
- [ ] **Step 5: Jalankan `npx tsc -p tsconfig.app.json --noEmit`**; template harus lulus strict template checking.

### Task 3: Terapkan sistem visual natural dan responsive

**Files:**
- Modify: `src/app/app.css`
- Modify: `src/styles.css` bila token global focus/reduced-motion perlu diselaraskan

**Interfaces:**
- Consumes: struktur dan class dari Task 2.
- Produces: layout workspace desktop/mobile dengan visual minimalis, focus state konsisten, dan motion terbatas pada feedback interaksi.

- [ ] **Step 1: Buat layout desktop dua kolom**: area kerja lebih lebar dan summary lebih sempit, tanpa tiga kartu statistik seragam.
- [ ] **Step 2: Buat layout mobile satu kolom** dengan urutan income, summary, pengeluaran, status, dan actions; pastikan tidak ada horizontal overflow.
- [ ] **Step 3: Terapkan token visual** untuk latar hangat terang, permukaan putih, teks gelap, metadata abu-abu, aksen hijau, serta merah/kuning hanya untuk risiko.
- [ ] **Step 4: Terapkan hierarchy** pada heading, input, total kategori, status, progress, dan tombol utama; gunakan radius sedang dan shadow terbatas.
- [ ] **Step 5: Terapkan focus-visible, hover, active, disabled, reduced-motion, cursor, dan tap target minimal 44px** tanpa animasi loop.
- [ ] **Step 6: Jalankan `npm run build`** dan pastikan batas style component 10 kB tidak terlampaui.

### Task 4: Selaraskan dokumentasi UTS dengan UI baru

**Files:**
- Modify: `docs/uts/demo-checklist.md`
- Modify: `docs/uts/component-data-mapping.md`
- Modify: `docs/uts/use-case.md` bila istilah alur berubah

**Interfaces:**
- Consumes: template final dan E2E dari Task 2-3.
- Produces: urutan demo dan mapping yang menjelaskan workspace natural tanpa mengklaim fitur yang tidak ada.

- [ ] **Step 1: Perbarui demo checklist** agar mengikuti alur empty state, income, kategori, item, validation, summary, collapse/expand, reset, dan mobile.
- [ ] **Step 2: Perbarui component/data mapping** jika class atau struktur template berubah, tetapi pertahankan bukti typed `FormGroup`/`FormArray` dan controller methods aktual.
- [ ] **Step 3: Periksa semua nama method, state, dan selector terhadap source** lalu hapus klaim yang tidak dapat diverifikasi.

### Task 5: Verifikasi akhir dan review UI

**Files:**
- Verify: semua file pada Task 1-4

- [ ] **Step 1: Jalankan `npm run build`** dan catat hasilnya.
- [ ] **Step 2: Jalankan `npx tsc -p tsconfig.app.json --noEmit`** dan catat hasilnya.
- [ ] **Step 3: Jalankan `npm test -- --watch=false`**; jika Chrome Karma tidak tersedia, catat kendala lingkungan secara eksplisit.
- [ ] **Step 4: Jalankan server pada `127.0.0.1:4300` dan `npm run test:e2e`**; semua project desktop/mobile harus PASS.
- [ ] **Step 5: Lakukan review keyboard** untuk income, tambah kategori/item, toggle, hapus, reset, dan submit; pastikan focus terlihat dan aksi nyata.
- [ ] **Step 6: Jalankan `git diff --check`** dan periksa tidak ada perubahan `dist/`, dependency, dead control, atau klaim dokumentasi palsu.
