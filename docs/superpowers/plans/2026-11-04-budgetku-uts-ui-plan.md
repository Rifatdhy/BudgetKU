# BudgetKu UTS UI and Evidence Implementation Plan

> **Untuk agen implementasi:** gunakan sub-skill `subagent-driven-development` atau `executing-plans` untuk menjalankan rencana ini per tugas. Setiap langkah memakai checkbox untuk pelacakan.

**Goal:** Menyelaraskan aplikasi BudgetKu dengan rubrik UTS melalui cross-validation formal, template Angular yang mudah dipresentasikan, UI minimalis responsif, test tambahan, dan artefak diagram berbasis Mermaid.

**Architecture:** Pertahankan `BudgetPlannerComponent` sebagai pemilik typed reactive form dan seluruh keputusan state. Cross-validation kategori dan anggaran diekspos melalui validator Angular formal, sementara controller tetap menyediakan pesan tampilan dan helper perhitungan. UI diperhalus terutama di CSS tanpa mengubah alur atau selector E2E yang sudah bekerja.

**Tech Stack:** Angular 20, strict TypeScript, Reactive Forms, RxJS, Karma/Jasmine, Playwright, Mermaid Markdown.

**Spec:** `docs/superpowers/specs/2026-11-04-budgetku-uts-design.md`

## Global Constraints

- Tidak menambahkan backend, database, autentikasi, routing, persistence, atau dependency baru.
- Data tetap in-memory dan hilang saat halaman dimuat ulang.
- Pertahankan selector E2E dan copy UI berbahasa Indonesia kecuali perubahan sengaja disertai pembaruan test.
- Pertahankan struktur aksesibel: elemen native, label terlihat, nama ARIA bermakna, focus ring, dan kontrol keyboard.
- `dist/` adalah output generated dan tidak boleh diedit.
- Style component tetap di bawah batas Angular `anyComponentStyle` 10 kB.

## Review Focus

- Nama kategori dengan kapitalisasi/spasi berbeda harus dianggap duplikat, dengan pesan yang tetap tampil setelah perubahan input. **Test:** unit test validator dan E2E duplikasi kategori.
- Form invalid tidak boleh masuk state loading atau menghapus pesan error. **Test:** unit test `submitBudget()` dan E2E field invalid.
- Total pengeluaran tepat sama dengan pendapatan harus tetap valid, sedangkan satu rupiah di atasnya harus over-budget. **Test:** unit test status dan cross-validation.
- Kategori/item dinamis harus mempertahankan identity tracking dan tidak menyebabkan overflow setelah beberapa baris dibuat. **Test:** E2E tambah beberapa item pada proyek desktop/mobile.
- Reset harus mengembalikan income ke `0`, mengosongkan kategori, dan membersihkan pesan cross-validation. **Test:** unit test dan E2E reset.

---

### Task 1: Formalisasi cross-validation dan perilaku submit

**Files:**
- Modify: `src/app/app.ts`
- Test: `src/app/app.spec.ts`

**Interfaces:**
- Produces: validator/helper internal pada `BudgetPlannerComponent`, tanpa mengubah API template publik yang sudah dipakai E2E.

- [ ] **Step 1: Tambahkan test unit yang gagal** untuk kasus nama kategori duplikat tanpa memperhatikan kapitalisasi, total tepat sama dengan income, total melebihi income, dan submit invalid yang tidak mengaktifkan loading.
- [ ] **Step 2: Jalankan test unit terfokus** dengan `npm test -- --watch=false --include='src/app/app.spec.ts'` dan pastikan test baru gagal karena perilaku formal belum tersedia.
- [ ] **Step 3: Tambahkan `ValidatorFn` typed** pada level `categories` atau `budgetForm` untuk duplikasi kategori dan cross-validation total, lalu pertahankan `runCrossItemValidation()` sebagai sinkronisasi pesan UI dan group errors tanpa membuat pesan ganda.
- [ ] **Step 4: Ubah `submitBudget()`** agar melakukan `markAllAsTouched()`, menjalankan validasi, dan langsung kembali bila `budgetForm.invalid` atau `isOverBudget`; state `isUpdatingSummary` hanya aktif untuk submit valid.
- [ ] **Step 5: Rapikan `resetBudget()`** agar mengembalikan income ke `0`, menghapus semua category controls, dan membersihkan error/pesan tanpa reset redundan yang membingungkan typed `FormArray`.
- [ ] **Step 6: Jalankan test unit terfokus dan seluruh unit test**; hasil yang diharapkan semua PASS.

### Task 2: Perjelas bukti rubrik pada template Angular

**Files:**
- Modify: `src/app/app.html`
- Modify: `src/app/app.ts` hanya bila helper tampilan diperlukan
- Test: `src/app/app.spec.ts`, `e2e/budgetku.spec.ts`

**Interfaces:**
- Consumes: status, validator, tracking, dan helper form dari Task 1.
- Produces: template yang secara eksplisit memperlihatkan nested `FormArray`, dynamic controls, empty/loading/error/status branches, context variables, dan `trackBy`.

