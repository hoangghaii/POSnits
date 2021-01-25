import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SkillsRoutingModule} from './skills-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from 'src/app/shared.module';
import {ColorPickerModule} from 'ngx-color-picker';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {SkillsComponent} from './skills/skills.component';
import {ModalSkillComponent} from './skills/modal-skill/modal-skill.component';
import {SkillClassesComponent} from './skill-classes/skill-classes.component';
import {ModalSkillClassComponent} from './skill-classes/modal-skill-class/modal-skill-class.component';


@NgModule({
  declarations: [
    SkillsComponent,
    ModalSkillComponent,
    SkillClassesComponent,
    ModalSkillClassComponent,

  ],
  imports: [
    CommonModule,
    SkillsRoutingModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    ReactiveFormsModule,
    ColorPickerModule,
    SharedModule,
    DragDropModule,
  ]
})
export class SkillsModule {
}
