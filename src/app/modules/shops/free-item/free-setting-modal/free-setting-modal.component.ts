import { newArray } from '@angular/compiler/src/util';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmModalComponent } from 'src/app/core/directives/confirm-modal.component';
import { AuthService, ModalService, ValidatorService } from 'src/app/core/services';
import { FreeItemService } from 'src/app/core/services/apis';

@Component({
  selector: 'app-free-setting-modal',
  templateUrl: 'free-setting-modal.component.html',
  styleUrls: ['./free-setting-modal.component.scss'],
})
export class FreeSettingModalComponent implements OnInit, OnChanges {
  /**
   * Form
   */
  formFreeSetting: FormGroup;
  submitted = false;
  formMap
  @Input() open: boolean;
  @Input() discountList: any;
  @Input() selectCurrent: any;
  @Input() userLogin: any;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;

  constructor(
    private fb: FormBuilder,
    private freeItemService: FreeItemService,
    private modalService: ModalService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.translate.get('freeItemSetting').subscribe((trans) => {
      this.formMap = {
        question: trans?.contentsOfQuestion,
      };
    });
    this.formFreeSetting = this.fb.group({
      id: [null],
      companyId: [''],
      htmlType: ['0'],
      multipleFlg: ['1'],
      question: ['', ValidatorService.required],
      answer: this.fb.array([]),
      sort: [0],
      updatedAt: [null],
    });
  }

  /**
   * ポップアップを変更する
   */
  ngOnChanges(): void {
    if (this.open && this.selectCurrent) {
      this.freeItemService
        .getFreeItem(
          String(this.selectCurrent.company_id),
          String(this.selectCurrent.id)
        )
        .subscribe((res: any) => {
          const answerRespond: any[] = res[0].answer
            ? res[0].answer.split(',')
            : null;
          this.formFreeSetting.patchValue({
            id: res[0].id,
            companyId: res[0].company_id,
            htmlType: res[0].html_type,
            multipleFlg: res[0].multiple_flg,
            question: res[0].question,
            sort: res[0].sort,
            updatedAt: res[0].updated_at,
          });

          answerRespond
            ? answerRespond.map((x, i) => {
                this.answer.push(this.newAnwser());
                this.answer.controls[i].setValue(x);
              })
            : false;
        });
    }

    if (this.open && this.selectCurrent === null) {
      this.submitted = false;
      this.initForm();
      let i = 0;
    }
  }

  /**
   * モーダルを閉じる
   */
  closeModal() {
    this.submitted = false;
    this.formFreeSetting.reset();
    this.answer.clear();
    this.confirm.emit({ open: false });
  }

  /**
   * Get form control
   */
  get f() {
    return this.formFreeSetting.controls;
  }

  /**
   * New answer item
   */
  newAnwser(): FormControl {
    return this.fb.control('');
  }

  /**
   * Get answer item
   */
  get answer() {
    return this.formFreeSetting.get('answer') as FormArray;
  }

  /**
   * On add answer
   */
  onAddAnwser() {
    this.formFreeSetting.updateValueAndValidity();
    this.answer.push(this.newAnwser());
  }

  /**
   * Create Free Item
   */
  handleCreate() {
    let obj: any = this.parserObj(this.formFreeSetting.getRawValue());
    this.submitted = true;
    if (!this.formFreeSetting.valid) {
      return;
    }
    this.freeItemService
      .createFreeItem(String(this.userLogin.company_id), obj)
      .subscribe((res) => {
        this.confirm.emit({ open: false, status: 'upCreate' });
        this.translate
          .get('addStaff.staffCreate.registrationHasBeenCompleted')
          .subscribe((msg: string) => {
            this.modalService.open(msg);
            this.initForm();
            this.submitted = false;
          });
      });
  }

  /**
   * Update Free Item
   */
  handleUpdate() {
    this.submitted = true;
    if (!this.formFreeSetting.valid) {
      return;
    }
    this.translate.get('confirm.updateMessage').subscribe((msg: string) => {
      this.confirmModal.prompt(msg, null, true, 'update');
    });
  }

  /**
   * Delete Free Item
   */
  handleDelete() {
    this.translate.get('confirm.deleteMessage').subscribe((msg: string) => {
      this.confirmModal.prompt(msg, null, true, 'delete');
    });
  }

  /**
   * 確認を送信
   */
  handleConfirm(event) {
    const obj: any = this.parserObj(this.formFreeSetting.getRawValue());
    // 更新
    if (event.name === 'update') {
      this.freeItemService
        .updateFreeItem(
          String(this.userLogin.company_id),
          String(this.selectCurrent.id),
          obj
        )
        .subscribe((res) => {
          this.confirm.emit({ open: false, status: 'upCreate' });
          this.translate
            .get('addStaff.staffCreate.updateHasBeenCompleted')
            .subscribe((msg: string) => {
              this.modalService.open(msg);
              this.initForm();
              this.submitted = false;
            });
        });
    }

    // 削除
    if (event.name === 'delete') {
      this.freeItemService
        .deleteFreeItem(
          String(this.userLogin.company_id),
          String(this.selectCurrent.id)
        )
        .subscribe((res) => {
          this.confirm.emit({ open: false, status: 'upCreate' });
          this.translate
            .get('addStaff.staffCreate.deletetionHasBeenCompleted')
            .subscribe((msg: string) => {
              this.modalService.open(msg);
              this.submitted = false;
            });
        });
    }
  }

  /**
   * Convert data
   */
  parserObj(obj: any): object {
    if (!this.selectCurrent) {
      return [
        {
          id: obj.id,
          company_id: this.userLogin.company_id,
          html_type: obj.htmlType,
          multiple_flg: obj.htmlType == '0' ? '0' : obj.multipleFlg,
          question: obj.question,
          answer: obj.htmlType == '0' ? '' : this.formFreeSetting.controls.answer.value.toString(),
          sort: obj.sort,
          updated_at: obj.updatedAt,
        },
      ];
    }
    return [
      {
        id: obj.id,
        company_id: obj.companyId,
        html_type: obj.htmlType,
        multiple_flg: obj.htmlType == '0' ? '0' : obj.multipleFlg,
        question: obj.question,
        answer: obj.htmlType == '0' ? '' : this.formFreeSetting.controls.answer.value.toString(),
        sort: obj.sort,
        updated_at: obj.updatedAt ? obj.updatedAt : null,
      },
    ];
  }

  removeItem(index) {
    this.answer.removeAt(index);
  }

  changeHtmlType() {
    if (this.formFreeSetting.controls.htmlType.value == '0') {
      let i = 3;
      while (i >= 0) {
        this.removeItem(i)
        i--;
      }
    } else {
      let i = 0;
      while (i <= 2) {
        this.onAddAnwser();
        i++;
      }
    }
  }
}
