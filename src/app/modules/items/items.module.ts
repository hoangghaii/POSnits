import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ItemsRoutingModule} from './items-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from 'src/app/shared.module';
import {ColorPickerModule} from 'ngx-color-picker';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ItemsComponent} from './items/items.component';
import {ModalItemComponent} from './items/modal-item/modal-item.component';
import {ItemClassesComponent} from './item-classes/item-classes.component';
import {ModalItemClassComponent} from './item-classes/modal-item-class/modal-item-class.component';

@NgModule({
  declarations: [
    ItemsComponent,
    ModalItemComponent,
    ItemClassesComponent,
    ModalItemClassComponent],
  imports: [
    CommonModule,
    ItemsRoutingModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    ReactiveFormsModule,
    ColorPickerModule,
    DragDropModule,
  ]
})
export class ItemsModule {
}
