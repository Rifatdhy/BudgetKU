# Component, Arsitektur, dan Data Mapping

## Pemetaan komponen

| Bagian | Lokasi | Tanggung jawab |
| --- | --- | --- |
| Root component | `src/app/app.ts` | Pemilik state, typed form, event handler, validator, getter, dan tracking. |
| Template | `src/app/app.html` | Form binding, nested `FormArray`, branching state, loop kategori/item, dan aksesibilitas. |
| Component style | `src/app/app.css` | Layout minimalis, hierarchy, breakpoint desktop/mobile, state visual, dan focus. |
| Global style | `src/styles.css` | Box sizing, font stack, body background, cursor, focus, dan reduced motion. |
| Unit test | `src/app/app.spec.ts` | Perhitungan, format rupiah, nested expense, validasi duplikat, batas anggaran, submit, dan reset. |
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

## Pemetaan rubrik ke implementasi

| Rubrik | Bukti implementasi |
| --- | --- |
| Dynamic Multi-Input | `appendCategory`, `removeCategory`, `appendExpense`, `removeExpense`. |
| FormArray nested | `categories: FormArray<CategoryGroup>` dan `expenses: FormArray<ExpenseGroup>`. |
| Cross-validation | `categoryNamesValidator`, `runCrossItemValidation`, `isOverBudget`, dan `validationMessages`. |
| Controller-heavy | Perhitungan dan keputusan state berada di getter/method controller. |
| Context variables | `categoryIndex`, `expenseIndex`, `first`, `last`, `expenseFirst`, dan `expenseLast`. |
| `trackBy` | `trackByCategory` dan `trackByExpense` memakai identity `WeakMap`. |
| Template branching | Empty category, collapsed category, field error, validation panel, dan status panel. |
| UI state | `Belum diatur`, `Aman`, `Mendekati batas`, `Melebihi anggaran`, empty, validation, `Menghitung...`, dan snapshot ringkasan terkonfirmasi. |

## Aturan pembaruan ringkasan

Input form dan validasi mengikuti perubahan terbaru secara langsung agar pengguna segera mendapat feedback. Panel `Ringkasan anggaran` menggunakan `confirmedIncome` dan `confirmedExpenses`, lalu hanya mengambil snapshot baru ketika `submitBudget()` menerima form yang valid dan tidak over-budget. Submit invalid mempertahankan snapshot sebelumnya; `resetBudget()` mengembalikan snapshot ke nol.
