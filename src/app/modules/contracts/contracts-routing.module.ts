import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ContractEntryComponent} from './contract-entry/contract-entry.component';
import {ContractSelectionComponent} from './contract-selection/contract-selection.component';
import {ContractConfirmComponent} from './contract-confirm/contract-confirm.component';
import {ContractCompleteComponent} from './contract-complete/contract-complete.component';

const routes: Routes = [
  {
    path: '',
    component: ContractEntryComponent,
  },
  {
    path: 'selection',
    component: ContractSelectionComponent
  },
  {
    path: 'confirm',
    component: ContractConfirmComponent,
  },
  {
    path: 'complete',
    component: ContractCompleteComponent,
  }
];
;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractsRoutingModule {
}
