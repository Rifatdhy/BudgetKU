import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

type ExpenseGroup = FormGroup<{
  name: FormControl<string>;
  amount: FormControl<number>;
}>;

type CategoryGroup = FormGroup<{
  name: FormControl<string>;
  expenses: FormArray<ExpenseGroup>;
}>;

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class BudgetPlannerComponent implements OnDestroy {
  readonly maxCategories = 10;
  readonly warningThreshold = 0.8;
  isUpdatingSummary = false;

  readonly budgetForm: FormGroup<{
    income: FormControl<number>;
    categories: FormArray<CategoryGroup>;
  }>;

  private readonly formSubscription: Subscription;
  private readonly trackIds = new WeakMap<object, string>();
  private readonly collapsedCategories = new WeakSet<CategoryGroup>();
  private nextTrackId = 0;
  private readonly numberFormatter = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  });
  private crossItemMessages: string[] = [];
  private confirmedIncome = 0;
  private confirmedExpenses = 0;
  private summaryTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(private readonly formBuilder: NonNullableFormBuilder) {
    this.budgetForm = this.formBuilder.group({
      income: this.formBuilder.control(0, [Validators.required, Validators.min(1)]),
      categories: this.formBuilder.array<CategoryGroup>([], {
        validators: [this.categoryNamesValidator()],
      }),
    }, {
      validators: [this.budgetLimitValidator()],
    });

    this.formSubscription = this.budgetForm.valueChanges.subscribe(() => {
      this.runCrossItemValidation();
    });
  }

  get incomeControl(): FormControl<number> {
    return this.budgetForm.controls.income;
  }

  get categories(): FormArray<CategoryGroup> {
    return this.budgetForm.controls.categories;
  }

  get hasCategories(): boolean {
    return this.categories.length > 0;
  }

  get totalExpenses(): number {
    return this.calculateTotalExpenses();
  }

  get confirmedIncomeAmount(): number {
    return this.confirmedIncome;
  }

  get confirmedExpenseAmount(): number {
    return this.confirmedExpenses;
  }

  get remainingBudget(): number {
    return this.confirmedIncome - this.confirmedExpenses;
  }

  get budgetStatus(): 'Belum diatur' | 'Aman' | 'Mendekati batas' | 'Melebihi anggaran' {
    return this.getBudgetStatus();
  }

  get validationMessages(): string[] {
    return this.crossItemMessages;
  }

  get isOverBudget(): boolean {
    return this.confirmedExpenses > this.confirmedIncome;
  }

  get statusIcon(): string {
    if (!this.isBudgetConfigured) {
      return '?';
    }

    return this.budgetStatus === 'Aman' ? '✓' : '!';
  }

  get isDraftOverBudget(): boolean {
    return this.incomeControl.value > 0 && this.totalExpenses > this.incomeControl.value;
  }

  get isIncomeValid(): boolean {
    return this.incomeControl.valid && this.incomeControl.value > 0;
  }

  formatRupiah(value: number): string {
    return `Rp ${this.numberFormatter.format(value)}`;
  }

  get isBudgetConfigured(): boolean {
    return this.confirmedIncome > 0;
  }

  get budgetUsagePercent(): number {
    if (!this.isBudgetConfigured) {
      return 0;
    }

    return (this.confirmedExpenses / this.confirmedIncome) * 100;
  }

  get budgetProgressWidth(): number {
    return Math.min(this.budgetUsagePercent, 100);
  }

  get budgetUsageLabel(): string {
    if (!this.isBudgetConfigured) {
      return 'Masukkan pendapatan untuk melihat pemakaian';
    }

    return `${Math.round(this.budgetUsagePercent)}% dari pendapatan terpakai`;
  }

  updateIncome(): void {
    this.incomeControl.markAsTouched();
    this.runCrossItemValidation();
  }

  selectInitialZero(event: FocusEvent): void {
    const input = event.target;

    if (input instanceof HTMLInputElement && input.value === '0') {
      input.select();
    }
  }

  formatAmountInput(event: Event, control: FormControl<number>): void {
    const input = event.target;

    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    const caret = input.selectionStart ?? input.value.length;
    const digitsBeforeCaret = input.value.slice(0, caret).replace(/\D/g, '').length;
    const digits = input.value.replace(/\D/g, '');

    if (digits.length === 0) {
      control.setValue(0, { emitEvent: false });
      input.value = '';
      this.runCrossItemValidation();
      return;
    }

    const amount = Number(digits);
    control.setValue(amount, { emitEvent: false });

    const formatted = this.numberFormatter.format(amount);
    let nextCaret = 0;
    let seenDigits = 0;

    while (nextCaret < formatted.length && seenDigits < digitsBeforeCaret) {
      if (/\d/.test(formatted[nextCaret])) {
        seenDigits += 1;
      }
      nextCaret += 1;
    }

    input.value = formatted;
    input.setSelectionRange(nextCaret, nextCaret);
    this.runCrossItemValidation();
  }

  submitBudget(): void {
    this.budgetForm.markAllAsTouched();
    this.updateIncome();

    if (this.budgetForm.invalid || this.totalExpenses > this.incomeControl.value) {
      return;
    }

    this.confirmedIncome = this.incomeControl.value;
    this.confirmedExpenses = this.totalExpenses;
    this.isUpdatingSummary = true;

    if (this.summaryTimer !== undefined) {
      clearTimeout(this.summaryTimer);
    }

    this.summaryTimer = setTimeout(() => {
      this.isUpdatingSummary = false;
      this.summaryTimer = undefined;
    }, 250);
  }

  appendCategory(): void {
    if (this.categories.length >= this.maxCategories) {
      this.crossItemMessages = [`Maksimal ${this.maxCategories} kategori diperbolehkan.`];
      return;
    }

    this.categories.push(this.createCategoryGroup());
    this.runCrossItemValidation();
  }

  removeCategory(categoryIndex: number): void {
    if (!this.isValidCategoryIndex(categoryIndex)) {
      return;
    }

    this.categories.removeAt(categoryIndex);
    this.runCrossItemValidation();
  }

  toggleCategory(category: CategoryGroup): void {
    if (this.collapsedCategories.has(category)) {
      this.collapsedCategories.delete(category);
      return;
    }

    this.collapsedCategories.add(category);
  }

  isCategoryExpanded(category: CategoryGroup): boolean {
    return !this.collapsedCategories.has(category);
  }

  appendExpense(categoryIndex: number): void {
    const category = this.getCategory(categoryIndex);
    if (!category) {
      return;
    }

    this.getExpenses(category).push(this.createExpenseGroup());
    this.runCrossItemValidation();
  }

  removeExpense(categoryIndex: number, expenseIndex: number): void {
    const category = this.getCategory(categoryIndex);
    if (!category) {
      return;
    }

    const expenses = this.getExpenses(category);
    if (expenseIndex < 0 || expenseIndex >= expenses.length) {
      return;
    }

    expenses.removeAt(expenseIndex);
    this.runCrossItemValidation();
  }

  calculateTotalExpenses(): number {
    return this.categories.controls.reduce(
      (categoryTotal, category) =>
        categoryTotal +
        this.getExpenses(category).controls.reduce(
          (expenseTotal, expense) => expenseTotal + Number(expense.controls.amount.value || 0),
          0,
        ),
      0,
    );
  }

  calculateRemainingBudget(): number {
    return this.incomeControl.value - this.calculateTotalExpenses();
  }

  getBudgetStatus(): 'Belum diatur' | 'Aman' | 'Mendekati batas' | 'Melebihi anggaran' {
    if (!this.isBudgetConfigured) {
      return 'Belum diatur';
    }

    if (this.confirmedIncome <= 0 || this.isOverBudget) {
      return 'Melebihi anggaran';
    }

    if (this.confirmedExpenses >= this.confirmedIncome * this.warningThreshold) {
      return 'Mendekati batas';
    }

    return 'Aman';
  }

  getExpenses(category: CategoryGroup): FormArray<ExpenseGroup> {
    return category.controls.expenses;
  }

  getCategoryTotal(category: CategoryGroup): number {
    return this.getExpenses(category).controls.reduce(
      (total, expense) => total + Number(expense.controls.amount.value || 0),
      0,
    );
  }

  getCategoryName(category: CategoryGroup): string {
    return category.controls.name.value.trim() || 'Kategori tanpa nama';
  }

  getCategoryUsagePercent(category: CategoryGroup): number {
    const income = this.incomeControl.value;

    if (income <= 0) {
      return 0;
    }

    return Math.min((this.getCategoryTotal(category) / income) * 100, 100);
  }

  trackByCategory = (index: number, category: CategoryGroup): string => {
    return this.getTrackId(category);
  };

  trackByExpense = (index: number, expense: ExpenseGroup): string => {
    return this.getTrackId(expense);
  };

  showControlError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty);
  }

  resetBudget(): void {
    if (this.summaryTimer !== undefined) {
      clearTimeout(this.summaryTimer);
      this.summaryTimer = undefined;
    }

    this.isUpdatingSummary = false;
    this.budgetForm.reset({ income: 0, categories: [] });
    this.categories.clear();
    this.crossItemMessages = [];
    this.confirmedIncome = 0;
    this.confirmedExpenses = 0;
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();

    if (this.summaryTimer !== undefined) {
      clearTimeout(this.summaryTimer);
    }
  }

  private createCategoryGroup(): CategoryGroup {
    return this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required]),
      expenses: this.formBuilder.array<ExpenseGroup>([this.createExpenseGroup()]),
    });
  }

  private createExpenseGroup(): ExpenseGroup {
    return this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required]),
      amount: this.formBuilder.control(0, [Validators.required, Validators.min(1)]),
    });
  }

  private runCrossItemValidation(): void {
    const messages: string[] = [];
    const categoryNames = new Set<string>();

    this.categories.controls.forEach((category) => {
      const categoryName = category.controls.name.value.trim();
      const normalizedCategoryName = categoryName.toLowerCase();
      if (normalizedCategoryName && categoryNames.has(normalizedCategoryName)) {
        messages.push(`Kategori "${categoryName}" tidak boleh duplikat.`);
        this.addGroupError(category, 'duplicateName');
      } else {
        this.removeGroupError(category, 'duplicateName');
      }
      if (normalizedCategoryName) {
        categoryNames.add(normalizedCategoryName);
      }

      const expenseNames = new Set<string>();
      const expenses = this.getExpenses(category);
      if (expenses.length === 0) {
        messages.push(`Kategori "${this.getCategoryName(category)}" harus memiliki minimal satu item.`);
      }

      expenses.controls.forEach((expense) => {
        const expenseName = expense.controls.name.value.trim();
        const normalizedExpenseName = expenseName.toLowerCase();
        if (normalizedExpenseName && expenseNames.has(normalizedExpenseName)) {
          messages.push(
            `Item "${expenseName}" tidak boleh duplikat dalam kategori yang sama.`,
          );
          this.addGroupError(expense, 'duplicateName');
        } else {
          this.removeGroupError(expense, 'duplicateName');
        }
        if (normalizedExpenseName) {
          expenseNames.add(normalizedExpenseName);
        }
      });
    });

    if (this.totalExpenses > this.incomeControl.value && this.incomeControl.value > 0) {
      messages.push('Total pengeluaran tidak boleh melebihi pendapatan bulanan.');
    }

    this.crossItemMessages = [...new Set(messages)];
  }

  private categoryNamesValidator(): ValidatorFn {
    return (control): ValidationErrors | null => {
      const names = new Set<string>();
      const categoryValues = control.value;
      if (!Array.isArray(categoryValues)) {
        return null;
      }

      const hasDuplicate = categoryValues.some((category) => {
        const normalizedName = String(category?.name ?? '').trim().toLowerCase();
        if (!normalizedName) {
          return false;
        }

        if (names.has(normalizedName)) {
          return true;
        }

        names.add(normalizedName);
        return false;
      });

      return hasDuplicate ? { duplicateCategoryName: true } : null;
    };
  }

  private budgetLimitValidator(): ValidatorFn {
    return (control): ValidationErrors | null => {
      const income = Number(control.get('income')?.value ?? 0);
      const categoryValues = control.get('categories')?.value;
      if (!Array.isArray(categoryValues) || income <= 0) {
        return null;
      }

      const totalExpenses = categoryValues.reduce(
        (categoryTotal, category) =>
          categoryTotal +
          (Array.isArray(category?.expenses)
            ? category.expenses.reduce(
                (expenseTotal: number, expense: { amount?: number }) =>
                  expenseTotal + Number(expense.amount ?? 0),
                0,
              )
            : 0),
        0,
      );

      return totalExpenses > income ? { overBudget: true } : null;
    };
  }

  private addGroupError(control: AbstractControl, key: string): void {
    control.setErrors({ ...(control.errors ?? {}), [key]: true });
  }

  private removeGroupError(control: AbstractControl, key: string): void {
    if (!control.errors?.[key]) {
      return;
    }

    const errors: ValidationErrors = { ...control.errors };
    delete errors[key];
    control.setErrors(Object.keys(errors).length > 0 ? errors : null);
  }

  private getCategory(categoryIndex: number): CategoryGroup | undefined {
    return this.categories.at(categoryIndex);
  }

  private isValidCategoryIndex(categoryIndex: number): boolean {
    return categoryIndex >= 0 && categoryIndex < this.categories.length;
  }

  private getTrackId(control: object): string {
    const existingId = this.trackIds.get(control);
    if (existingId) {
      return existingId;
    }

    const newId = `budget-row-${this.nextTrackId++}`;
    this.trackIds.set(control, newId);
    return newId;
  }
}
