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

  readonly budgetForm: FormGroup<{
    income: FormControl<number>;
    categories: FormArray<CategoryGroup>;
  }>;

  private readonly formSubscription: Subscription;
  private crossItemMessages: string[] = [];

  constructor(private readonly formBuilder: NonNullableFormBuilder) {
    this.budgetForm = this.formBuilder.group({
      income: this.formBuilder.control(0, [Validators.required, Validators.min(1)]),
      categories: this.formBuilder.array<CategoryGroup>([]),
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

  get remainingBudget(): number {
    return this.calculateRemainingBudget();
  }

  get budgetStatus(): 'Aman' | 'Mendekati batas' | 'Melebihi anggaran' {
    return this.getBudgetStatus();
  }

  get validationMessages(): string[] {
    return this.crossItemMessages;
  }

  get isOverBudget(): boolean {
    return this.totalExpenses > this.incomeControl.value;
  }

  get isIncomeValid(): boolean {
    return this.incomeControl.valid && this.incomeControl.value > 0;
  }

  updateIncome(): void {
    this.incomeControl.markAsTouched();
    this.runCrossItemValidation();
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

  getBudgetStatus(): 'Aman' | 'Mendekati batas' | 'Melebihi anggaran' {
    if (!this.isIncomeValid || this.isOverBudget) {
      return 'Melebihi anggaran';
    }

    if (this.totalExpenses >= this.incomeControl.value * this.warningThreshold) {
      return 'Mendekati batas';
    }

    return 'Aman';
  }

  getExpenses(category: AbstractControl): FormArray<ExpenseGroup> {
    return (category as CategoryGroup).controls.expenses;
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

  trackByCategory(index: number, category: CategoryGroup): string {
    return `${index}-${category.controls.name.value}`;
  }

  trackByExpense(index: number, expense: ExpenseGroup): string {
    return `${index}-${expense.controls.name.value}`;
  }

  showControlError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty);
  }

  resetBudget(): void {
    this.budgetForm.reset({ income: 0, categories: [] });
    this.categories.clear();
    this.crossItemMessages = [];
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
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
      const normalizedCategoryName = category.controls.name.value.trim().toLowerCase();
      if (normalizedCategoryName && categoryNames.has(normalizedCategoryName)) {
        messages.push(`Kategori "${category.controls.name.value}" tidak boleh duplikat.`);
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
        const normalizedExpenseName = expense.controls.name.value.trim().toLowerCase();
        if (normalizedExpenseName && expenseNames.has(normalizedExpenseName)) {
          messages.push(
            `Item "${expense.controls.name.value}" tidak boleh duplikat dalam kategori yang sama.`,
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
}