- [ ] **Step 1: Tambahkan assertion E2E** untuk pesan duplicate category pada field/category yang bermasalah, submit invalid tetap menampilkan validasi, dan loading hanya muncul pada submit valid.
- [ ] **Step 2: Perbarui template secara minimal** untuk menampilkan error `duplicateName` dekat nama kategori, menjaga `formArrayName`, `[formGroupName]`, `$index`/index, `$first`, `$last`, dan `trackBy` yang sudah dipakai.
- [ ] **Step 3: Pertahankan atau migrasikan branch dan loop ke `@if`/`@for` hanya jika tidak menurunkan keterbacaan atau merusak selector E2E; jangan memindahkan perhitungan kompleks ke template.
- [ ] **Step 4: Jalankan unit test dan E2E terfokus** untuk dynamic category, nested expense, duplicate validation, over-budget, collapse/expand, dan loading.

### Task 3: Terapkan visual minimalis responsif

**Files:**
- Modify: `src/app/app.css`
- Modify: `src/styles.css` hanya bila aturan global diperlukan
- Test: `e2e/budgetku.spec.ts`

**Interfaces:**
- Consumes: markup dan accessible names dari Task 2.
- Produces: visual BudgetKu dengan ENERGY 1 / RHYTHM 2 / MOTION 1, tanpa perubahan perilaku form.

- [ ] **Step 1: Tambahkan E2E mobile** yang mengisi income, membuat kategori dan beberapa item, lalu memeriksa `scrollWidth <= clientWidth` serta kontrol utama tetap terlihat.
- [ ] **Step 2: Ganti token visual component** menjadi palet netral dengan satu aksen utama, radius bertingkat, shadow terbatas, spacing berirama, dan typography yang mudah dibaca; pertahankan alasan desain di catatan dokumentasi, bukan komentar generik di CSS.
- [ ] **Step 3: Perbaiki breakpoint** untuk summary, category topline, expense row, action buttons, dan status panel agar tidak memaksa overflow pada lebar iPhone 13.
- [ ] **Step 4: Pastikan hover, active, disabled, focus-visible, pointer cursor, dan reduced-motion tetap tersedia** tanpa animasi dekoratif atau glow.
- [ ] **Step 5: Jalankan `npm run build`** dan pastikan style component tidak melewati budget 10 kB; lalu jalankan E2E desktop dan mobile.

### Task 4: Buat artefak analisis dan pemetaan implementasi

**Files:**
- Create: `docs/uts/use-case.md`
- Create: `docs/uts/use-case-diagram.md`
- Create: `docs/uts/sequence-diagram.md`
- Create: `docs/uts/component-data-mapping.md`
- Create: `docs/uts/demo-checklist.md`

**Interfaces:**
- Consumes: method, state, form model, template flow, dan selector aktual dari Task 1-3.
- Produces: sumber Mermaid/Markdown yang menjelaskan implementasi aktual dan urutan demo.

- [ ] **Step 1: Tulis use case dan diagram Mermaid** dengan aktor Pengguna dan use case mengatur income, menambah/menghapus kategori, menambah/menghapus item, melihat ringkasan, validasi, dan reset.
- [ ] **Step 2: Tulis use case description** untuk alur dynamic multi-input, termasuk precondition, main flow, alternate flow duplicate category/over-budget/invalid input, dan postcondition.
- [ ] **Step 3: Tulis sequence diagram Mermaid** dari input/event binding ke `BudgetPlannerComponent`, FormControl/FormArray, validator, status getter, dan pembaruan template; nyatakan tidak ada backend/database.
- [ ] **Step 4: Tulis component/data mapping** yang memetakan `BudgetPlannerComponent`, `budgetForm`, `CategoryGroup`, `ExpenseGroup`, validator, getter status, `trackBy`, dan UI branches ke bagian kode aktual.
- [ ] **Step 5: Tulis demo checklist** sesuai alur presentasi rubrik: empty state, income, category, expense, add/remove, duplicate, over-budget, collapse/expand, update summary, reset, dan mobile.
- [ ] **Step 6: Periksa semua nama method/state terhadap source** dan hapus klaim yang tidak dapat diverifikasi dari kode.

### Task 5: Verifikasi lintas lapisan

**Files:**
- Verify: semua file yang berubah pada Task 1-4

- [ ] **Step 1: Jalankan `npm run build`** dan catat hasil exit code serta budget style.
- [ ] **Step 2: Jalankan `npm test -- --watch=false`** dan pastikan seluruh unit test PASS.
- [ ] **Step 3: Jalankan server dengan `npm start -- --port 4300`** pada proses terpisah.
- [ ] **Step 4: Jalankan `npm run test:e2e`** pada project Chromium desktop dan mobile, lalu periksa hasil test serta console error.
- [ ] **Step 5: Review manual keyboard** untuk income, tambah kategori, input kategori/item, toggle kategori, hapus, reset, dan submit; pastikan focus terlihat dan semua aksi bekerja.
- [ ] **Step 6: Jalankan `git diff --check`** dan tinjau diff untuk memastikan tidak ada perubahan `dist/`, dependency baru, dead control, atau klaim dokumentasi yang tidak sesuai implementasi.
