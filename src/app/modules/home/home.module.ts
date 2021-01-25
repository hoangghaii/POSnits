import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { TopComponent } from './top/top.component';
import {TranslateModule} from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared.module';


@NgModule({
  declarations: [TopComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    TranslateModule,
    SharedModule
  ]
})
export class HomeModule { }
