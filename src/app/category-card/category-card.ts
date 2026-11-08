import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, ReactiveFormsModule } from '@angular/forms';
import {
  AmountInputEvent,
  CategoryGroup,
  ExpenseGroup,
  ExpenseRemoval,
} from '../budget.types';

@Component({
  selector: 'app-category-card',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-card.html',
})
export class CategoryCardComponent {
  @Input({ required: true }) category!: CategoryGroup;
  @Input() categoryIndex = 0;
  @Input() expanded = true;
  @Input() totalLabel = 'Rp 0';
  @Input() usagePercent = 0;
  @Input() positionHint = '';
  @Input() canRemoveCategory = false;
  @Input() errorMessage = '';

  @Output() readonly removeCategory = new EventEmitter<number>();
  @Output() readonly toggleCategory = new EventEmitter<CategoryGroup>();
  @Output() readonly appendExpense = new EventEmitter<number>();
  @Output() readonly removeExpense = new EventEmitter<ExpenseRemoval>();
  @Output() readonly amountInput = new EventEmitter<AmountInputEvent>();
  @Output() readonly amountFocus = new EventEmitter<FocusEvent>();

  private readonly trackIds = new WeakMap<object, string>();
  private nextTrackId = 0;

  get expenses(): FormArray<ExpenseGroup> {
    return this.category.controls.expenses;
  }

  get categoryName(): string {
    return this.category.controls.name.value.trim() || 'Kategori tanpa nama';
  }

  get toggleText(): string {
    return this.expanded ? 'Tutup' : 'Lihat detail';
  }

  get toggleAriaLabel(): string {
    return `${this.toggleText} ${this.categoryName}`;
  }

  get categoryErrorId(): string | null {
    return this.errorMessage ? `category-error-${this.categoryIndex}` : null;
  }

  expenseNameErrorId(expenseIndex: number): string | null {
    return this.showError(this.expenses.at(expenseIndex).controls.name)
      ? `expense-name-error-${this.categoryIndex}-${expenseIndex}`
      : null;
  }

  expenseAmountErrorId(expenseIndex: number): string | null {
    return this.showError(this.expenses.at(expenseIndex).controls.amount)
      ? `expense-amount-error-${this.categoryIndex}-${expenseIndex}`
      : null;
  }

  showError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty);
  }

  canRemoveExpense(expenseLast: boolean): boolean {
    return !(expenseLast && this.expenses.length === 1);
  }

  expenseNamePlaceholder(expenseFirst: boolean): string {
    return expenseFirst ? 'Contoh: Belanja mingguan' : 'Nama pengeluaran';
  }

  trackByExpense = (index: number, expense: ExpenseGroup): string => {
    return this.getTrackId(expense);
  };

  private getTrackId(control: object): string {
    const existing = this.trackIds.get(control);

    if (existing) {
      return existing;
    }

    this.nextTrackId += 1;
    const id = `expense-${this.nextTrackId}`;
    this.trackIds.set(control, id);
    return id;
  }
}
