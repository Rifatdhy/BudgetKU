# Component, Arsitektur, dan Data Mapping

## Component tree

Implementasi minimal menempatkan seluruh fitur pada satu root component. Brief proyek membolehkan pola ini selama `FormArray` dan pemisahan tanggung jawab View dan Controller terlihat.

```text
BudgetPlannerComponent (src/app/app.ts)
├── app.html (View)
│   ├── Header dan intro
│   ├── Panel pendapatan
│   │   └── income: FormControl<number>
│   ├── Panel kategori
│   │   ├── categories: FormArray<CategoryGroup>
│   │   └── expenses: FormArray<ExpenseGroup> (nested)
│   ├── Panel ringkasan
│   │   └── snapshot confirmedIncome dan confirmedExpenses
│   ├── Panel status dan validasi
│   └── Actions: Perbarui ringkasan dan Reset anggaran
├── app.css (presentation)
└── app.spec.ts (unit test)
```

Tidak ada `@Input()`, `@Output()`, atau `EventEmitter` karena belum ada child component. Jika komponen dipecah, pembagian yang disarankan ada di `file.md` bagian 8.6. Untuk implementasi saat ini, komunikasi terjadi antara template dan controller melalui event binding, `formControlName`, dan getter.

## Pemetaan komponen

| Bagian | Lokasi | Tanggung jawab |
| --- | --- | --- |
| Root component | `src/app/app.ts` | Pemilik state, typed form, event handler, validator, getter, tracking, dan snapshot ringkasan. |
| Template | `src/app/app.html` | Form binding, nested `FormArray`, branching state, loop kategori/item, dan aksesibilitas. |
| Component style | `src/app/app.css` | Layout minimalis, hierarchy, breakpoint desktop/mobile, state visual, dan focus. |
| Global style | `src/styles.css` | Box sizing, font stack, body background, cursor, focus, dan reduced motion. |
| Unit test | `src/app/app.spec.ts` | Perhitungan, format rupiah, nested expense, validasi duplikat, batas kategori, snapshot, draft over-budget, dan reset. |
| E2E test | `e2e/budgetku.spec.ts` | Alur pengguna nyata di Chromium desktop dan iPhone 13 mobile. |

## Pemetaan data

```text
BudgetPlannerComponent
└── budgetForm: FormGroup
    ├── income: FormControl<number>
    └── categories: FormArray<CategoryGroup>
        └── CategoryGroup
            ├── name: FormControl<string>
            └── expenses: FormArray<ExpenseGroup>
                └── ExpenseGroup
                    ├── name: FormControl<string>
                    └── amount: FormControl<number>
```

## Pemetaan elemen View ke Controller

