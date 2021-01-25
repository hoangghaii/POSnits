import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SetMenusComponent} from './set-menus/set-menus.component';

const routes: Routes = [{
  path: '',
  component: SetMenusComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetMenusRoutingModule {
}
