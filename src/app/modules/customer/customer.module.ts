import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerInfoRegistrationComponent } from './customer-info-registration/customer-info-registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { PersonalInfoComponent } from './customer-info-registration/personal-info/personal-info.component';
import { FreeItemsComponent } from './customer-info-registration/free-items/free-items.component';
import { VisitInfoComponent } from './customer-info-registration/visit-info/visit-info.component';
import { ContractInfoComponent } from './customer-info-registration/contract-info/contract-info.component';


@NgModule({
  declarations: [CustomerInfoRegistrationComponent, PersonalInfoComponent, FreeItemsComponent, VisitInfoComponent, ContractInfoComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    TranslateModule,
  ]
})
export class CustomerModule { }
