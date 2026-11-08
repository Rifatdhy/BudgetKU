# Component Architecture

Diagram ini menunjukkan pembagian tanggung jawab antara root controller dan dua child component presentasional. Tidak ada service, backend, atau state management eksternal.

```mermaid
%%{init: {'theme':'base','themeVariables':{'primaryColor':'#ffffff','primaryTextColor':'#1c1c1e','primaryBorderColor':'#007a4d','lineColor':'#5f5f66','secondaryColor':'#f5f5f7','tertiaryColor':'#ffffff','clusterBkg':'#fafafa','clusterBorder':'#8a8a91','fontFamily':'-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif','fontSize':'16px'}}}%%
flowchart TD
  actor[Pengguna]

  subgraph browser[Aplikasi Angular di browser]
    rootView["app.html<br/>View root"]
    root["BudgetPlannerComponent<br/>Controller root"]
    category["CategoryCardComponent<br/>Child presentasional"]
    categoryView["category-card.html<br/>Kategori dan nested item"]
    summary["SummaryPanelComponent<br/>Child presentasional"]
    summaryView["summary-panel.html<br/>Ringkasan dan status"]
    form[("budgetForm<br/>FormGroup + FormArray")]
    types["budget.types.ts<br/>Tipe form dan view model"]
  end

  actor -->|"input, klik, submit"| rootView
  rootView -->|"event binding"| root
  root -->|"mutasi FormControl / FormArray"| form
  form -->|"valueChanges"| root
  root -->|"@Input category, categoryIndex, expanded, totalLabel, usagePercent, positionHint, canRemoveCategory, errorMessage"| category
  category -->|"@Output removeCategory, toggleCategory, appendExpense, removeExpense, amountInput, amountFocus"| root
  root -->|"@Input summary: BudgetSummaryView"| summary
  category --> categoryView
  summary --> summaryView
  root --> rootView
  types -.->|"dipakai"| root
  types -.->|"dipakai"| category
  types -.->|"dipakai"| summary
```

## Aturan arsitektur

- Root adalah satu-satunya pemilik state bisnis: `budgetForm`, snapshot ringkasan, `collapsedCategories`, validator, dan kalkulasi.
- `CategoryCardComponent` menerima `CategoryGroup` dan data tampilan; semua aksi dikirim ke root melalui `EventEmitter`.
- `SummaryPanelComponent` hanya menerima satu `BudgetSummaryView`; tidak ada kalkulasi di dalam child.
- `budget.types.ts` menjadi kontrak tipe bersama agar root dan child memakai bentuk data yang sama.
- Root memakai `ViewEncapsulation.None`, sehingga `app.css` menjadi stylesheet global untuk root dan child; selector level halaman memakai `app-root`.
