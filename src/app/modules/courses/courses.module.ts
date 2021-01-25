import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CoursesRoutingModule} from './courses-routing.module';
import {CoursesComponent} from './courses/courses.component';
import {ModalCourseComponent} from './courses/modal-course/modal-course.component';
import {CourseClassesComponent} from './course-classes/course-classes.component';
import {ModalCourseClassComponent} from './course-classes/modal-course-class/modal-course-class.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../../shared.module';
import {ColorPickerModule} from 'ngx-color-picker';
import {DragDropModule} from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [CoursesComponent, ModalCourseComponent, CourseClassesComponent, ModalCourseClassComponent],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    FormsModule,
    ColorPickerModule,
    SharedModule,
    DragDropModule,
    TranslateModule,
    ReactiveFormsModule
  ]
})
export class CoursesModule {
}
