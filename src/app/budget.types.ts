import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type BudgetStatus = 'Belum diatur' | 'Aman' | 'Mendekati batas' | 'Melebihi anggaran';

export type ExpenseGroup = FormGroup<{
  name: FormControl<string>;
  amount: FormControl<number>;
}>;

export type CategoryGroup = FormGroup<{
  name: FormControl<string>;
  expenses: FormArray<ExpenseGroup>;
}>;

export interface BudgetSummaryView {
  remainingBudgetLabel: string;
  confirmedIncomeLabel: string;
  confirmedExpenseLabel: string;
  status: BudgetStatus;
  usagePercent: number;
  progressWidth: number;
  usageLabel: string;
  isConfigured: boolean;
  statusIcon: string;
  isNearLimit: boolean;
  isOverBudget: boolean;
  statusDescription: string;
}

export interface ExpenseRemoval {
  categoryIndex: number;
  expenseIndex: number;
}

export interface AmountInputEvent {
  event: Event;
  control: FormControl<number>;
}
