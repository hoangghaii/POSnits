import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentProcessComponent } from './payment-process/payment-process.component';
import { SharedModule } from 'src/app/shared.module';
import { PaymentsRoutingModule } from './payments-routing.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [PaymentProcessComponent],
  imports: [
    PaymentsRoutingModule,
    CommonModule,
    SharedModule,
    TranslateModule
  ]
})
export class PaymentsModule { }
