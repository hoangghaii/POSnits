import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddStaffRoutingModule } from './add-staff-routing.module';
import { AddStaffComponent } from './add-staff.component';
import { StaffCreateModalComponent } from './staff-create-modal/staff-create-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    AddStaffComponent,
    StaffCreateModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AddStaffRoutingModule,
    TranslateModule,
    SharedModule,
    DragDropModule
  ]
})
export class AddStaffModule { }
