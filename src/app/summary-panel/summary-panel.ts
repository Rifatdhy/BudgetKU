import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BudgetSummaryView } from '../budget.types';

@Component({
  selector: 'app-summary-panel',
  imports: [CommonModule],
  templateUrl: './summary-panel.html',
})
export class SummaryPanelComponent {
  @Input({ required: true }) summary!: BudgetSummaryView;
}
