import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HeaderComponent} from './core/components/parts/header/header.component';
import {FooterComponent} from './core/components/parts/footer/footer.component';
import {ErrorComponent} from './core/components/parts/error/error.component';
import {ShowErrorsComponent} from './core/components/parts/show-errors/show-errors.component';
import {MenuComponent} from './core/components/parts/menu/menu.component';
import {SpMenuComponent} from './core/components/parts/sp-menu/sp-menu.component';
import {LoaderComponent} from './core/components/parts/loader/loader.component';
import {ModalComponent} from './core/directives/modal.component ';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {ConfirmModalComponent} from './core/directives/confirm-modal.component';
import {ConfirmPopupComponent} from './core/components/parts/confirm-popup/confirm-popup.component';
import {TopErrorComponent} from './core/components/parts/top-error/top-error.component';
import {SearchPopupComponent} from './core/components/parts/search-popup/search-popup.component';
import {ReservationDetailsModalComponent} from './core/components/parts/reservation-details-modal/reservation-details-modal.component';
import {TypeOfPipe} from './core/utils/typeof.pipe';
import {RegistrationComponent} from './core/components/parts/registration/registration.component';
import {SelectMenuComponent} from './core/components/parts/registration/select-menu/select-menu.component';
import {CustomerListComponent} from './core/components/parts/customer-list/customer-list.component';
import {UploadFileComponent} from './core/components/parts/upload-file/upload-file.component';
import {MenuRegistrationCreateModalComponent} from './core/components/parts/menu-registration-create-modal/menu-registration-create-modal.component';
import {MenuRegistrationDropdownComponent} from './core/components/parts/menu-registration-create-modal/menu-registration-dropdown/menu-registration-dropdown.component';
import {MenuRegistrationDropdownItemComponent} from './core/components/parts/menu-registration-create-modal/menu-registration-dropdown/menu-registration-dropdown-item/menu-registration-dropdown-item.component';
import {ReservationCalendarComponent} from './core/components/parts/reservation-calendar/reservation-calendar.component';
import {MenuItemsComponent} from './core/components/parts/menu-items/menu-items.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ErrorComponent,
    ShowErrorsComponent,
    MenuComponent,
    SpMenuComponent,
    ModalComponent,
    LoaderComponent,
    ConfirmModalComponent,
    ConfirmPopupComponent,
    TopErrorComponent,
    SearchPopupComponent,
    ReservationDetailsModalComponent,
    TypeOfPipe,
    SelectMenuComponent,
    RegistrationComponent,
    CustomerListComponent,
    UploadFileComponent,
    MenuRegistrationCreateModalComponent,
    MenuRegistrationDropdownComponent,
    MenuRegistrationDropdownItemComponent,
    ReservationCalendarComponent,
    MenuItemsComponent
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, TranslateModule, RouterModule],
  exports: [
    HeaderComponent,
    FooterComponent,
    ErrorComponent,
    ShowErrorsComponent,
    MenuComponent,
    SpMenuComponent,
    ModalComponent,
    LoaderComponent,
    ConfirmModalComponent,
    ConfirmPopupComponent,
    TopErrorComponent,
    SearchPopupComponent,
    ReservationDetailsModalComponent,
    RegistrationComponent,
    SelectMenuComponent,
    CustomerListComponent,
    UploadFileComponent,
    MenuRegistrationCreateModalComponent,
    MenuRegistrationDropdownComponent,
    MenuRegistrationDropdownItemComponent,
    ReservationCalendarComponent,
    MenuItemsComponent
  ],
  entryComponents: [ModalComponent],
  providers: [],
})
export class SharedModule {
}
