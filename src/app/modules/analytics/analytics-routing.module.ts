import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalyticsMenuComponent } from './analytics-menu/analytics-menu.component';
import { SaleTotalComponent } from './sale-total/sale-total.component';
import { SalesTrendsComponent } from './sales-trends/sales-trends.component';

const routes: Routes = [
  {path: '', component: AnalyticsMenuComponent},
  {path: 'sales-total', component: SaleTotalComponent},
  {path: 'sales-trend', component: SalesTrendsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
