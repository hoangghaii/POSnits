import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ContractsRoutingModule} from './contracts-routing.module';
import {ContractEntryComponent} from './contract-entry/contract-entry.component';
import {ContractSelectionComponent} from './contract-selection/contract-selection.component';
import {ContractConfirmComponent} from './contract-confirm/contract-confirm.component';
import {ContractCompleteComponent} from './contract-complete/contract-complete.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared.module';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  declarations: [
    ContractEntryComponent,
    ContractSelectionComponent,
    ContractConfirmComponent,
    ContractCompleteComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    TranslateModule,
    ContractsRoutingModule
  ]
})
export class ContractsModule {
}
