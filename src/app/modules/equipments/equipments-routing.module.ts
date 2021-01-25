import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MenuEquipmentsComponent} from './menu-equipments/menu-equipments.component';
import {EquipmentsComponent} from './equipments/equipments.component';

const routes: Routes = [
  {
    path: '',
    component: EquipmentsComponent
  },
  {
    path: 'menu-equipments',
    component: MenuEquipmentsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipmentsRoutingModule {
}
