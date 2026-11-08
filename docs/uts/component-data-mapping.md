# Component, Arsitektur, dan Data Mapping

## Component tree

Aplikasi memakai satu root controller dan dua child component presentasional. Root memegang seluruh state, typed form, validator, dan kalkulasi; child hanya menerima data siap tampil melalui `@Input` dan mengirim aksi pengguna melalui `@Output`.

```text
BudgetPlannerComponent (src/app/app.ts, selector app-root)
├── app.html (View root)
│   ├── Header dan intro
│   ├── Panel pendapatan
│   │   └── income: FormControl<number>
│   ├── Panel kategori (formArrayName="categories")
│   │   └── CategoryCardComponent (src/app/category-card/)
│   │       ├── @Input category: CategoryGroup
│   │       ├── @Input categoryIndex, expanded, totalLabel, usagePercent,
│   │       │          positionHint, canRemoveCategory, errorMessage
│   │       ├── @Output removeCategory, toggleCategory, appendExpense,
│   │       │           removeExpense, amountInput, amountFocus
│   │       └── category-card.html
│   │           └── nested FormArray expenses (formArrayName="expenses")
│   ├── Panel ringkasan dan status
│   │   └── SummaryPanelComponent (src/app/summary-panel/)
│   │       └── @Input summary: BudgetSummaryView
│   └── Actions: Perbarui ringkasan dan Reset anggaran
├── budget.types.ts (tipe form dan view model bersama)
├── app.css (presentation, ViewEncapsulation.None)
└── app.spec.ts (unit test root)
```

`CategoryCardComponent` dan `SummaryPanelComponent` memakai `templateUrl` masing-masing. Root memakai `ViewEncapsulation.None` agar stylesheet bersama tetap berlaku pada elemen di dalam child component, dan `app.css` memakai selector `app-root` (bukan `:host`) untuk aturan level halaman.

## Tabel `@Input` dan `@Output`

### `CategoryCardComponent`

| Anggota | Jenis | Sumber di root | Fungsi |
| --- | --- | --- | --- |
| `category` | `@Input({ required: true }) CategoryGroup` | `category` dari loop `categories.controls` | Menyediakan `FormGroup` untuk `[formGroup]` dan nested `formArrayName="expenses"`. |
| `categoryIndex` | `@Input() number` | `categoryIndex` dari `*ngFor` | Menentukan ID input, label ARIA, dan nomor kategori. |
| `expanded` | `@Input() boolean` | `isCategoryExpanded(category)` | Memilih state terbuka atau `ng-template #collapsedCategory`. |
| `totalLabel` | `@Input() string` | `formatRupiah(getCategoryTotal(category))` | Menampilkan total kategori yang sudah diformat. |
| `usagePercent` | `@Input() number` | `getCategoryUsagePercent(category)` | Lebar progress kategori terhadap pendapatan form. |
| `positionHint` | `@Input() string` | `getPositionHint(first, last)` | Menampilkan posisi kategori (pertama/terakhir/satu-satunya). |
| `canRemoveCategory` | `@Input() boolean` | `canRemoveCategory(first, last)` | Menonaktifkan hapus saat hanya tersisa satu kategori. |
| `errorMessage` | `@Input() string` | `getCategoryError(category)` | Pesan error nama kategori dari validator root. |
| `removeCategory` | `@Output() EventEmitter<number>` | `removeCategory($event)` | Mengirim indeks kategori yang akan dihapus. |
| `toggleCategory` | `@Output() EventEmitter<CategoryGroup>` | `toggleCategory($event)` | Mengirim referensi grup untuk buka/tutup rincian. |
| `appendExpense` | `@Output() EventEmitter<number>` | `appendExpense($event)` | Mengirim indeks kategori tujuan item baru. |
| `removeExpense` | `@Output() EventEmitter<ExpenseRemoval>` | `removeExpense($event.categoryIndex, $event.expenseIndex)` | Mengirim pasangan indeks kategori dan item. |
| `amountInput` | `@Output() EventEmitter<AmountInputEvent>` | `formatAmountInput($event.event, $event.control)` | Meneruskan event input nominal beserta kontrolnya. |
| `amountFocus` | `@Output() EventEmitter<FocusEvent>` | `selectInitialZero($event)` | Memilih teks `0` agar langsung terganti saat mengetik. |

