import {SendMailComponent} from './send-mail/send-mail.component';
import {BasicShiftComponent} from './basic-shift/basic-shift.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DiscountComponent} from './discount/discount.component';
import {StoreComponent} from './store/store.component';
import {PaymentComponent} from './payment/payment.component';
import {FreeItemComponent} from './free-item/free-item.component';
import {AccountingConfirmationComponent} from './accounting-confirmation/accounting-confirmation.component';
import {AccountingCustodyComponent} from './accounting-custody/accounting-custody.component';
import {ConversionSettingsComponent} from './conversion-settings/conversion-settings.component';
import {AccountingCompletedComponent} from './accounting-completed/accounting-completed.component';
import {SearchHistoryComponent} from './search-history/search-history.component';
import {CustomerInfoComponent} from './customer-info/customer-info.component';
import {AccountingInputComponent} from './accounting-input/accounting-input.component';
import { ConditionalSearchComponent } from './conditional-search/conditional-search.component';
import { ListResultComponent } from './list-result/list-result.component';
import { ServiceRemainingListComponent } from './service-remaining-list/service-remaining-list.component';

const routes: Routes = [
  {
    path: '',
    component: StoreComponent,
  },
  {
    path: 'discount',
    component: DiscountComponent,
  },
  {
    path: 'payment',
    component: PaymentComponent,
  },
  {
    path: 'customer-info',
    component: CustomerInfoComponent,
  },
  {
    path: 'basic-shift',
    component: BasicShiftComponent,
  },
  {
    path: 'free-item',
    component: FreeItemComponent,
  },
  {
    path: 'accounting-confirmation',
    component: AccountingConfirmationComponent
  },
  {
    path: 'accounting-custody',
    component: AccountingCustodyComponent,
  },
  {
    path: 'conversion-settings',
    component: ConversionSettingsComponent,
  },
  {
    path: 'accounting-completed',
    component: AccountingCompletedComponent
  },
  {
    path: 'search-history',
    component: SearchHistoryComponent,
  },
  {
    path: 'send-mail',
    component: SendMailComponent,
  },
  {
    path: 'accounting-input',
    component: AccountingInputComponent
  },
  {
    path: 'conditional-search',
    component: ConditionalSearchComponent,
  },
  {
    path: 'list-result',
    component: ListResultComponent,
  },
  {
    path: 'service-remaining',
    component: ServiceRemainingListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopsRoutingModule {
}
