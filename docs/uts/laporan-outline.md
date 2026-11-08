# Kerangka Laporan UTS BudgetKu

> Status: kerangka. Placeholder identitas di bawah harus diisi sebelum laporan diekspor ke PDF.

## Identitas

| Field | Isi |
| --- | --- |
| Nama lengkap | `[NAMA LENGKAP]` |
| NPM | `[NPM]` |
| Kelas | `[KELAS]` |
| Mata kuliah | Framework Based Programming |
| Dosen | Halimatuz Zuhriyah, S.Kom., MIT |
| Studi kasus | BudgetKu, perencana anggaran bulanan |

## 1. Studi kasus dan use case

- Masalah: pengguna perlu menyusun pendapatan, kategori, dan item pengeluaran dalam satu alur.
- Alasan bukan CRUD statis: aplikasi menghitung total, sisa, persentase, dan status, lalu memvalidasi hubungan antarbaris.
- Aktor: Pengguna.
- Diagram: lihat `docs/uts/use-case-diagram.md` dan `docs/uts/use-case.md`.
- Batasan: tanpa backend, database, login, atau persistence.

## 2. Use case description

Laporan memuat minimal tiga use case utama:

1. UC-01 Mengatur pendapatan bulanan.
2. UC-02 Menambah kategori dan item pengeluaran.
3. UC-05 Mengonfirmasi ringkasan anggaran.

Tambahan:

4. UC-04 Memvalidasi anggaran.
5. UC-07 Mereset anggaran.

Setiap use case memuat aktor, tujuan, precondition, alur aksi dan reaksi, skenario alternatif, dan postcondition. Isi lengkap ada di `docs/uts/use-case.md`.

## 3. Sequence diagram View dan Controller

- Sumber: `docs/uts/sequence-diagram.md`.
- Fokus: event binding, pemanggilan handler, validasi, mutasi `FormArray`, kalkulasi, dan re-render.
- Tidak memuat database, backend, repository, atau persistence layer.
- Nama method mengikuti `src/app/app.ts`.

## 4. Component architecture dan data mapping

- Sumber: `docs/uts/component-data-mapping.md`.
- Component tree: root `BudgetPlannerComponent`, template, style, dan test.
- Data mapping: `budgetForm`, `income`, `categories`, dan nested `expenses`.
- Pemetaan elemen View ke property atau method Controller tersedia dalam tabel.
- Implementasi memakai satu component karena brief membolehkan pola minimal tersebut.

## 5. Implementasi FormArray dan cross-validation

- Nested `FormArray`: `categories` dan `expenses`.
- Append: `appendCategory()` dan `appendExpense()`.
- Remove at index: `removeCategory()` dan `removeExpense()`.
- Validasi field: `Validators.required` dan `Validators.min(1)`.
- Validasi lintas baris: `categoryNamesValidator()`, `budgetLimitValidator()`, dan `runCrossItemValidation()`.
- Batas kategori: minimal satu kategori pada kondisi berjalan dan maksimal sepuluh kategori.
- Setiap kategori memiliki minimal satu item.

## 6. Template Angular

- Nested `*ngFor` untuk kategori dan item.
- Context variable: `index`, `first`, `last`, `expenseFirst`, dan `expenseLast`.
- `trackBy`: `trackByCategory` dan `trackByExpense`.
- Branching: empty state, populated state, collapsed category, field error, validation panel, dan status panel.
- Logika boolean kompleks berada di getter atau method Controller.

## 7. UI state dan snapshot ringkasan

- Empty state: `Belum ada kategori`.
- Populated state: daftar kategori dan item.
- Loading state: `Menghitung...` selama 250 ms pada submit valid.
- Error state: pesan inline, panel validasi, dan status draf `Melebihi anggaran`.
- Status ringkasan: `Belum diatur`, `Aman`, dan `Mendekati batas`.
- Snapshot: `confirmedIncome` dan `confirmedExpenses` hanya berubah lewat `submitBudget()` yang valid.

## 8. Demo dan pengujian

- Urutan demo: `docs/uts/demo-checklist.md`.
- Unit test: `npm test -- --watch=false`.
- E2E desktop dan mobile: `npm run test:e2e` setelah server berjalan di port `4300`.
- Build produksi: `npm run build`.

## 9. Diagram untuk lampiran

File berikut sudah diekspor dan siap dilampirkan:

- `docs/uts/use-case-diagram.png` dan `docs/uts/use-case-diagram.pdf`
- `docs/uts/sequence-diagram.png` dan `docs/uts/sequence-diagram.pdf`

Sumber Mermaid tetap disimpan di `docs/uts/use-case-diagram.md` dan `docs/uts/sequence-diagram.md`. Jika isi diagram berubah, render ulang dengan `npx @mermaid-js/mermaid-cli -i <sumber>.md -o <hasil>.png -b white -s 2`.

## 10. Catatan pengumpulan

- Isi nama dan NPM pada bagian identitas.
- Ekspor laporan ini ke PDF.
- Sertakan tautan repository GitHub atau ZIP source code.
- Pastikan diagram, nama method, dan source code tetap sinkron.
