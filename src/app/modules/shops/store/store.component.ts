import {StoreService} from 'src/app/core/services/apis/store.service';
import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Constants} from 'src/app/constants/constants';
import {CommonServicesService} from 'src/app/core/services/common-services.service';
import {RegexValidator} from 'src/app/constants/global-const';
import {Helper} from 'src/app/core/utils/helper';
import {fadeAnimation} from 'src/app/constants/animation';
import {AuthService} from 'src/app/core/services/auth.service';
import {ModalService} from 'src/app/core/services/modal.service';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmModalComponent} from 'src/app/core/directives/confirm-modal.component';
import {ViewChild} from '@angular/core';
import {ValidatorService} from 'src/app/core/services';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
  animations: [fadeAnimation],
})
/**
 * 店舗情報Component
 * ログインコンポーネント
 */
export class StoreComponent implements OnInit,OnChanges {
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;
  // public helper = Helper;
  public openingTimeList: any[] = Helper.generateTimeForShop(24);
  public closingTimeList: any[] = Helper.generateTimeForShop(24);
  public breakTimeList: any[] = Constants.breakTimeList;
  public facilities: any[] = Constants.facilities;
  public zipcode01: string = '';
  public zipcode02: string = '';
  public strLocation: string = '';
  public listLocality: any[] = [];
  public listLocalityGot: any[] = [];
  public objectLocation: object = {};
  public listValue: any[] = [];
  public listKey: any[] = [];
  public currentLocality: string = '';
  public listRegion: any[] = Constants.listRegion;
  public companyId: string = '';
  public user: object = {};
  public submitted: boolean = false;
  public emailRegex: RegExp = RegexValidator.emailRegex;
  public numberRegex: RegExp = RegexValidator.numberOnlyRegex;
  public storeForm: FormGroup;
  public isConfirm: boolean = false;
  public isOpenDialog: boolean = false;
  public apiMessage: string = '';
  public shopId: string = '';
  public edit: boolean = false;

  /**
   * Form map item
   */
  formMap;
  /**
   * current user login
   */
  userLogin: any;

  constructor(
    private commonServicesService: CommonServicesService,
    private storeService: StoreService,
    private authService: AuthService,
    private translate: TranslateService,
    private modalService: ModalService,
    private fb: FormBuilder
  ) {
  }
  ngOnChanges(): void {
  }

  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void> {
    this.initForm();
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.shopId = this.userLogin.shop_id;
    this.companyId = this.userLogin.company_id;
    await this.getShop();
  }

  async getShop(): Promise<void> {
    this.storeService.getStores(this.shopId).subscribe((shop) => {
      if (shop != null && shop.length > 0) {
        this.edit = true;
      }
      const postalCd: string = shop[0].postal_cd;
      const address: string[] = shop[0].address.split(' ');
      const newDate = new Date(shop[0].cutoff_date);
      this.storeForm.patchValue({
        name: shop[0].name,
        zipcode01: postalCd.substring(0, 3),
        zipcode02: postalCd.substring(3, 8),
        prefecture: shop[0].prefecture,
        city: shop[0].city,
        currentStreetAddress: address[0],
        currentExtendedStreet: address[1],
        area: shop[0].area,
        tel: shop[0].tel,
        email: shop[0].email,
        openingTime: shop[0].opening_time,
        closingTime: shop[0].closing_time,
        facility: shop[0].facility,
        timeBreak: shop[0].time_break,
        cutoffDate: Helper.formatZero(newDate.getFullYear()) + '-' + Helper.formatZero(newDate.getMonth() + 1) + '-' + Helper.formatZero(newDate.getDate()),
        updatedAt: shop[0].updated_at
      });
    });
  }

