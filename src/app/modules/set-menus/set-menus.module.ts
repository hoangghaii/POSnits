import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SetMenusRoutingModule} from './set-menus-routing.module';
import {SharedModule} from 'src/app/shared.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ColorPickerModule} from 'ngx-color-picker';
import {SetMenusComponent} from './set-menus/set-menus.component';
import {ModalSetMenuComponent} from './set-menus/modal-set-menu/modal-set-menu.component';


@NgModule({
  declarations: [
    SetMenusComponent,
    ModalSetMenuComponent
  ],
  exports: [],
  imports: [
    CommonModule,
    SetMenusRoutingModule,
    SharedModule,
    DragDropModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule,
  ]
})
export class SetMenusModule {
}
