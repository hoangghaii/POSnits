import {OnChanges, ViewChild} from '@angular/core';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {Constants} from 'src/app/constants/constants';
import {RegexValidator} from 'src/app/constants/global-const';
import {ConfirmModalComponent} from 'src/app/core/directives/confirm-modal.component';
import {ValidatorService} from 'src/app/core/services';
import {DiscountService} from 'src/app/core/services/apis';
import {AuthService} from 'src/app/core/services/auth.service';
import {ModalService} from 'src/app/core/services/modal.service';


/**
 * DiscountCreateModalComponent
 * 割引作成モーダルコンポーネント
 */
@Component({
  selector: 'app-discount-create-modal',
  templateUrl: './discount-create-modal.component.html',
  styleUrls: ['./discount-create-modal.component.scss'],
})
export class DiscountCreateModalComponent implements OnInit, OnChanges {
  addDiscount: FormGroup;
  numberOnlyRegex: RegExp = RegexValidator.numberOnlyRegex;
  listDiscountCd: any[] = Constants.listDiscountCd;
  listDiscountType: any[] = Constants.listDiscountType;
  submitted = false;
  userLogin: any;
  /**
   * Form map item
   */
  formMap;
  @Input() open: boolean;
  @Input() discountList: any;
  @Input() selectCurrent: any;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;

  /**
   * コンストラクタ
   * @param fb
   * @param discountService
   * @param modalService
   * @param translate
   * @param authService
   */
  constructor(
    private fb: FormBuilder,
    private discountService: DiscountService,
    private modalService: ModalService,
    private translate: TranslateService,
    private authService: AuthService
  ) {
  }

  /**
   * ポップアップを変更する
   */
  ngOnChanges(): void {
    if (this.open && this.selectCurrent) {
      this.discountService
        .getDiscount(
          String(this.selectCurrent.shop_id),
          String(this.selectCurrent.id)
        )
        .subscribe((res: any) => {
          this.addDiscount.patchValue({
            id: res[0].id,
            name: res[0].name,
            shopId: res[0].shop_id,
            updateAt: res[0].updated_at,
            discountCd: res[0].discount_cd,
            discount: res[0].discount,
            discountType: res[0].discount_type,
            sort: res[0].sort,
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
  async ngOnInit(): Promise<void> {
    this.initForm();
    this.userLogin = await this.authService.getCurrentUser().toPromise();
  }

  /**
   * 初期化フォーム
   */
  initForm(): void {
    this.translate.get('discount').subscribe((trans) => {
      this.formMap = {
        discountCd: trans?.discountCd,
        name: trans?.name,
        discount: trans?.discount,
        discountType: trans?.discountType,
      };
    });
    this.addDiscount = this.fb.group({
      id: [''],
      shopId: [''],
      discountCd: ['', ValidatorService.required],
      name: ['', [ValidatorService.required, ValidatorService.maxLength(10)]],
      discount: [
        '',
        [
          ValidatorService.required,
          ValidatorService.min(1),
          ValidatorService.maxLength(20),
          ValidatorService.isNumber,
        ],
      ],
      discountType: ['1', ValidatorService.required],
      sort: [''],
      updateAt: [''],
    });
  }

  /**
   * フォームフィールドに簡単にアクセスできる便利なゲッター
   */
  get f() {
    return this.addDiscount.controls;
  }

  /**
   * モーダルを閉じる
   */
  closeModal(): void {
    this.submitted = false;
    this.addDiscount.reset();
    this.confirm.emit({open: false});
  }

  /**
   * 確認を送信
   */
  handleConfirm(event): void {
    const obj: any = this.parserObj(this.addDiscount.value);

    // 更新
    if (event.name === 'update') {
      this.discountService.updateDiscount(obj).subscribe((res) => {
        this.confirm.emit({open: false, status: 'upCreate'});
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
      this.discountService
        .deleteDiscount(
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
   * 作成および更新
   */
  handleCreate(): void {
    this.submitted = true;
    if (!this.addDiscount.valid) {
      return;
    }

    const obj: any = this.parserObj(this.addDiscount.value);
    this.discountService.createDiscount(obj).subscribe((res) => {
      this.confirm.emit({open: false, status: 'upCreate'});
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
   * 更新
   */
  handleUpdate(): void {
    this.submitted = true;
    if (!this.addDiscount.valid) {
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
   * オブジェクトの解析
   */
  parserObj(obj: any): object {
    return {
      id: obj.id,
      shop_id: this.userLogin.shop_id,
      discount_cd: obj.discountCd,
      name: obj.name,
      discount_type: obj.discountType,
      discount: obj.discount,
      sort: 0,
      updated_at: obj.updateAt,
    };
  }
}
