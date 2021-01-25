import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReservationRoutingModule} from './reservation-routing.module';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from 'src/app/shared.module';
import {ReservationTableHomeComponent} from './reservation-table-home/reservation-table-home.component';
import {ReservationTableTabComponent} from './components/reservation-table-tab/reservation-table-tab.component';
import {WeekComponent} from './reservation-table-home/week/week.component';
import {DayComponent} from './reservation-table-home/day/day.component';
import {MonthComponent} from './reservation-table-home/month/month.component';
import {ReservationHomeComponent} from './reservation-home/reservation-home.component';
import { InputItemSettingComponent } from './input-item-setting/input-item-setting.component';
import { ListOfVisitTodayComponent } from './list-of-visit-today/list-of-visit-today.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
@NgModule({
  declarations: [
    ReservationTableHomeComponent,
    ReservationTableTabComponent,
    WeekComponent,
    DayComponent,
    MonthComponent,
    ReservationHomeComponent,
    InputItemSettingComponent,
    ListOfVisitTodayComponent,
    ReservationListComponent
  ],
  imports: [
    CommonModule,
    ReservationRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    DragDropModule,
    TranslateModule,
  ],
  exports: [],
})
export class ReservationModule {
}
