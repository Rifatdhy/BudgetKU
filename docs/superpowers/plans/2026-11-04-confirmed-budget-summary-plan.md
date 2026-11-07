# Confirmed Budget Summary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Membuat panel ringkasan hanya berubah setelah pengguna mengklik `Perbarui ringkasan` dan form valid.

**Architecture:** `BudgetPlannerComponent` menyimpan snapshot angka pendapatan dan pengeluaran terakhir yang dikonfirmasi. Getter ringkasan membaca snapshot tersebut, sedangkan validator tetap membaca nilai form terbaru. Submit valid memperbarui snapshot; submit invalid dan perubahan biasa tidak mengubahnya.

**Tech Stack:** Angular Reactive Forms, strict TypeScript, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-04-confirmed-budget-summary-design.md`

## Global Constraints

- Pertahankan nested `FormArray`, validasi, format angka, dan accessible names.
- Form tetap dapat diedit sebelum konfirmasi.
- Validasi tetap membaca data form terkini.
- Tidak menambah dependency atau persistence.
- Copy UI tetap berbahasa Indonesia.

## Review Focus

- Perubahan income setelah konfirmasi tidak mengubah summary sebelum submit — test E2E snapshot income.
- Perubahan expense setelah konfirmasi tidak mengubah summary sebelum submit — test E2E snapshot expense.
- Submit invalid tidak mengganti snapshot — test E2E duplicate/invalid submit.
- Submit valid mengganti snapshot dan status — test E2E valid submit.
- Reset mengembalikan snapshot awal — test E2E reset.

---

### Task 1: Tambahkan regression test untuk snapshot ringkasan

**Files:**
- Modify: `e2e/budgetku.spec.ts`

**Interfaces:**
- Consumes: accessible names `Pendapatan bulanan`, `Nominal`, dan `Perbarui ringkasan`.
- Produces: test yang mengunci ringkasan stale sebelum submit dan updated setelah submit.

- [ ] **Step 1: Tambahkan test** yang mengisi income dan expense, klik `Perbarui ringkasan`, mengubah income/expense, lalu memastikan summary masih memakai nilai lama.
- [ ] **Step 2: Tambahkan assertion** bahwa setelah klik `Perbarui ringkasan` kedua kali, summary menampilkan nilai baru.
- [ ] **Step 3: Jalankan test baru** dan pastikan test gagal karena getter saat ini masih membaca form secara real-time.

### Task 2: Implementasikan snapshot terkonfirmasi di controller

**Files:**
- Modify: `src/app/app.ts`

**Interfaces:**
- Consumes: `budgetForm`, `totalExpenses`, `submitBudget()`, dan `resetBudget()`.
- Produces: getter ringkasan berbasis snapshot serta submit/reset yang memperbarui atau menghapus snapshot.

- [ ] **Step 1: Tambahkan state private** untuk income dan total pengeluaran terkonfirmasi, diinisialisasi `0`.
- [ ] **Step 2: Ubah getter ringkasan** seperti `remainingBudget`, `budgetUsagePercent`, `isOverBudget`, dan `budgetStatus` agar memakai snapshot; jangan mengubah validator yang memakai form.
- [ ] **Step 3: Pada `submitBudget()` valid**, salin `incomeControl.value` dan `totalExpenses` ke snapshot sebelum state loading dimulai.
- [ ] **Step 4: Pada `resetBudget()`**, kembalikan snapshot ke `0`.
- [ ] **Step 5: Jalankan test baru** dan pastikan lulus.

### Task 3: Verifikasi regresi penuh

**Files:**
- Verify: `src/app/app.ts`, `src/app/app.html`, `e2e/budgetku.spec.ts`

- [ ] **Step 1: Jalankan `npx tsc -p tsconfig.app.json --noEmit`.**
- [ ] **Step 2: Jalankan `npm run build`.**
- [ ] **Step 3: Jalankan `npx playwright test --workers=1`.** Semua test desktop/mobile harus lulus.
- [ ] **Step 4: Jalankan `git diff --check`.**
