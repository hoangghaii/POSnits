import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Constants} from '../../../../constants/constants';
import {ConfirmModalComponent} from '../../../../core/directives/confirm-modal.component';
import {ModalService, ValidatorService} from '../../../../core/services';
import {TranslateService} from '@ngx-translate/core';
import {TechClassificationService} from '../../../../core/services/apis';

@Component({
  selector: 'app-modal-item-class',
  templateUrl: './modal-item-class.component.html',
  styleUrls: ['./modal-item-class.component.scss']
})
export class ModalItemClassComponent implements OnInit, OnChanges {
  /**
   * Form
   */
  productClassificationForm: FormGroup;
  /**
   * Check validator
   */
  submitted = false;
  public categoryCd = Constants.categoryClass.PRODUCT;
  /**
   * Form map item
   */
  formMap = {
    name: '',

  };
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
          this.productClassificationForm.patchValue({
            id: res[0].id,
            name: res[0].name,

            shopId: res[0].shop_id,

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
    this.translate.get('product-classification').subscribe((trans) => {
      this.formMap.name = trans?.name;
    });

    this.productClassificationForm = this.fb.group({
      shopId: [''],
      id: [''],
      name: ['', [ValidatorService.required, ValidatorService.maxLength(255)]],
      updatedAt: [''],
      sort: [''],
    });
  }

  /**
   * 分類情報フォームコントロールを取得する
   */
  get f() {
    return this.productClassificationForm.controls;
  }

  /**
   * モーダルを閉じる
   */
  closeModal(): void {
    this.submitted = false;
    this.productClassificationForm.reset();
    this.confirm.emit({open: false});
  }

  /**
   * 作成および更新
   */
  handleCreate(): void {
    this.submitted = true;
    if (!this.productClassificationForm.valid) {
      return;
    }

    const obj: any = this.parserObj(this.productClassificationForm.value);

    this.techClassificationService
      .createClass(this.userLogin.shop_id, obj)
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
    if (!this.productClassificationForm.valid) {
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
    const obj: any = this.parserObj(this.productClassificationForm.value);

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
      category_cd: this.categoryCd,
      sort: 0,
      updated_at: obj.updatedAt,
    };
  }
}
