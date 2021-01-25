import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CouponsRoutingModule} from './coupons-routing.module';
import {CouponsComponent} from './coupons/coupons.component';
import {SharedModule} from '../../shared.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import {CouponModalComponent} from './coupons/coupon-modal/coupon-modal.component';


@NgModule({
  declarations: [CouponsComponent, CouponModalComponent],
  imports: [
    CommonModule,
    CouponsRoutingModule,
    SharedModule,
    DragDropModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule,
  ]
})
export class CouponsModule {
}
