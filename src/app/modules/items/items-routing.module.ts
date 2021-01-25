import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ItemsComponent} from './items/items.component';
import {ItemClassesComponent} from './item-classes/item-classes.component';

const routes: Routes = [
  {
    path: '',
    component: ItemsComponent,
  },
  {
    path: 'item-classes',
    component: ItemClassesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsRoutingModule {
}
