import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CategoryGroup, ExpenseGroup } from '../budget.types';
import { CategoryCardComponent } from './category-card';

describe('CategoryCardComponent', () => {
  let fixture: ComponentFixture<CategoryCardComponent>;
  let category: CategoryGroup;

  const createExpense = (name: string, amount: number): ExpenseGroup =>
    new FormGroup({
      name: new FormControl(name, { nonNullable: true }),
      amount: new FormControl(amount, { nonNullable: true }),
    });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCardComponent],
    }).compileComponents();

    category = new FormGroup({
      name: new FormControl('Rumah', { nonNullable: true }),
      expenses: new FormArray([createExpense('Listrik', 250_000)]),
    });

    fixture = TestBed.createComponent(CategoryCardComponent);
    fixture.componentInstance.category = category;
    fixture.componentInstance.categoryIndex = 0;
    fixture.componentInstance.totalLabel = 'Rp 250.000';
    fixture.componentInstance.usagePercent = 5;
    fixture.componentInstance.canRemoveCategory = true;
    fixture.detectChanges();
  });

  it('renders category details and nested expenses', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Rp 250.000');
    expect(element.textContent).toContain('5% dari pendapatan');
    expect(element.querySelectorAll('.expense-row').length).toBe(1);
    expect((element.querySelector('#category-0') as HTMLInputElement).value).toBe('Rumah');
  });

  it('emits category removal and toggle events', () => {
    const removed: number[] = [];
    const toggled: CategoryGroup[] = [];
    fixture.componentInstance.removeCategory.subscribe((index) => removed.push(index));
    fixture.componentInstance.toggleCategory.subscribe((value) => toggled.push(value));

    const element = fixture.nativeElement as HTMLElement;
    (element.querySelector('[aria-label="Hapus kategori 1"]') as HTMLButtonElement).click();
    (element.querySelector('.category-toggle') as HTMLButtonElement).click();

    expect(removed).toEqual([0]);
    expect(toggled).toEqual([category]);
  });

  it('emits append and remove events for expenses', () => {
    const appended: number[] = [];
    const removed: Array<{ categoryIndex: number; expenseIndex: number }> = [];
    fixture.componentInstance.appendExpense.subscribe((index) => appended.push(index));
    fixture.componentInstance.removeExpense.subscribe((value) => removed.push(value));
    fixture.componentInstance.category.controls.expenses.push(createExpense('Air', 100_000));
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    (element.querySelector('.add-item-button') as HTMLButtonElement).click();
    (
      element.querySelector('[aria-label="Hapus item 1"]') as HTMLButtonElement
    ).click();

    expect(appended).toEqual([0]);
    expect(removed).toEqual([{ categoryIndex: 0, expenseIndex: 0 }]);
  });

  it('disables removing the only expense and shows the required name error', () => {
    const element = fixture.nativeElement as HTMLElement;
    const removeButton = element.querySelector('[aria-label="Hapus item 1"]') as HTMLButtonElement;

    expect(removeButton.disabled).toBeTrue();

    fixture.componentInstance.errorMessage = 'Nama kategori wajib diisi.';
    fixture.detectChanges();

    expect(element.querySelector('#category-0')?.getAttribute('aria-invalid')).toBe('true');
    expect(element.querySelector('#category-error-0')?.textContent).toContain(
      'Nama kategori wajib diisi.',
    );
  });
});
