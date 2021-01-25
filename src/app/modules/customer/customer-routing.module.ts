import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerInfoRegistrationComponent } from './customer-info-registration/customer-info-registration.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerInfoRegistrationComponent,
  },
  {
    path: ':id',
    component: CustomerInfoRegistrationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
