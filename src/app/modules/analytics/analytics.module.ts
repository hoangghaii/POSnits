import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ChartsModule } from 'ng2-charts';
import { AnalyticsMenuComponent } from './analytics-menu/analytics-menu.component';
import { SaleTotalComponent } from './sale-total/sale-total.component';
import { SalesTrendsComponent } from './sales-trends/sales-trends.component';


@NgModule({
  declarations: [AnalyticsMenuComponent, SaleTotalComponent, SalesTrendsComponent],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    TranslateModule,
    ChartsModule
  ]
})
export class AnalyticsModule { }
