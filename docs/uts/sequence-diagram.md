# Sequence Diagram Dynamic Multi-Input dan Cross-Validation

Alur ini menggambarkan interaksi pada browser. Tidak ada request backend atau database. Nama class, method, `@Input`, dan `@Output` pada diagram sama dengan kode di `src/app/`.

```mermaid
%%{init: {'theme':'base','themeVariables':{'primaryColor':'#ffffff','primaryTextColor':'#1c1c1e','primaryBorderColor':'#007a4d','lineColor':'#5f5f66','secondaryColor':'#f5f5f7','tertiaryColor':'#ffffff','actorBkg':'#ffffff','actorBorder':'#007a4d','actorTextColor':'#1c1c1e','signalColor':'#5f5f66','signalTextColor':'#1c1c1e','labelBoxBkgColor':'#f5f5f7','labelBoxBorderColor':'#8a8a91','loopTextColor':'#1c1c1e','noteBkgColor':'#fafafa','noteBorderColor':'#8a8a91','fontFamily':'-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif','fontSize':'16px'}}}%%
sequenceDiagram
  actor Pengguna
  participant RootView as app.html
  participant CategoryView as CategoryCardComponent
  participant SummaryView as SummaryPanelComponent
  participant Controller as BudgetPlannerComponent
  participant Form as budgetForm (FormGroup dan FormArray)
  participant Validator as Cross-validation

  Pengguna->>RootView: Isi pendapatan
  RootView->>Controller: formatAmountInput(event, incomeControl)
  Controller->>Form: income.setValue(angka murni)
  Form-->>Controller: valueChanges
  Controller->>Validator: runCrossItemValidation()
  Controller->>Controller: calculateTotalExpenses()
  Controller->>Controller: calculateRemainingBudget()
  Controller->>Controller: getBudgetStatus()
  Validator-->>RootView: validationMessages dan incomeErrorId
  RootView-->>Pengguna: Format ribuan, error inline, dan status draf real-time

  Pengguna->>CategoryView: Isi nominal item
  CategoryView->>RootView: amountInput.emit({ event, control })
  RootView->>Controller: formatAmountInput(event, control)
  Controller->>Form: expense.amount.setValue(angka murni)
  Form-->>Controller: valueChanges
  Controller->>Validator: runCrossItemValidation()
  Controller->>Controller: calculateTotalExpenses()
  Controller->>Controller: getCategoryTotal(category)
  Controller->>Controller: getCategoryUsagePercent(category)
  RootView-->>CategoryView: totalLabel dan usagePercent baru
  CategoryView-->>Pengguna: Total kategori dan progress berubah real-time

  Pengguna->>RootView: Klik Tambah kategori
  RootView->>Controller: appendCategory()
  Controller->>Form: categories.push(createCategoryGroup())
  Controller->>Validator: runCrossItemValidation()
  RootView-->>Pengguna: CategoryCardComponent baru dengan satu item

  Pengguna->>CategoryView: Klik Tambah item pengeluaran
  CategoryView->>RootView: appendExpense.emit(categoryIndex)
  RootView->>Controller: appendExpense(categoryIndex)
  Controller->>Form: expenses.push(createExpenseGroup())
  Controller->>Validator: runCrossItemValidation()
  RootView-->>CategoryView: category yang sama dengan FormArray lebih panjang
  CategoryView-->>Pengguna: Item baru tampil melalui nested loop

  Pengguna->>CategoryView: Klik Lihat detail atau Tutup
  CategoryView->>RootView: toggleCategory.emit(category)
  RootView->>Controller: toggleCategory(category)
  Controller->>Controller: collapsedCategories.add atau delete
  RootView-->>CategoryView: expanded = isCategoryExpanded(category)
  CategoryView-->>Pengguna: Rincian dibuka atau ditutup

  Pengguna->>CategoryView: Klik hapus item atau hapus kategori
  CategoryView->>RootView: removeExpense.emit(...) atau removeCategory.emit(...)
  RootView->>Controller: removeExpense(...) atau removeCategory(...)
  Controller->>Form: removeAt(indeks)
  Controller->>Validator: runCrossItemValidation()
  Controller->>Controller: calculateTotalExpenses()
  RootView-->>CategoryView: Daftar dan indeks baru setelah trackBy
  CategoryView-->>Pengguna: Baris dihapus dan total dihitung ulang real-time

  Pengguna->>RootView: Klik Perbarui ringkasan
  RootView->>Controller: submitBudget()
  Controller->>Form: markAllAsTouched()
  Controller->>Validator: updateIncome() dan validasi form
  alt Form invalid atau total melebihi pendapatan
    Controller-->>RootView: isUpdatingSummary tetap false
    RootView-->>Pengguna: Pesan validasi dan status Melebihi anggaran
  else Form valid
    Controller->>Controller: Simpan snapshot confirmedIncome dan confirmedExpenses
    Controller->>Controller: getBudgetStatus()
    Controller-->>RootView: isUpdatingSummary true dan submitLabel Menghitung...
    RootView->>SummaryView: @Input summary = summaryView
    SummaryView-->>Pengguna: Sisa, total, progress, dan status dari snapshot
    Controller-->>RootView: Timer 250 ms selesai
    RootView-->>Pengguna: Tombol kembali menjadi Perbarui ringkasan
  end

  Pengguna->>RootView: Klik Reset anggaran
  RootView->>Controller: resetBudget()
  Controller->>Form: reset(income 0) dan categories.clear()
  Controller->>Controller: Kosongkan snapshot dan batalkan timer
  RootView-->>Pengguna: Empty state dan SummaryPanelComponent Belum diatur
```

## Catatan sinkronisasi

- Komponen View: `app.html` sebagai root, `CategoryCardComponent` untuk satu kategori, dan `SummaryPanelComponent` untuk ringkasan/status.
- Event binding di root: `(input)`, `(blur)`, `(click)`, dan `(ngSubmit)`; event di child diteruskan sebagai `@Output`.
- Handler root: `formatAmountInput()`, `updateIncome()`, `appendCategory()`, `removeCategory()`, `appendExpense()`, `removeExpense()`, `toggleCategory()`, `submitBudget()`, dan `resetBudget()`.
- Kalkulasi real-time: `calculateTotalExpenses()`, `calculateRemainingBudget()`, `getBudgetStatus()`, `getCategoryTotal()`, dan `getCategoryUsagePercent()` dijalankan dari getter root setiap change detection.
- Validasi dijalankan di Controller melalui `runCrossItemValidation()`, `categoryNamesValidator()`, dan `budgetLimitValidator()`.
- View hanya menampilkan hasil getter dan view model. Child component tidak menyimpan state bisnis dan tidak melakukan perhitungan.
