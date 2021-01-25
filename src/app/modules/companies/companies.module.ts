import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesComponent } from './companies.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [CompaniesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    CompaniesRoutingModule,
    TranslateModule
  ]
})
export class CompaniesModule {
}
