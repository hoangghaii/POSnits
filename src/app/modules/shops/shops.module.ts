import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerModule } from 'ngx-color-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ShopsRoutingModule } from './shops-routing.module';
import { StoreComponent } from './store/store.component';
import { DiscountComponent } from './discount/discount.component';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared.module';
import { PaymentComponent } from './payment/payment.component';
import { DiscountCreateModalComponent } from './discount/discount-create-modal/discount-create-modal.component';
import { PaymentCreateModalComponent } from './payment/payment-create-modal/payment-create-modal.component';
import { FreeSettingModalComponent } from './free-item/free-setting-modal/free-setting-modal.component';
import { BasicShiftComponent } from './basic-shift/basic-shift.component';
import { BasicShiftCreateModalComponent } from './basic-shift/basic-shift-create-modal/basic-shift-create-modal.component';
import { FreeItemComponent } from './free-item/free-item.component';
import { AccountingConfirmationComponent } from './accounting-confirmation/accounting-confirmation.component';
import { AccountingCustodyComponent } from './accounting-custody/accounting-custody.component';
import { ConversionSettingsComponent } from './conversion-settings/conversion-settings.component';
import { ConversionRegistrationModalComponent } from './conversion-settings/conversion-registration-modal/conversion-registration-modal.component';
import { AccountingCompletedComponent } from './accounting-completed/accounting-completed.component';
import { SearchHistoryComponent } from './search-history/search-history.component';
import { SendMailComponent } from './send-mail/send-mail.component';
import { AccountingInputComponent } from './accounting-input/accounting-input.component';
import { AccountingInputPopupComponent } from './accounting-input/accounting-input-popup/accounting-input-popup.component';
import { ConditionalSearchComponent } from './conditional-search/conditional-search.component';
import { ListResultComponent } from './list-result/list-result.component';
import { ServiceRemainingListComponent } from './service-remaining-list/service-remaining-list.component';
import { ChartsModule } from 'ng2-charts';
import { SendMailPreviewComponent } from './send-mail/send-mail-preview/send-mail-preview.component';
@NgModule({
  declarations: [
    StoreComponent,
    DiscountComponent,
    CustomerInfoComponent,
    PaymentComponent,
    DiscountCreateModalComponent,
    PaymentCreateModalComponent,
    FreeItemComponent,
    FreeSettingModalComponent,
    BasicShiftComponent,
    BasicShiftCreateModalComponent,
    AccountingConfirmationComponent,
    AccountingCustodyComponent,
    ConversionSettingsComponent,
    ConversionRegistrationModalComponent,
    AccountingCompletedComponent,
    SearchHistoryComponent,
    SendMailComponent,
    AccountingInputComponent,
    AccountingInputPopupComponent,
    ListResultComponent,
    ConditionalSearchComponent,
    ServiceRemainingListComponent,
    SendMailPreviewComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ShopsRoutingModule,
    ColorPickerModule,
    SharedModule,
    DragDropModule,
    TranslateModule,
    ChartsModule
  ],
})
export class ShopsModule {}
