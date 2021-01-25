import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationTableHomeComponent } from './reservation-table-home/reservation-table-home.component';
import { ReservationHomeComponent } from './reservation-home/reservation-home.component';
import { InputItemSettingComponent } from './input-item-setting/input-item-setting.component';
import { ListOfVisitTodayComponent } from './list-of-visit-today/list-of-visit-today.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';

const routes: Routes = [
  {
    path: '',
    component: ReservationHomeComponent
  },
  {
    path: 'input-item-setting',
    component: InputItemSettingComponent
  },
  {
    path: 'table',
    component: ReservationTableHomeComponent,
  },
  {
    path: 'list-of-visit-today',
    component: ListOfVisitTodayComponent,
  },
  {
    path: 'list-reservation',
    component: ReservationListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservationRoutingModule {
}