### `SummaryPanelComponent`

| Anggota | Jenis | Sumber di root | Fungsi |
| --- | --- | --- | --- |
| `summary` | `@Input({ required: true }) BudgetSummaryView` | `summaryView` | Satu view model berisi label rupiah, status, persentase, lebar progress, ikon, dan deskripsi status. |

`BudgetSummaryView` didefinisikan di `src/app/budget.types.ts` dan dibentuk oleh getter `summaryView` di root. Child tidak melakukan kalkulasi; seluruh keputusan tetap berada di Controller.

## Pemetaan komponen

| Bagian | Lokasi | Tanggung jawab |
| --- | --- | --- |
| Root component | `src/app/app.ts` | Pemilik state, typed form, event handler, validator, getter, tracking, dan snapshot ringkasan. |
| Root template | `src/app/app.html` | Form binding, loop kategori, empty state, panel validasi, dan komposisi child component. |
| Category child | `src/app/category-card/category-card.ts` | Menampilkan satu kategori, nested item, progress, error nama, dan `trackByExpense`. |
| Category template | `src/app/category-card/category-card.html` | `formGroup`, nested `formArrayName`, context variable item, branching error dan collapsed. |
| Summary child | `src/app/summary-panel/summary-panel.ts` | Menerima `BudgetSummaryView` dan menampilkannya tanpa state internal. |
| Summary template | `src/app/summary-panel/summary-panel.html` | Panel ringkasan, progress pemakaian, dan panel status. |
| Tipe bersama | `src/app/budget.types.ts` | `BudgetStatus`, `ExpenseGroup`, `CategoryGroup`, `BudgetSummaryView`, `ExpenseRemoval`, `AmountInputEvent`. |
| Component style | `src/app/app.css` | Layout minimalis, hierarchy, breakpoint desktop/mobile, state visual, dan focus. |
| Global style | `src/styles.css` | Box sizing, font stack, body background, cursor, focus, dan reduced motion. |
| Unit test root | `src/app/app.spec.ts` | Perhitungan, format rupiah, nested expense, validasi duplikat, batas kategori, snapshot, draft over-budget, dan reset. |
| Unit test child | `category-card.spec.ts`, `summary-panel.spec.ts` | Render input, nested item, event output, state error, dan panel status. |
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

`ExpenseGroup` dan `CategoryGroup` adalah tipe bersama di `budget.types.ts`, sehingga root dan `CategoryCardComponent` memakai bentuk kontrol yang sama tanpa duplikasi tipe.

## Pemetaan elemen View ke Controller

| Elemen View | Property atau method Controller | Interaksi | Dampak state |
| --- | --- | --- | --- |
| Input `Pendapatan bulanan` | `incomeControl`, `formatAmountInput()`, `updateIncome()` | `formControlName`, `(input)`, `(blur)` | Mengubah nilai income dan memicu validasi. |
| Tombol `Tambah kategori` | `appendCategory()` | `(click)` | Mendorong `CategoryGroup` baru ke `categories`. |
| Input `Nama kategori` | `category.controls.name` | `formControlName` di child | Mengubah nama dan memicu validasi duplikat. |
| Tombol `Lihat detail` atau `Tutup` | `toggleCategory()` via `@Output`, `isCategoryExpanded()` | `(click)` di child, emit ke root | Menambah atau menghapus referensi dari `collapsedCategories`. |
| Tombol hapus kategori | `removeCategory(categoryIndex)` via `@Output` | `(click)` di child, emit ke root | Menghapus baris pada indeks tertentu. |
| Tombol `Tambah item pengeluaran` | `appendExpense(categoryIndex)` via `@Output` | `(click)` di child, emit ke root | Mendorong `ExpenseGroup` ke nested `expenses`. |
| Input `Nama pengeluaran` | `expense.controls.name` | `formControlName` di child | Mengubah nama item dan memicu validasi duplikat. |
| Input `Nominal` | `expense.controls.amount`, `formatAmountInput()` via `@Output` | `formControlName`, `(input)` di child, emit ke root | Menyimpan angka murni dan menampilkan format ribuan. |
| Tombol hapus item | `removeExpense(categoryIndex, expenseIndex)` via `@Output` | `(click)` di child, emit ke root | Menghapus item pada indeks tertentu. |
| Total kategori | `getCategoryTotal(category)` → `totalLabel` | `@Input` ke child | Menampilkan total item per kategori. |
| Progress kategori | `getCategoryUsagePercent(category)` → `usagePercent` | `@Input` dan `[style.width.%]` | Menampilkan pemakaian kategori terhadap income form. |
| Panel `Ringkasan anggaran` | `summaryView` → `@Input summary` | Binding ke `SummaryPanelComponent` | Menampilkan snapshot terkonfirmasi, progress, dan status. |
| Panel validasi | `validationMessages`, `validationHeading`, `hasValidationMessages` | `*ngIf` dan `*ngFor` | Menampilkan pesan dan status `Melebihi anggaran` dari nilai form. |
| Tombol `Perbarui ringkasan` | `submitBudget()`, `submitLabel` | `(ngSubmit)` | Memvalidasi form dan mengambil snapshot bila valid. |
| Tombol `Reset anggaran` | `resetBudget()` | `(click)` | Mengosongkan form, validasi, dan snapshot. |

