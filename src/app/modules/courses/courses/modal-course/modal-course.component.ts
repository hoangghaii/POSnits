import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ConfirmModalComponent} from 'src/app/core/directives/confirm-modal.component';
import {ColorTypeSetting, RegexValidator} from 'src/app/constants/global-const';
import {Constants} from 'src/app/constants/constants';
import {TranslateService} from '@ngx-translate/core';
import {CoursesService} from 'src/app/core/services/apis';
import {ModalService, ValidatorService} from 'src/app/core/services';

@Component({
  selector: 'app-modal-course',
  templateUrl: './modal-course.component.html',
  styleUrls: ['./modal-course.component.scss']
})
export class ModalCourseComponent implements OnInit, OnChanges {
  @Input() shopId: any;
  @Input() techClassList: any;
  @Input() open: boolean;
  @Input() courseId: any;
  @Input() listTaxes: any;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;

  /**
   * Form
   */
  public addCourseForm: FormGroup;
  /**
   * Check validator
   */
  public submitted = false;
  /**
   * Regex pattern
   */
  public datePattern = RegexValidator.datePattern;
  public numberOnlyRegex = RegexValidator.numberOnlyRegex;

  public monthMenuFlgList = Constants.monthMenuFlg;
  public categoryCd = Constants.categoryClass.COURSE;
  public defaultColor = '';
  public colorValue = '';
  public currentPickedColor = '';
  public presetColors = ColorTypeSetting.defaultColors;
  formMap: object;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private courseService: CoursesService,
    private modalService: ModalService
  ) {
  }

  /**
   * Change popup
   */
  ngOnChanges(): void {
    if (this.courseId !== null && this.open) {
      this.courseService
        .getCourse(this.shopId, this.courseId)
        .subscribe((courseList) => {
          this.addCourseForm.patchValue({
            id: courseList[0].id,
            classId: courseList[0].class_id,
            shopId: this.shopId,
            categoryCd: this.categoryCd,
            name: courseList[0].name,
            treatmentTime: courseList[0].treatment_time,
            bufferTime: courseList[0].buffer_time,
            count: courseList[0].count,
            price: courseList[0].price,
            taxId: courseList[0].tax_id,
            limitDate: courseList[0].limit_date,
            monthMenuFlg: courseList[0].month_menu_flg == '1' ? true : false,
            sort: courseList[0].sort,
            colorCode: courseList[0].color_code,
            updatedAt: courseList[0].updated_at,
          });
          this.currentPickedColor = `#${this.addCourseForm.value.colorCode}`;
        });
    }
    if (this.courseId === null && this.open) {
      this.submitted = false;
      this.initForm();
      this.addCourseForm.controls.taxId.setValue(this.listTaxes[0].id);
      this.currentPickedColor = this.defaultColor;
      this.addCourseForm.patchValue({
        colorCode: this.currentPickedColor,
        categoryCd: this.categoryCd,
        shopId: this.shopId,
      });
    }
  }

  /**
   * コンポーネント初期処理
   */
  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Init form
   */
  initForm(): void {
    this.translate.get('course').subscribe((trans) => {
      this.formMap = {
        name: trans?.courseName,
        classId: trans?.courseClassSelection,
        treatmentTime: trans?.treatmentTime,
        bufferTime: trans?.bufferTime,
        count: trans?.count,
        price: trans?.priceCourse,
        taxId: trans?.taxRate,
        limitDate: trans?.limitDate,
        monthMenuFlg: trans?.monthMenuFlg,
        colorCode: trans?.colorCode,
      };
    });
    this.addCourseForm = this.fb.group({
      id: [null],
      shopId: [''],
      classId: ['', [ValidatorService.selectRequired]],
      categoryCd: [''],
      name: ['', [ValidatorService.required, ValidatorService.maxLength(30)]],
      treatmentTime: [
        '',
        [
          ValidatorService.required,
          ValidatorService.isNumber,
          ValidatorService.maxLength(20),
        ],
      ],
      bufferTime: [
        '',
        [
          ValidatorService.required,
          ValidatorService.isNumber,
          ValidatorService.maxLength(20),
        ],
      ],
      count: [
        '',
        [
          ValidatorService.required,
          ValidatorService.isNumber,
          ValidatorService.maxLength(20),
        ],
      ],
      price: [
        '',
        [
          ValidatorService.required,
          ValidatorService.isNumber,
          ValidatorService.maxLength(20),
        ],
      ],
      taxId: ['', [ValidatorService.selectRequired]],
      sort: [0],
      limitDate: ['', [ValidatorService.isNumber]],
      monthMenuFlg: [false, [ValidatorService.required, ValidatorService.maxLength(1)]],
      colorCode: ['', [ValidatorService.selectRequired]],
      updatedAt: [''],
    });
  }

  /**
   * カラーピッカーから色を取得
   * @param color
   */
  getValueColor(color: any): void {
    this.colorValue = color.replace('#', '');
    this.addCourseForm.controls.colorCode.setValue(this.colorValue);
  }

  /**
   * リセットステータスと現在の選択された色を処理します
   */
  handleResetColor(): void {
    this.currentPickedColor = '';
  }

  /**
   * Close modal
   */
  closeModal(): void {
    this.submitted = false;
    this.addCourseForm.reset();
    this.confirm.emit({open: false});
    this.handleResetColor();
    this.open = false;
  }

  /**
   * Create
   */
  handleCreate(): void {
    this.submitted = true;
    if (!this.addCourseForm.valid) {
      return;
    }
    const obj: any = this.parserObj(this.addCourseForm.value);
    this.courseService
      .createCourse(String(this.shopId), obj)
      .subscribe((res) => {
        this.confirm.emit({open: false, status: 'upCreate'});
        this.translate
          .get('course.courseCreate.registrationHasBeenCompleted')
          .subscribe((msg: string) => {
            this.modalService.open(msg);
          });
      });
  }

  /**
   * Update
   */
  handleUpdate(): void {
    this.submitted = true;
    if (!this.addCourseForm.valid) {
      return;
    }
    this.translate.get('confirm.updateMessage').subscribe((msg: string) => {
      this.confirmModal.prompt(msg, null, true, 'update');
    });
  }

  /**
   * Delete
   */
  handleDelete(): void {
    this.submitted = true;
    this.translate.get('confirm.deleteMessage').subscribe((msg: string) => {
      this.confirmModal.prompt(msg, null, true, 'delete');
    });
  }

  /**
   * Parse obj
   */
  parserObj(obj: any): object {
    return {
      id: obj.id,
      shop_id: obj.shopId,
      class_id: obj.classId,
      category_cd: obj.categoryCd,
      name: obj.name,
      treatment_time: obj.treatmentTime,
      buffer_time: obj.bufferTime,
      count: obj.count,
      price: obj.price,
      tax_id: obj.taxId,
      limit_date: obj.limitDate,
      month_menu_flg: obj.monthMenuFlg ? '1' : '0',
      sort: obj.sort,
      color_code: obj.colorCode.replace('#', ''),
      updated_at: obj.updatedAt,
    };
  }

  /**
   * Emit confirm
   */
  handleConfirm(event): void {
    // Update
    if (event.name === 'update') {
      if (!this.addCourseForm.valid) {
        return;
      }
      const obj: any = this.parserObj(this.addCourseForm.value);
      this.courseService
        .updateCourse(String(this.shopId), String(this.courseId), obj)
        .subscribe((res) => {
          this.confirm.emit({open: false, status: 'upCreate'});
          this.translate
            .get('course.courseCreate.updateHasBeenCompleted')
            .subscribe((msg: string) => {
              this.modalService.open(msg);
            });
        });
    }

    // Delete
    if (event.name === 'delete') {
      this.courseService
        .deleteCourse(String(this.shopId), String(this.addCourseForm.value.id))
        .subscribe((res) => {
          this.confirm.emit({open: false, status: 'upCreate'});
          this.translate
            .get('course.courseCreate.deletetionHasBeenCompleted')
            .subscribe((msg: string) => {
              this.modalService.open(msg);
            });
        });
    }
  }


  /**
   * Get form control
   */
  get f() {
    return this.addCourseForm.controls;
  }

  /**
   * Toggle big list
   */
  toggleBigList(): void {
    const toggle = document.getElementById('toggle-bigList');
    const btnToggle = document.getElementById('btn-toggle-bigList');
    if (toggle.hasAttribute('open')) {
      toggle.removeAttribute('open');
      toggle.classList.remove('animation');
      btnToggle.classList.toggle('animation');
    } else {
      toggle.setAttribute('open', '');
      toggle.classList.toggle('animation');
      btnToggle.classList.toggle('animation');
    }
  }
}
