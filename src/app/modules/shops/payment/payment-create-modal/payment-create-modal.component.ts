import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmModalComponent } from 'src/app/core/directives/confirm-modal.component';
import { ValidatorService } from 'src/app/core/services';
import { PaymentService } from 'src/app/core/services/apis/payment.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalService } from 'src/app/core/services/modal.service';

/**
 * PaymentCreateModalComponent
 * 支払い作成モーダルコンポーネント
 */
@Component({
  selector: 'app-payment-create-modal',
  templateUrl: './payment-create-modal.component.html',
  styleUrls: ['./payment-create-modal.component.scss'],
})
export class PaymentCreateModalComponent implements OnInit, OnChanges {
  @Input() open: boolean;
  @Input() selectCurrent: any;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;

  public submitted = false;
  public paymentForm: FormGroup;
  public userLogin: any;
 /**
   * Form map item
   */
  formMap;
  /**
   * コンストラクタ
   * @param fb
   * @param paymentService
   * @param modalService
   * @param translate
   * @param authService
   */
  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private modalService: ModalService,
    private translate: TranslateService,
    private authService: AuthService
  ) {}

  /**
   * ポップアップの変更
   */
  ngOnChanges(): void {
    if (this.open && this.selectCurrent) {
      this.paymentService
        .getPayment(
          String(this.selectCurrent.shop_id),
          String(this.selectCurrent.id)
        )
        .subscribe((res: any) => {
          this.paymentForm.patchValue({
            id: res[0].id,
            name: res[0].name,
            shopId: res[0].shop_id,
            updatedAt: res[0].updated_at,
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
   * モーダルを閉じる
   */
  closeModal() {
    this.submitted = false;
    this.paymentForm.reset();
    this.confirm.emit({ open: false });
  }

  /**
   * 初期化フォーム
   */
  initForm() {
    this.translate.get('payment').subscribe((trans) => {
      this.formMap = {
        name: trans?.payment,
      };
    });
    this.paymentForm = this.fb.group({
      id: [''],
      name: ['', [ValidatorService.required, ValidatorService.maxLength(30)]],
      updatedAt: [''],
    });
  }

  /**
   * フォームフィールドに簡単にアクセスできる便利なゲッター
   */
  get f() {
    return this.paymentForm.controls;
  }

  /**
   * 作成および更新
   */
  handleCreate() {
    this.submitted = true;
    if (!this.paymentForm.valid) {
      return;
    }
    const list = [];
    const obj: any = this.parserObj(this.paymentForm.value);
    list.push(obj);
    this.paymentService
      .createPayment(this.userLogin.shop_id, list)
      .subscribe((res) => {
        this.translate
          .get('addStaff.staffCreate.registrationHasBeenCompleted')
          .subscribe((msg: string) => {
            this.confirm.emit({
              open: false,
              status: 'upCreate',
            });
            this.modalService.open(msg);
          });
        this.initForm();
        this.submitted = false;
      });
  }

  /**
   * オブジェクトの解析
   */
  parserObj(obj: any): object {
    return {
      id: obj.id,
      shop_id: this.userLogin.shop_id,
      name: obj.name,
      updated_at: obj.updatedAt,
    };
  }

  /**
   * 更新
   */
  handleUpdate(): void {
    this.submitted = true;
    if (!this.paymentForm.valid) {
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
  handleConfirm(event) {
    const obj: any = this.parserObj(this.paymentForm.value);
    // 更新
    const list = [];
    list.push(obj)
    if (event.name === 'update') {
      this.paymentService
        .updatePayment(String(this.userLogin.shop_id), list)
        .subscribe((res) => {
          this.confirm.emit({ open: false, status: 'upCreate' });
          this.translate
            .get('addStaff.staffCreate.updateHasBeenCompleted')
            .subscribe((msg: string) => {
              this.modalService.open(msg);
            });
        });
    }

    // 削除
    if (event.name === 'delete') {
      this.paymentService
        .deletePayment(
          String(this.userLogin.shop_id),
          String(this.selectCurrent.id)
        )
        .subscribe((res) => {
          this.confirm.emit({ open: false, status: 'upCreate' });
          this.translate
            .get('addStaff.staffCreate.deletetionHasBeenCompleted')
            .subscribe((msg: string) => {
              this.modalService.open(msg);
            });
        });
    }
  }
}
