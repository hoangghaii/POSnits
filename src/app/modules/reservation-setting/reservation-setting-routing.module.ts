import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HolidaySettingComponent } from './holiday-setting/holiday-setting.component';
import { InformationDisplayComponent } from './information-display/information-display.component';
import { MailDestinationComponent } from './mail-destination/mail-destination.component';
import { ReceptionSettingComponent } from './reception-setting/reception-setting.component';
import { ReceptionTimeSettingComponent } from './reception-time-setting/reception-time-setting.component';
import { RegularHolidaySettingComponent } from './regular-holiday-setting/regular-holiday-setting.component';
import { ReservableStaffSettingComponent } from './reservable-staff-setting/reservable-staff-setting.component';
import { ReservationCompletionEmailSettingComponent } from './reservation-completion-email-setting/reservation-completion-email-setting.component';
import { TermsPpSettingComponent } from './terms-pp-setting/terms-pp-setting.component';

const routes: Routes = [
  {
    path: 'step-1',
    component: ReceptionTimeSettingComponent
  },
  {
    path: 'step-2',
    component: ReceptionSettingComponent,
  },
  {
    path: 'step-3',
    component: ReservableStaffSettingComponent,
  },
  {
    path: 'step-4',
    component: RegularHolidaySettingComponent,
  },
  {
    path: 'step-5',
    component: HolidaySettingComponent,
  },
  {
    path: 'step-6',
    component: TermsPpSettingComponent,
  },
  {
    path: 'step-7',
    component: ReservationCompletionEmailSettingComponent,
  },
  {
    path: 'step-8',
    component: MailDestinationComponent,
  },
  {
    path: 'step-9',
    component: InformationDisplayComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationSettingRoutingModule { }
