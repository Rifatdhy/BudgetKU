# BudgetKu Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Merombak tampilan BudgetKu menjadi workspace budgeting terang yang khas, tenang, dan mudah dipindai pada desktop maupun mobile.

**Architecture:** Pertahankan reactive form, template semantics, event handlers, dan selector E2E. Terapkan visual system terpusat melalui CSS custom properties global dan layout component-level di `app.css`, dengan perubahan markup hanya jika diperlukan untuk hierarchy visual.

**Tech Stack:** Angular 20, TypeScript strict, standalone components, CSS biasa, Playwright.

**Spec:** Arah visual terang Apple-inspired dari percakapan pengguna, dengan antislop DURING, ENERGY 2 / RHYTHM 2 / MOTION 1.

## Global Constraints

- Jangan menambah dependency.
- Pertahankan seluruh perilaku form, validasi, kalkulasi, reset, ARIA, dan selector E2E.
- User-facing copy tetap dalam Bahasa Indonesia.
- Tidak boleh ada horizontal overflow pada mobile.
- Gunakan motion hanya untuk hover, focus, pressed state, progress, dan loading; hormati `prefers-reduced-motion`.
- Tidak menambahkan statistik, testimonial, navigasi, atau asset visual yang tidak memiliki sumber.

## Review Focus

- Empty state kategori tetap jelas dan memiliki action yang dapat digunakan.
- Loading state `Menghitung…` tetap terlihat pada tombol submit.
- Error dan over-budget state tetap terbaca dengan teks, bukan hanya warna.
- Form panjang pada viewport mobile 390px dan 320px tidak melebar atau memotong kontrol.
- Dialog reset tetap fokusable, dapat ditutup dengan Escape, dan tombol tetap mencapai target sentuh minimal.

### Task 1: Visual system and page shell

**Files:**
- Modify: `src/styles.css`
- Modify: `src/app/app.css`
- Reference: `DESIGN.md`

- [ ] Tetapkan token warna, radius, spacing, shadow, typography, dan focus state untuk workspace terang.
- [ ] Rombak header, page shell, panel income, action row, footer, dan dialog dengan hierarchy baru.
- [ ] Pastikan aksen hijau hanya dipakai untuk action/status/progress, bukan dekorasi di semua permukaan.

### Task 2: Category and summary composition

**Files:**
- Modify: `src/app/app.css`
- Reference: `src/app/category-card/category-card.html`, `src/app/summary-panel/summary-panel.html`

- [ ] Perkuat hierarchy kartu kategori, nomor kategori, total, progress, item expense, dan empty state.
- [ ] Buat summary panel sebagai focal point dengan angka sisa anggaran paling dominan.
- [ ] Pastikan warning, danger, neutral, dan success memiliki teks atau icon state yang jelas.

### Task 3: Responsive and interaction pass

**Files:**
- Modify: `src/app/app.css`
- Modify: `src/styles.css`

- [ ] Definisikan state desktop, tablet, dan mobile berdasarkan kebutuhan konten.
- [ ] Pastikan target tombol minimal 44px, focus-visible terlihat, hover/active/disabled berbeda, dan reduced motion aman.
- [ ] Pastikan layout mobile tidak overflow pada viewport 320px, 390px, 768px, dan 820px.

### Task 4: Verification

**Files:**
- No source changes expected.

- [ ] Jalankan `npm run build`.
- [ ] Jalankan `npm run test:e2e` pada Chromium dan mobile.
- [ ] Jalankan `git diff --check`.
- [ ] Periksa status git dan review diff sebelum melaporkan hasil.