## Alur data root ke child

```text
Pengguna mengubah input di child
  → child memancarkan @Output (amountInput, appendExpense, removeExpense, ...)
  → root handler memutasi FormControl atau FormArray
  → validator field dan cross-item berjalan
  → root getter menghitung total, sisa, status, dan view model
  → root mengirim nilai baru lewat @Input (category, totalLabel, usagePercent, summary)
  → child melakukan re-render tanpa menyimpan state bisnis
```

Saat pengguna menekan `Perbarui ringkasan`, root memanggil `submitBudget()`. Jika valid, root menyimpan `confirmedIncome` dan `confirmedExpenses`, lalu `summaryView` membentuk `BudgetSummaryView` baru untuk `SummaryPanelComponent`.

## Aturan pembaruan ringkasan

Input form dan validasi mengikuti perubahan terbaru secara langsung agar pengguna segera mendapat feedback. Panel `Ringkasan anggaran` menggunakan `confirmedIncome` dan `confirmedExpenses`, lalu hanya mengambil snapshot baru ketika `submitBudget()` menerima form yang valid dan tidak over-budget. Submit invalid mempertahankan snapshot sebelumnya; `resetBudget()` mengembalikan snapshot ke nol.

Kondisi over-budget tidak masuk ke snapshot karena submit over-budget ditolak. Status `Melebihi anggaran` ditampilkan sebagai status draf di panel validasi melalui `isDraftOverBudget`, sehingga pengguna tetap mendapat peringatan tanpa merusak angka ringkasan yang sudah dikonfirmasi.

## Pemetaan rubrik ke implementasi

| Rubrik | Bukti implementasi |
| --- | --- |
| Component tree | `BudgetPlannerComponent` → `CategoryCardComponent` dan `SummaryPanelComponent`. |
| `@Input` / `@Output` / `EventEmitter` | Delapan `@Input` dan enam `@Output` pada category card; satu `@Input` pada summary panel. |
| Dynamic Multi-Input | `appendCategory`, `removeCategory`, `appendExpense`, `removeExpense`. |
| FormArray nested | `categories: FormArray<CategoryGroup>` dan `expenses: FormArray<ExpenseGroup>`. |
| Cross-validation | `categoryNamesValidator`, `budgetLimitValidator`, `runCrossItemValidation`, `isDraftOverBudget`, dan `validationMessages`. |
| Controller-heavy | Perhitungan dan keputusan state berada di getter atau method controller; child hanya menerima view model. |
| Context variables | `categoryIndex`, `expenseIndex`, `first`, `last`, `expenseFirst`, dan `expenseLast`. |
| `trackBy` | `trackByCategory` di root dan `trackByExpense` di `CategoryCardComponent`, keduanya memakai identity `WeakMap`. |
| Template branching | Empty category, collapsed category, field error, validation panel, dan status panel. |
| UI state | `Belum diatur`, `Aman`, `Mendekati batas`, `Melebihi anggaran` (draf), empty, validation, `Menghitung...`, dan snapshot ringkasan terkonfirmasi. |
| Aksesibilitas | Label terlihat, `aria-invalid`, `aria-describedby`, `aria-expanded`, `aria-controls`, progressbar, `role="alert"`, dan focus terlihat. |
