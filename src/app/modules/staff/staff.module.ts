import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoutingModule } from './staff-routing.module';
import { MenuCooperationStaffComponent } from './menu-cooperation-staff/menu-cooperation-staff.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MenuCooperationStaffPopupComponent } from './menu-cooperation-staff/menu-cooperation-staff-popup/menu-cooperation-staff-popup.component';
import { SharedModule } from 'src/app/shared.module';
import { StaffShiftCalendarComponent } from './components/staff-shift-calendar/staff-shift-calendar.component';
import { StaffShiftRegistrationComponent } from './staff-shift-registration/staff-shift-registration.component';
import { StaffShiftRegistrationDetailComponent } from './staff-shift-registration/staff-shift-registration-detail/staff-shift-registration-detail.component';


@NgModule({
  declarations: [
    MenuCooperationStaffComponent,
    MenuCooperationStaffPopupComponent,
    StaffShiftRegistrationComponent,
    StaffShiftCalendarComponent,
    StaffShiftRegistrationDetailComponent
  ],
  imports: [
    CommonModule,
    StaffRoutingModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  exports: [
    StaffShiftCalendarComponent
  ],
})
export class StaffModule { }
