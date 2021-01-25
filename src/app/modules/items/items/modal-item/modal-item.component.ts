import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Constants} from '../../../../constants/constants';
import {Tax, TechClassification} from '../../../../core/models';
import {ConfirmModalComponent} from '../../../../core/directives/confirm-modal.component';
import {AuthService, ModalService, ValidatorService} from '../../../../core/services';
import {TranslateService} from '@ngx-translate/core';
import {ProductService, TaxService, TechClassificationService} from '../../../../core/services/apis';
import {RegexValidator} from '../../../../constants/global-const';

@Component({
  selector: 'app-modal-item',
  templateUrl: './modal-item.component.html',
  styleUrls: ['./modal-item.component.scss']
})
export class ModalItemComponent implements OnInit, OnChanges {
  public productForm: FormGroup;
  public numberOnlyRegex: RegExp;
  public submitted = false;
  public categoryCd = Constants.categoryClass.PRODUCT;
  public listTaxes: Tax[];
  public listClass: TechClassification[];
  public userLogin: any;
  /**
   * Form map item
   */
  formMap;
  @Input() open: boolean;
  @Input() selectCurrent: any;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;

  /**
   * コンストラクタ
   * @param fb
   * @param modalService
   * @param translate
   * @param productService
   * @param taxService
   * @param techClassService
   * @param authService
   */
  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private translate: TranslateService,
    private productService: ProductService,
    private taxService: TaxService,
    private techClassService: TechClassificationService,
    private authService: AuthService
  ) {
  }

  /**
   * ポップアップの変更
   */
  ngOnChanges(): void {
    if (this.open && this.selectCurrent) {
      this.productForm.patchValue({
        id: this.selectCurrent.id,
        name: this.selectCurrent.name,
        shopId: this.selectCurrent.shop_id,
        updatedAt: this.selectCurrent.updated_at,
        classId: this.selectCurrent.class_id,
        usedDate: this.selectCurrent.used_date,
        taxId: this.selectCurrent.tax_id,
        price: this.selectCurrent.price,
        sort: this.selectCurrent.sort,
      });
    }

    if (this.open && this.selectCurrent === null) {
      this.initForm();
      this.productForm.controls.taxId.setValue(this.listTaxes[0].id);
      this.submitted = false;
    }
  }

  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void> {
    this.initForm();
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.listTaxes = await this.getTaxList();
    this.listClass = await this.getClasses();
    this.numberOnlyRegex = RegexValidator.numberOnlyRegex;
  }

  /**
   * 税金リストを取得する
   */
  async getTaxList(): Promise<Tax[]> {
    return await this.taxService.getTaxList(this.userLogin.shop_id).toPromise();
  }

  /**
   * クラスを取得する
   */
  async getClasses(): Promise<any[]> {
    return await this.techClassService
      .getClasses(this.userLogin.shopId, this.categoryCd)
      .toPromise();
  }

  /**
   * 初期化フォーム
   */
  initForm() {
    this.translate.get('product').subscribe((trans) => {
      this.formMap = {
        name: trans?.nameProduct,
        classId: trans?.classIdForProduct,
        price: trans?.priceProduct,
        usedDate: trans?.usedDateProduct,
        taxId: trans?.taxId
      };
    });
    this.productForm = this.fb.group({
      id: [''],
      classId: ['', [ValidatorService.required]],
      name: ['', [ValidatorService.required, ValidatorService.maxLength(30)]],
      price: [
        '',
        [
          ValidatorService.required,
          ValidatorService.maxLength(20),
          ValidatorService.isNumber,
        ],
      ],
      usedDate: [
        '',
        [
          ValidatorService.maxLength(20),
          ValidatorService.isNumber,
        ],
      ],
      taxId: ['', [ValidatorService.required, ValidatorService.maxLength(20)]],
      sort: ['0', [ValidatorService.required, ValidatorService.maxLength(11)]],
      updatedAt: new FormControl(''),
    });
  }

  /**
   * フォームフィールドに簡単にアクセスできる便利なゲッター
   */
  get f() {
    return this.productForm.controls;
  }

  /**
   * モーダルを閉じる
   */
  closeModal(): void {
    this.submitted = false;
    this.productForm.reset();
    this.confirm.emit({ open: false });
  }

  /**
   * 作成および更新
   */
  handleCreate(): void {
    this.submitted = true;
    if (!this.productForm.valid) {
      return;
    }

    const obj: any = this.parserObj(this.productForm.value);

    this.productService
      .createItem(obj, this.userLogin.shop_id)
      .subscribe((res) => {
        this.confirm.emit({ open: false, status: 'upCreate' });
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
    if (!this.productForm.valid) {
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
    const obj: any = this.parserObj(this.productForm.value);

    // 更新
    if (event.name === 'update') {
      this.productService
        .updateItem(String(this.userLogin.shop_id), obj)
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
      this.productService
        .deleteItem(
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

  /**
   * オブジェクトの解析
   */
  parserObj(obj: any): object {
    return {
      id: obj.id,
      shop_id: this.userLogin.shop_id,
      class_id: obj.classId,
      name: obj.name,
      category_cd: this.categoryCd,
      used_date: obj.usedDate,
      tax_id: obj.taxId,
      price: obj.price,
      sort: 0,
      updated_at: obj.updatedAt,
    };
  }
}
