import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BudgetSummaryView } from '../budget.types';
import { SummaryPanelComponent } from './summary-panel';

describe('SummaryPanelComponent', () => {
  let fixture: ComponentFixture<SummaryPanelComponent>;

  const summary: BudgetSummaryView = {
    remainingBudgetLabel: 'Rp 4.300.000',
    confirmedIncomeLabel: 'Rp 5.000.000',
    confirmedExpenseLabel: 'Rp 700.000',
    status: 'Aman',
    usagePercent: 14,
    progressWidth: 14,
    usageLabel: '14% dari pendapatan terpakai',
    isConfigured: true,
    statusIcon: '✓',
    isNearLimit: false,
    isOverBudget: false,
    statusDescription: 'Kondisi anggaranmu masih terkendali bulan ini.',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryPanelComponent);
    fixture.componentInstance.summary = summary;
    fixture.detectChanges();
  });

  it('renders the confirmed summary and status', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Rp 4.300.000');
    expect(element.textContent).toContain('Rp 5.000.000');
    expect(element.textContent).toContain('Rp 700.000');
    expect(element.textContent).toContain('Aman');
    expect(element.querySelector('.status-icon')?.textContent?.trim()).toBe('✓');
  });

  it('marks the status panel as a warning when near the limit', () => {
    fixture.componentInstance.summary = {
      ...summary,
      status: 'Mendekati batas',
      statusIcon: '!',
      isNearLimit: true,
      statusDescription: 'Sisakan sedikit ruang untuk kebutuhan tak terduga.',
    };
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.status-panel')?.classList).toContain('status-warning');
    expect(element.querySelector('.status-icon')?.textContent?.trim()).toBe('!');
  });
});
