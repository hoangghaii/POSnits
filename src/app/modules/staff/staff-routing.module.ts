import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuCooperationStaffComponent } from './menu-cooperation-staff/menu-cooperation-staff.component';
import { StaffShiftRegistrationComponent } from './staff-shift-registration/staff-shift-registration.component';

const routes: Routes = [
  {
    path: 'menu-cooperation-staff',
    component: MenuCooperationStaffComponent
  },
  {
    path: 'staff-shift-registration',
    component: StaffShiftRegistrationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
