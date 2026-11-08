# Sequence Diagram Dynamic Multi-Input dan Cross-Validation

Alur ini menggambarkan interaksi pada browser. Tidak ada request backend atau database. Nama method pada diagram sama dengan nama method di `src/app/app.ts`.

```mermaid
%%{init: {'theme':'base','themeVariables':{'primaryColor':'#ffffff','primaryTextColor':'#1c1c1e','primaryBorderColor':'#007a4d','lineColor':'#5f5f66','secondaryColor':'#f5f5f7','tertiaryColor':'#ffffff','actorBkg':'#ffffff','actorBorder':'#007a4d','actorTextColor':'#1c1c1e','signalColor':'#5f5f66','signalTextColor':'#1c1c1e','labelBoxBkgColor':'#f5f5f7','labelBoxBorderColor':'#8a8a91','loopTextColor':'#1c1c1e','noteBkgColor':'#fafafa','noteBorderColor':'#8a8a91','fontFamily':'-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif','fontSize':'16px'}}}%%
sequenceDiagram
  actor Pengguna
  participant View as app.html
  participant Controller as BudgetPlannerComponent
  participant Form as budgetForm (FormGroup dan FormArray)
  participant Validator as Cross-validation

  Pengguna->>View: Isi pendapatan atau nominal item
  View->>Controller: formatAmountInput(event, control)
  Controller->>Form: setValue(angka murni)
  Form-->>Controller: valueChanges
  Controller->>Validator: runCrossItemValidation()
  Validator->>Form: Set atau hapus error group
  Validator-->>View: validationMessages dan error per field
  View-->>Pengguna: Format ribuan, error inline, dan progress kategori

  Pengguna->>View: Klik Tambah kategori
  View->>Controller: appendCategory()
  Controller->>Form: push(CategoryGroup dengan satu ExpenseGroup)
  Controller->>Validator: runCrossItemValidation()
  View-->>Pengguna: Kategori baru dan nested item tampil

  Pengguna->>View: Klik Tambah item pengeluaran
  View->>Controller: appendExpense(categoryIndex)
  Controller->>Form: push(ExpenseGroup ke nested expenses)
  Controller->>Validator: runCrossItemValidation()
  View-->>Pengguna: Item baru tampil

  Pengguna->>View: Klik hapus kategori atau item
  View->>Controller: removeCategory(categoryIndex) atau removeExpense(categoryIndex, expenseIndex)
  Controller->>Form: removeAt(indeks)
  Controller->>Validator: runCrossItemValidation()
  View-->>Pengguna: Baris dihapus dan indeks lain disusun ulang

  Pengguna->>View: Klik Perbarui ringkasan
  View->>Controller: submitBudget()
  Controller->>Form: markAllAsTouched()
  Controller->>Validator: updateIncome() dan validasi form
  alt Form invalid atau over-budget
    Controller-->>View: isUpdatingSummary tetap false
    View-->>Pengguna: Pesan validasi dan status Melebihi anggaran
  else Form valid
    Controller->>Controller: Simpan snapshot confirmedIncome dan confirmedExpenses
    Controller-->>View: isUpdatingSummary true
    View-->>Pengguna: Ringkasan snapshot baru dan tombol Menghitung...
    Controller-->>View: Timer 250 ms selesai
    View-->>Pengguna: Tombol kembali menjadi Perbarui ringkasan
  end

  Pengguna->>View: Klik Reset anggaran
  View->>Controller: resetBudget()
  Controller->>Form: reset(income 0) dan clear categories
  Controller->>Controller: Kosongkan snapshot dan batalkan timer
  View-->>Pengguna: Empty state dan ringkasan Belum diatur
```

## Catatan sinkronisasi

- Event binding yang terlihat di template: `(input)`, `(blur)`, `(click)`, dan `(ngSubmit)`.
- Handler yang dipanggil: `formatAmountInput()`, `updateIncome()`, `appendCategory()`, `removeCategory()`, `appendExpense()`, `removeExpense()`, `toggleCategory()`, `submitBudget()`, dan `resetBudget()`.
- Validasi dijalankan di Controller melalui `runCrossItemValidation()`, `categoryNamesValidator()`, dan `budgetLimitValidator()`.
- View hanya menampilkan hasil getter dan state controller. Tidak ada perhitungan bisnis di dalam template.
