import {OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmModalComponent} from 'src/app/core/directives/confirm-modal.component';
import { ValidatorService } from 'src/app/core/services';
import { MailDestinationService } from 'src/app/core/services/apis';
import {AuthService} from 'src/app/core/services/auth.service';
import {ModalService} from 'src/app/core/services/modal.service';

/**
 * MailCreateModalComponent
 * メール作成モーダルコンポーネント
 */
@Component({
  selector: 'app-mail-create-modal',
  templateUrl: './mail-create-modal.component.html',
  styleUrls: ['./mail-create-modal.component.scss']
})
export class MailCreateModalComponent implements OnInit, OnChanges {
  @Input() open: boolean;
  @Input() selectCurrent: any;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);
  @Output() newItemEvent = new EventEmitter<object[]>();
  @Output() statusSelect = new EventEmitter<boolean>();
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;
  public mailDestinationtForm: FormGroup;
  public mail: FormGroup;
  public listMails: FormArray;
  public submitted: boolean = false;
  public userLogin: any;
   /**
   * Form map item
   */
  formMap;
  /**
   * コンストラクタ
   * @param fb
   * @param translate
   * @param modalService
   * @param authService
   */
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private modalService: ModalService,
    private authService: AuthService,
    private mailService: MailDestinationService,
  ) {

  }

  /**
   * ポップアップの変更
   */
  ngOnChanges(): void {
    this.initForm();
    if (this.open == true && this.selectCurrent) {
      this.mailDestinationtForm.patchValue({
        id: this.selectCurrent.id,
        name: this.selectCurrent.name,
        email: this.selectCurrent.email,
        shopId: this.selectCurrent.shop_id,
        updated_at: this.selectCurrent.updated_at,

      });
    }
    if (this.open && this.selectCurrent === null) {

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
  initForm() {
    this.translate.get('mailDestination').subscribe((trans) => {
      this.formMap = {
        name: trans?.name,
        email: trans?.email,
      };
    });
    this.mailDestinationtForm = this.fb.group({
      listMails: this.fb.array([]),
      id: [''],
      name: ['', [ValidatorService.required, ValidatorService.maxLength(30)]],
      email: ['', [ValidatorService.required,ValidatorService.email]],
      updated_at: [''],
      shopId: [''],
    });
  }

  /**
   * フォームフィールドに簡単にアクセスできる便利なゲッター
   */
  get f() {
    return this.mailDestinationtForm.controls;
  }

  /**
   * フォーム配列のフォームグループを初期化します
   */
  createMailForm() {
    this.mail = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.maxLength(30)]],
      email: ['', [Validators.required]],
      updated_at: [''],
      shopId: this.userLogin.shop_id,
    });
    return this.mail;
  }


  /**
   * 確認を送信
   */
  handleConfirm(event) {
    //const obj: any = this.parserObj(this.productForm.value);
    if (event.name === 'update') {
      this.confirm.emit({open: false, status: 'upCreate'});
      this.translate
        .get('addStaff.staffCreate.updateHasBeenCompleted')
        .subscribe((msg: string) => {
          this.modalService.open(msg);
        });
    }
    if (event.name === 'delete') {
      this.confirm.emit({open: false, status: 'upCreate'});
      this.translate
        .get('addStaff.staffCreate.deletetionHasBeenCompleted')
        .subscribe((msg: string) => {
          this.modalService.open(msg);
        });
    }
  }

  /**
   * モーダルを閉じる
   */
  closeModal(): void {
    this.submitted = false;
    this.mailDestinationtForm.reset();
    this.confirm.emit({open: false});
  }

  /**
   * メールグループフォームを自動的に追加
   */
  addMail() {
    this.submitted = false;
    this.listMails = this.mailDestinationtForm.get('listMails') as FormArray;
    this.mailDestinationtForm.updateValueAndValidity();
    this.listMails.push(this.createMailForm());
  }

  /**
   * 削除
   */
  handleDelete() {
    this.submitted = true;
    const obj: any = this.parserObj(this.mailDestinationtForm.value);
    let item = {
      id: obj.id,
      shop_id: obj.shop_id,
      name: obj.name,
      email: obj.email,
      updated_at: obj.updated_at,
    }
    this.mailService.deleteMail(this.userLogin.shop_id,item).subscribe();
    this.translate.get('confirm.deleteMessage').subscribe((msg: string) => {
      this.confirmModal.prompt(msg, null, true, 'delete');
    });
    this.newItemEvent.emit(null);
    this.statusSelect.emit(true);
  }

  /**
   * 作成および更新
   */
  handleCreate() {
    this.submitted = true;
    if (!this.mailDestinationtForm.valid) {
      return;
    }
    const obj: any = this.parserObj(this.mailDestinationtForm.value);

    let mails: any[];
    mails = obj.listMails;
    mails.push({
      id: obj.id,
      shop_id: obj.shop_id,
      name: obj.name,
      email: obj.email,
      updated_at: obj.updated_at,
    })
    let item = {
      id: obj.id,
      shop_id: obj.shop_id,
      name: obj.name,
      email: obj.email,
      updated_at: obj.updated_at,
    }
    this.mailService.createListMailDestination(this.userLogin.shop_id,item).subscribe();
    this.translate
      .get('addStaff.staffCreate.registrationHasBeenCompleted')
      .subscribe((msg: string) => {
        this.confirm.emit({
          open: false,
          status: 'upCreate',
        });
        this.modalService.open(msg);
      });
    this.newItemEvent.emit(mails);
  }

  /**
   * 更新
   */
  handleUpdate() {
    this.submitted = true;
    if (!this.mailDestinationtForm.valid) {
      return;
    }
    const obj: any = this.parserObj(this.mailDestinationtForm.value);
    let item = {
      id: obj.id,
      shop_id: obj.shop_id,
      name: obj.name,
      email: obj.email,
      updated_at: obj.updated_at,
    }
    this.mailService.updateMail(this.userLogin.shop_id,item).subscribe();
    this.newItemEvent.emit(obj);
    this.statusSelect.emit(false);
    this.translate.get('confirm.updateMessage').subscribe((msg: string) => {
      this.confirmModal.prompt(msg, null, true, 'update');
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
      email: obj.email,
      updated_at: obj.updated_at,
      listMails: obj.listMails
    };
  }
}
