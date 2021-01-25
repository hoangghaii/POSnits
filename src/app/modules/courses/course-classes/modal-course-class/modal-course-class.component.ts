import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ConfirmModalComponent} from 'src/app/core/directives/confirm-modal.component';
import {ModalService, ValidatorService} from 'src/app/core/services';
import {TranslateService} from '@ngx-translate/core';
import {TechClassificationService} from 'src/app/core/services/apis';
import {Constants} from 'src/app/constants/constants';

@Component({
  selector: 'app-modal-course-class',
  templateUrl: './modal-course-class.component.html',
  styleUrls: ['./modal-course-class.component.scss']
})
export class ModalCourseClassComponent implements OnInit, OnChanges {
  public courseClassificationForm: FormGroup;
  public submitted = false;
  public formMap: any;
  @Input() userLogin: any;
  @Input() open: boolean;
  @Input() selectCurrent: any;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;

  /**
   * コンストラクタ
   * @param fb
   * @param modalService
   * @param translate
   * @param techClassificationService
   */
  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private translate: TranslateService,
    private techClassificationService: TechClassificationService
  ) {
  }

  /**
   * ポップアップを変更する
   */
  ngOnChanges(): void {
    if (this.open && this.selectCurrent) {
      this.techClassificationService
        .getClass(
          String(this.selectCurrent.shop_id),
          String(this.selectCurrent.id)
        )
        .subscribe((res: any) => {
          this.courseClassificationForm.patchValue({
            id: res[0].id,
            name: res[0].name,
            shopId: res[0].shop_id,
            sort: res[0].sort,
            updatedAt: res[0].updated_at,
          });
        });
    }

    if (this.open && this.selectCurrent === null) {
      this.initForm();
      this.submitted = false;
    }
  }

  /**
   * 初期表示
   */
  ngOnInit(): void {
    this.initForm();
  }

  /**
   * 初期化フォーム
   */
  initForm(): void {
    this.translate.get('courseClass').subscribe((trans) => {
      this.formMap = {
        name: trans?.courseClassName,
      };
    });
    this.courseClassificationForm = this.fb.group({
      id: [null],
      shopId: [''],
      name: ['', [ValidatorService.required, ValidatorService.maxLength(255)]],
      sort: ['0'],
      updatedAt: [null],
    });
  }

  /**
   * モーダルを閉じる
   */
  closeModal(): void {
    this.submitted = false;
    this.courseClassificationForm.reset();
    this.confirm.emit({open: false});
  }

  /**
   * 作成および更新
   */
  handleCreate(): void {
    this.submitted = true;
    if (!this.courseClassificationForm.valid) {
      return;
    }

    const obj: any = this.parserObj(this.courseClassificationForm.value);

    this.techClassificationService
      .createClass(String(this.userLogin.shop_id), obj)
      .subscribe((res) => {
        this.confirm.emit({open: false, status: 'upCreate'});
        this.translate
          .get('addStaff.staffCreate.registrationHasBeenCompleted')
          .subscribe((msg: string) => {
            this.modalService.open(msg);
          });
      });
  }

  /**
   * 更新
   */
  handleUpdate(): void {
    this.submitted = true;
    if (!this.courseClassificationForm.valid) {
      return;
    }

    this.translate.get('confirm.updateMessage').subscribe((msg: string) => {
      this.confirmModal.prompt(msg, null, true, 'update');
    });
  }

  /**
   * 削除
   */
  handleDelete(): void {
    this.submitted = true;

    this.translate.get('confirm.deleteMessage').subscribe((msg: string) => {
      this.confirmModal.prompt(msg, null, true, 'delete');
    });
  }

  /**
   * 確認を送信
   */
  handleConfirm(event): void {
    const obj: any = this.parserObj(this.courseClassificationForm.value);

    // 更新
    if (event.name === 'update') {
      this.techClassificationService
        .updateClass(
          String(this.userLogin.shop_id),
          String(this.selectCurrent.id),
          obj
        )
        .subscribe((res) => {
          this.confirm.emit({open: false, status: 'upCreate'});
          this.translate
            .get('addStaff.staffCreate.updateHasBeenCompleted')
            .subscribe((msg: string) => {
              this.modalService.open(msg);
            });
        });
    }

    // 削除
    if (event.name === 'delete') {
      this.techClassificationService
        .deleteClass(
          String(this.userLogin.shop_id),
          String(this.selectCurrent.id)
        )
        .subscribe((res) => {
          this.confirm.emit({open: false, status: 'upCreate'});
          this.translate
            .get('addStaff.staffCreate.deletetionHasBeenCompleted')
            .subscribe((msg: string) => {
              this.modalService.open(msg);
            });
        });
    }
  }

  /**
   * オブジェクトの解析
   */
  parserObj(obj: any): object {
    return {
      id: obj.id,
      shop_id: obj.shopId,
      name: obj.name,
      sort: obj.sort,
      category_cd: Constants.categoryClass.COURSE,
      updated_at: obj.updatedAt,
    };
  }

  /**
   * 分類情報フォームコントロールを取得する
   */
  get f() {
    return this.courseClassificationForm.controls;
  }
}
