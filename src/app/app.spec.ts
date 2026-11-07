import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BudgetPlannerComponent } from './app';

describe('BudgetPlannerComponent', () => {
  let fixture: ComponentFixture<BudgetPlannerComponent>;
  let component: BudgetPlannerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetPlannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts with an empty category state', () => {
    expect(component.hasCategories).toBeFalse();
    expect(component.categories.length).toBe(0);
  });

  it('formats amounts using Indonesian thousands separators', () => {
    expect(component.formatRupiah(3_000_000)).toBe('Rp 3.000.000');
  });

  it('calculates nested expenses and removes an item at its index', () => {
    component.incomeControl.setValue(5_000_000);
    component.appendCategory();
    component.categories.at(0).controls.name.setValue('Kebutuhan Rumah');
    component.getExpenses(component.categories.at(0)).at(0).patchValue({
      name: 'Listrik',
      amount: 500_000,
    });
    component.appendExpense(0);
    component.getExpenses(component.categories.at(0)).at(1).patchValue({
      name: 'Air',
      amount: 200_000,
    });

    expect(component.totalExpenses).toBe(700_000);
    expect(component.remainingBudget).toBe(4_300_000);

    component.removeExpense(0, 0);

    expect(component.totalExpenses).toBe(200_000);
    expect(component.getExpenses(component.categories.at(0)).length).toBe(1);
  });

  it('reports duplicate category names through cross-item validation', () => {
    component.appendCategory();
    component.appendCategory();
    component.categories.at(0).controls.name.setValue('Transportasi');
    component.categories.at(1).controls.name.setValue('transportasi');

    expect(component.validationMessages).toContain(
      'Kategori "transportasi" tidak boleh duplikat.',
    );
  });

  it('keeps equal expenses and income within budget', () => {
    component.incomeControl.setValue(500_000);
    component.appendCategory();
    component.categories.at(0).controls.name.setValue('Rumah');
    component.getExpenses(component.categories.at(0)).at(0).patchValue({
      name: 'Listrik',
      amount: 500_000,
    });

    expect(component.isOverBudget).toBeFalse();
    expect(component.validationMessages).not.toContain(
      'Total pengeluaran tidak boleh melebihi pendapatan bulanan.',
    );
  });

  it('marks the budget form invalid when expenses exceed income', () => {
    component.incomeControl.setValue(100_000);
    component.appendCategory();
    component.categories.at(0).controls.name.setValue('Rumah');
    component.getExpenses(component.categories.at(0)).at(0).patchValue({
      name: 'Belanja',
      amount: 150_000,
    });

    expect(component.budgetForm.invalid).toBeTrue();
    expect(component.budgetForm.errors?.['overBudget']).toBeTrue();
  });

  it('does not enter loading state when submitting an invalid budget', () => {
    component.submitBudget();

    expect(component.isUpdatingSummary).toBeFalse();
    expect(component.incomeControl.touched).toBeTrue();
  });

  it('treats category names with surrounding spaces and case differences as duplicates', () => {
    component.appendCategory();
    component.appendCategory();
    component.categories.at(0).controls.name.setValue('Transportasi');
    component.categories.at(1).controls.name.setValue('  transportasi  ');

    expect(component.validationMessages).toContain(
      'Kategori "  transportasi  " tidak boleh duplikat.',
    );
  });
});