  /**
   * 初期化フォーム
   */
  initForm(): void {
    this.translate.get('store').subscribe((trans) => {
      this.formMap = {
        name: trans?.name,
        zipcode01: trans?.zipcode01,
        zipcode02: trans?.zipcode02,
        area: trans?.area,
        tel: trans?.phoneNumber,
        email: trans?.mail,
        currentStreetAddress: trans?.currentStreetAddress,
        currentExtendedStreet: trans?.currentExtendedStreet,
        openingTime: trans?.openingTime,
        closingTime: trans?.closingTime
      };
    });

    this.storeForm = this.fb.group({
      name: ['', [ValidatorService.required, ValidatorService.maxLength(30)]],
      zipcode01: [
        '',
        [
          ValidatorService.required,
          ValidatorService.minLength(3),
          ValidatorService.maxLength(3),
          ValidatorService.isNumber,
        ],
      ],
      zipcode02: [
        '',
        [
          ValidatorService.required,
          ValidatorService.maxLength(4),
          ValidatorService.minLength(4),
          ValidatorService.isNumber,
        ],
      ],
      prefecture: ['', [ValidatorService.required, ValidatorService.maxLength(10)]],
      city: ['', [ValidatorService.required, ValidatorService.maxLength(50)]],
      area: ['', [ValidatorService.required, ValidatorService.maxLength(50)]],
      tel: [
        '',
        [
          ValidatorService.isNumber, ValidatorService.required,
          ValidatorService.isTelNumber(11),
        ],
      ],
      email: ['', [ValidatorService.required, ValidatorService.email]],
      openingTime: ['', [ValidatorService.required]],
      closingTime: ['', [ValidatorService.isGteDate('openingTime', true), ValidatorService.required]],
      timeBreak: [Constants.timeStore.breakTime, ValidatorService.required],
      facility: ['1', ValidatorService.required],
      currentStreetAddress: ['', ValidatorService.required],
      currentExtendedStreet: ['', ValidatorService.required],
      updatedAt: ['']
    });
  }

  /**
   * 郵便番号の最初の3文字を取得します
   */
  getZipCode01() {
    this.submitted = false;
    //reset listLocalityGot to null
    this.listLocalityGot = [];
    this.storeForm.controls.prefecture.setValue('');
    this.zipcode01 = this.storeForm.value.zipcode01;

    if (this.zipcode01 == null||this.zipcode01 == '') {
      this.storeForm.patchValue({
        prefecture: '',
        city: '',
        currentStreetAddress: '',
        currentExtendedStreet: '',
      })
    
      return;
    }

    if (this.zipcode01.length === 3 && this.zipcode01 != '000') {
      this.listLocalityGot= [];
      this.strLocation = this.commonServicesService.getContent(this.zipcode01);

      this.strLocation = this.strLocation.replace('$yubin(', '');
      this.strLocation = this.strLocation.replace(');', '');

      this.objectLocation = JSON.parse(this.strLocation);
      this.listValue = Object.values(this.objectLocation);
      this.listKey = Object.keys(this.objectLocation);

      for (let i = 0; i < this.listValue.length; i++) {
        this.listLocalityGot.push({
          code: this.listKey[i],
          infor: this.listValue[i],
        });
      }

      this.storeForm.controls.prefecture.setValue(
        this.listRegion[this.listLocalityGot[0].infor[0]]
      );
      this.getZipCode02();
    }
  }

  /**
   * 郵便番号の次の4文字を取得します
   */
  getZipCode02() {
    this.submitted = false;
    this.storeForm.controls.city.setValue('');
    this.zipcode02 = this.storeForm.value.zipcode02;
    if (this.zipcode02 == null||this.zipcode02 =='') {
      this.storeForm.patchValue({
        city: '',
        currentStreetAddress: '',
        currentExtendedStreet: '',
      })
      return;
    }

    if (this.zipcode02.length === 4) {
      
      const fullZipCode = this.zipcode01 + this.zipcode02;

      this.listLocality = this.listLocalityGot.filter(
        (item) => item.code == fullZipCode
      );

      if (this.listLocality[0]) {
        this.storeForm.controls.city.setValue(this.listLocality[0].infor[1]);
        this.storeForm.controls.currentStreetAddress.setValue(
          this.listLocality[0].infor[2] || ''
        );
        this.storeForm.controls.currentExtendedStreet.setValue(
          this.listLocality[0].infor[3] || ''
        );
      } else {
        this.storeForm.controls.city.setValue('');
      }
    }
  }

