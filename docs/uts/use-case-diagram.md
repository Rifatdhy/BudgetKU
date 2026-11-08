# Use Case Diagram

Dokumen ini adalah sumber diagram yang dapat dirender ke PNG atau PDF menggunakan Mermaid. Diagram menunjukkan aplikasi non-CRUD tanpa aktor backend. ID use case sama dengan `docs/uts/use-case.md`.

```mermaid
%%{init: {'theme':'base','themeVariables':{'primaryColor':'#ffffff','primaryTextColor':'#1c1c1e','primaryBorderColor':'#007a4d','lineColor':'#5f5f66','secondaryColor':'#f5f5f7','tertiaryColor':'#ffffff','clusterBkg':'#fafafa','clusterBorder':'#8a8a91','fontFamily':'-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif','fontSize':'16px'}}}%%
flowchart LR
  actor[Pengguna]
  subgraph sistem[BudgetKu]
    income((UC-01 Atur pendapatan))
    category((UC-02 Tambah kategori dan item))
    item((UC-03 Hapus kategori atau item))
    validation((UC-04 Validasi anggaran))
    summary((UC-05 Konfirmasi ringkasan))
    toggle((UC-06 Buka atau tutup rincian))
    reset((UC-07 Reset anggaran))
    overBudget((UC-08 Peringatan over-budget))
  end

  actor --> income
  actor --> category
  actor --> item
  actor --> summary
  actor --> toggle
  actor --> reset

  income -. «include» .-> validation
  category -. «include» .-> validation
  item -. «include» .-> validation
  summary -. «include» .-> validation
  overBudget -. «extend» .-> validation
```

## Catatan relasi

- `include` dipakai karena validasi selalu menjadi bagian dari alur dasar: setiap perubahan pendapatan, kategori, item, dan konfirmasi ringkasan selalu menjalankan `runCrossItemValidation()`. Arah panah selalu dari use case dasar menuju use case yang disertakan.
- `extend` dipakai untuk `UC-08 Peringatan over-budget`. Use case perluasan ini hanya berjalan bila total pengeluaran melampaui pendapatan, dan arah panahnya menuju use case dasar `UC-04 Validasi anggaran`, bukan sebaliknya.
- `UC-08` tidak mengubah snapshot ringkasan. Ia hanya menampilkan status draf `Melebihi anggaran` dan pesan validasi.
- Tidak ada aktor backend, database, atau service eksternal.