| Elemen View | Property atau method Controller | Interaksi | Dampak state |
| --- | --- | --- | --- |
| Input `Pendapatan bulanan` | `incomeControl`, `formatAmountInput()`, `updateIncome()` | `formControlName`, `(input)`, `(blur)` | Mengubah nilai income dan memicu validasi. |
| Tombol `Tambah kategori` | `appendCategory()` | `(click)` | Mendorong `CategoryGroup` baru ke `categories`. |
| Input `Nama kategori` | `category.controls.name` | `formControlName` | Mengubah nama dan memicu validasi duplikat. |
| Tombol `Lihat detail` atau `Tutup` | `toggleCategory()`, `isCategoryExpanded()` | `(click)` | Menambah atau menghapus referensi dari `collapsedCategories`. |
| Tombol hapus kategori | `removeCategory(categoryIndex)` | `(click)` | Menghapus baris pada indeks tertentu. |
| Tombol `Tambah item pengeluaran` | `appendExpense(categoryIndex)` | `(click)` | Mendorong `ExpenseGroup` ke nested `expenses`. |
| Input `Nama pengeluaran` | `expense.controls.name` | `formControlName` | Mengubah nama item dan memicu validasi duplikat. |
| Input `Nominal` | `expense.controls.amount`, `formatAmountInput()` | `formControlName`, `(input)` | Menyimpan angka murni dan menampilkan format ribuan. |
| Tombol hapus item | `removeExpense(categoryIndex, expenseIndex)` | `(click)` | Menghapus item pada indeks tertentu. |
| Total kategori | `getCategoryTotal(category)` | Interpolasi | Menampilkan total item per kategori. |
| Progress kategori | `getCategoryUsagePercent(category)` | Interpolasi dan `[style.width.%]` | Menampilkan pemakaian kategori terhadap income form. |
| Panel `Ringkasan anggaran` | `confirmedIncomeAmount`, `confirmedExpenseAmount`, `remainingBudget`, `budgetUsagePercent`, `budgetStatus` | Interpolasi | Menampilkan snapshot terkonfirmasi. |
| Panel validasi | `validationMessages`, `isDraftOverBudget` | `*ngIf` dan `*ngFor` | Menampilkan pesan dan status `Melebihi anggaran` dari nilai form. |
| Tombol `Perbarui ringkasan` | `submitBudget()` | `(ngSubmit)` | Memvalidasi form dan mengambil snapshot bila valid. |
| Tombol `Reset anggaran` | `resetBudget()` | `(click)` | Mengosongkan form, validasi, dan snapshot. |

## Alur data

```text
Pengguna mengubah input
  → template menjalankan event binding
  → controller memutasi FormControl atau FormArray
  → validator field dan cross-item berjalan
  → getter menghitung total, sisa, dan status
  → template melakukan re-render
  → pengguna menekan Perbarui ringkasan
  → submitBudget() menyimpan snapshot jika valid
  → panel ringkasan menampilkan nilai snapshot
```

## Aturan pembaruan ringkasan

Input form dan validasi mengikuti perubahan terbaru secara langsung agar pengguna segera mendapat feedback. Panel `Ringkasan anggaran` menggunakan `confirmedIncome` dan `confirmedExpenses`, lalu hanya mengambil snapshot baru ketika `submitBudget()` menerima form yang valid dan tidak over-budget. Submit invalid mempertahankan snapshot sebelumnya; `resetBudget()` mengembalikan snapshot ke nol.

Kondisi over-budget tidak masuk ke snapshot karena submit over-budget ditolak. Status `Melebihi anggaran` ditampilkan sebagai status draf di panel validasi melalui `isDraftOverBudget`, sehingga pengguna tetap mendapat peringatan tanpa merusak angka ringkasan yang sudah dikonfirmasi.

## Pemetaan rubrik ke implementasi

| Rubrik | Bukti implementasi |
| --- | --- |
| Dynamic Multi-Input | `appendCategory`, `removeCategory`, `appendExpense`, `removeExpense`. |
| FormArray nested | `categories: FormArray<CategoryGroup>` dan `expenses: FormArray<ExpenseGroup>`. |
| Cross-validation | `categoryNamesValidator`, `budgetLimitValidator`, `runCrossItemValidation`, `isDraftOverBudget`, dan `validationMessages`. |
| Controller-heavy | Perhitungan dan keputusan state berada di getter atau method controller. |
| Context variables | `categoryIndex`, `expenseIndex`, `first`, `last`, `expenseFirst`, dan `expenseLast`. |
| `trackBy` | `trackByCategory` dan `trackByExpense` memakai identity `WeakMap`. |
| Template branching | Empty category, collapsed category, field error, validation panel, dan status panel. |
| UI state | `Belum diatur`, `Aman`, `Mendekati batas`, `Melebihi anggaran` (draf), empty, validation, `Menghitung...`, dan snapshot ringkasan terkonfirmasi. |
| Aksesibilitas | Label terlihat, `aria-invalid`, `aria-describedby`, `aria-expanded`, `aria-controls`, progressbar, `role="alert"`, dan focus terlihat. |
