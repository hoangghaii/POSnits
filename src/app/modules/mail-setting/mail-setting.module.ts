import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MailSettingRoutingModule } from './mail-setting-routing.module';
import { MailMenuComponent } from './mail-menu/mail-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { AutomaticMailDeliverySettingComponent } from './automatic-mail-delivery-setting/automatic-mail-delivery-setting.component';


@NgModule({
  declarations: [
    MailMenuComponent,
    AutomaticMailDeliverySettingComponent,
  ],
  imports: [
    CommonModule,
    MailSettingRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    TranslateModule,
  ]
})
export class MailSettingModule { }
