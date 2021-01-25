import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SkillsComponent} from './skills/skills.component';
import {SkillClassesComponent} from './skill-classes/skill-classes.component';

const routes: Routes = [
  {
    path: 'skill-classes',
    component: SkillClassesComponent,
  },
  {
    path: '',
    component: SkillsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsRoutingModule {
}
