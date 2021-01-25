import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutomaticMailDeliverySettingComponent } from './automatic-mail-delivery-setting/automatic-mail-delivery-setting.component';
import { MailMenuComponent } from './mail-menu/mail-menu.component';

const routes: Routes = [
  { path: '', component: MailMenuComponent },
  { path: 'auto-mails', component: AutomaticMailDeliverySettingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailSettingRoutingModule { }
