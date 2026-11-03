import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { BudgetPlannerComponent } from './app/app';

bootstrapApplication(BudgetPlannerComponent, appConfig)
  .catch((err) => console.error(err));
