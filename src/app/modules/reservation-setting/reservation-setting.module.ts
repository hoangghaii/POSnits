import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReservableStaffSettingComponent} from './reservable-staff-setting/reservable-staff-setting.component';
import { ReservationSettingRoutingModule } from './reservation-setting-routing.module';
import { ReceptionTimeSettingComponent } from './reception-time-setting/reception-time-setting.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReservationStepComponent } from './component/reservation-step/reservation-step.component';
import { RegularHolidaySettingComponent } from './regular-holiday-setting/regular-holiday-setting.component';
import { HolidaySettingComponent } from './holiday-setting/holiday-setting.component';
import { InformationDisplayComponent } from './information-display/information-display.component';
import { MailCreateModalComponent } from './mail-destination/mail-create-modal/mail-create-modal.component';
import { MailDestinationComponent } from './mail-destination/mail-destination.component';
import { ReceptionSettingComponent } from './reception-setting/reception-setting.component';
import { ReservationCompletionEmailSettingComponent } from './reservation-completion-email-setting/reservation-completion-email-setting.component';
import { TermsPpSettingComponent } from './terms-pp-setting/terms-pp-setting.component';
import { SharedModule } from 'src/app/shared.module';
import { ReceptAmountDayComponent } from './reception-setting/recept-amount-day/recept-amount-day.component';


@NgModule({
  declarations: [
    ReceptionTimeSettingComponent,
    ReservationStepComponent,
    RegularHolidaySettingComponent,
    HolidaySettingComponent,
    ReservationCompletionEmailSettingComponent,
    TermsPpSettingComponent,
    ReceptionSettingComponent,
    MailDestinationComponent,
    MailCreateModalComponent,
    InformationDisplayComponent,
    ReservableStaffSettingComponent,
    ReceptAmountDayComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    ReservationSettingRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ReservationSettingModule { }