  /**
   * addStore
   */
  addStore() {
    // パラメータ
    let body = {
      name: this.storeForm.value.name,
      postal_cd:
        this.storeForm.value.zipcode01 + this.storeForm.value.zipcode02,
      prefecture: this.storeForm.value.prefecture,
      city: this.storeForm.value.city,
      address:
        this.storeForm.value.currentStreetAddress +
        ' ' +
        this.storeForm.value.currentExtendedStreet,
      area: this.storeForm.value.area,
      tel: this.storeForm.value.tel,
      email: this.storeForm.value.email,
      opening_time: this.storeForm.value.openingTime,
      closing_time: this.storeForm.value.closingTime,
      time_break: this.storeForm.value.timeBreak,
      facility: this.storeForm.value.facility,
      company_id: this.companyId,
    };

    this.isConfirm = false;

    // APIを呼び出す
    this.storeService.addStore(body).subscribe(
      (res) => {
        if (res) {
          this.apiMessage = '登録が完了しました。';
          this.isOpenDialog = true;
          this.submitted = false;
          this.initForm();
          this.getShop();
        }
      },
      (error) => {
        this.apiMessage = '登録が失敗しました。';
        this.isOpenDialog = true;
        this.submitted = false;
      }
    );
  }

  get f() {
    return this.storeForm.controls;
  }

  /**
   * parseShop
   * @param objShop
   */
  parseShop(objShop): object {
    return {
      name: objShop.name,
      postal_cd:
        objShop.zipcode01 + objShop.zipcode02,
      prefecture: objShop.prefecture,
      city: objShop.city,
      address: objShop.currentStreetAddress + ' ' + objShop.currentExtendedStreet,
      area: objShop.area,
      tel: objShop.tel,
      email: objShop.email,
      opening_time: objShop.openingTime,
      closing_time: objShop.closingTime,
      time_break: objShop.timeBreak,
      facility: objShop.facility,
      company_id: this.companyId,
      updated_at: objShop.updatedAt
    };
  }

  /**
   * ダイアログを閉じる
   */
  closeDialog(): void {
    this.isConfirm = false;
    this.isOpenDialog = false;
  }

  /**
   * ダイアログの確認
   */
  confirmDialog(): void {
    this.submitted = true;
    // stop here if form is invalid
    if (this.storeForm.invalid) {
      // Validation error 複数エラーがある場合は複数返す
      return;
    } else {
      this.isConfirm = true;
    }
  }

  /**
   * Update
   */
  handleUpdate(): void {
    this.submitted = true;
    if (this.storeForm.invalid) {
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
   * Emit confirm
   */
  handleConfirm(event) {
    // Update
    if (event.name === 'update') {
      if (this.storeForm.invalid) {
        return;
      }
      const obj: any = this.parseShop(this.storeForm.value);
      this.storeService
        .updateStores(String(this.shopId), obj)
        .subscribe((res) => {
          this.translate
            .get('msgCompleted.updateHasBeenCompleted')
            .subscribe((msg: string) => {
              this.modalService.open(msg);
              this.submitted = false;
              this.initForm();
              this.getShop();
            });
        });
    }

    // Delete
    if (event.name === 'delete') {
      this.storeService
        .deleteStores(String(this.companyId))
        .subscribe((res) => {
          this.translate
            .get('msgCompleted.deletetionHasBeenCompleted')
            .subscribe((msg: string) => {
              this.submitted = false;
              this.modalService.open(msg);
              this.initForm();
              this.getShop();
            });
        });
    }
  }
}
