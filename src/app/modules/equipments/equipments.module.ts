import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EquipmentsRoutingModule } from './equipments-routing.module';
import { MenuEquipmentsComponent } from './menu-equipments/menu-equipments.component';
import { EquipmentsComponent } from './equipments/equipments.component';
import { ModalEquipmentComponent } from './equipments/modal-equipment/modal-equipment.component';
import { ModalMenuEquipmentComponent } from './menu-equipments/modal-menu-equipment/modal-menu-equipment.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [MenuEquipmentsComponent, EquipmentsComponent, ModalEquipmentComponent, ModalMenuEquipmentComponent],
  imports: [
    CommonModule,
    EquipmentsRoutingModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    ReactiveFormsModule,
    DragDropModule
  ]
})
export class EquipmentsModule { }
