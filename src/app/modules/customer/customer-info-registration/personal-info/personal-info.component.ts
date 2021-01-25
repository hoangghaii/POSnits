import { formatDate } from '@angular/common';
import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from 'src/app/constants/constants';
import { SystemSetting } from 'src/app/constants/global-const';
import { ConfirmModalComponent } from 'src/app/core/directives/confirm-modal.component';
import { Customer } from 'src/app/core/models';
import { ModalService, UploadService, ValidatorService, YubinbangoService } from 'src/app/core/services';
import { CustomerService, StaffService } from 'src/app/core/services/apis';



@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss']
})
export class PersonalInfoComponent implements OnInit, OnChanges {
  customerInfoRegisForm: FormGroup;
  numberOnlyPattern: RegExp;
  locations: any[] = [];
  listRegion: any[] = Constants.listRegion;
  imagesUrl: string;
  formMap;
  constants = Constants;
  @Input() submitted = false;
  @Input() userLogin;
  @Input() paramMapId;
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;
  constructor(private fb: FormBuilder,
    private modalService: ModalService,
    private translate: TranslateService,
    private customerService: CustomerService,
    private staffService: StaffService,
    private router: Router,
    private route: ActivatedRoute,
    private yubinbangoService: YubinbangoService,
    private uploadService: UploadService,) {
      this.customerInfoRegisForm = this.fb.group({
        id: [''],
        login_id: [''],
        shop_id: [''],
        customer_no: ['', [ValidatorService.required]],
        firstname: ['', [ValidatorService.required, ValidatorService.maxLength(10)]],
        lastname: ['', [ValidatorService.required, ValidatorService.maxLength(10)]],
        firstname_kana: ['', [ValidatorService.required, ValidatorService.isCharacterKatakana, ValidatorService.maxLength(20)]],
        lastname_kana: ['', [ValidatorService.required, ValidatorService.isCharacterKatakana, ValidatorService.maxLength(20)]],
        sex: ['0', [ValidatorService.required]],
        birthday: ['', [ValidatorService.required]],
        tel: ['', [ValidatorService.isTelNumber(11)]],
        email: ['', [ValidatorService.required, ValidatorService.email, ValidatorService.maxLength(255)]],
        postal_cd: ['', [ValidatorService.isPostalCdNumber(7)]],
        prefecture: ['', [ValidatorService.required, ValidatorService.maxLength(10)]],
        city: ['', [ValidatorService.required, ValidatorService.maxLength(50)]],
        area: ['', [ValidatorService.required, ValidatorService.maxLength(50)]],
        address: ['', [ValidatorService.required, ValidatorService.maxLength(50)]],
        language: ['001', [ValidatorService.required]],
        member_flg: [1],
        staff_id: [''],
        visit_cnt: [''],
        first_visit: [''],
        last_visit: [''],
        updated_at: [''],
        password: [''],
        customer_img: [null],
      });
  }

  /**
   * 初期表示
   */
  ngOnInit(): void {
    this.translate.get('customer').subscribe((trans) => {
      this.formMap = {
        customer_no: trans?.customerNo,
        firstname: trans?.name + '(' + trans?.name1 + ')',
        lastname: trans?.name + '(' + trans?.name2 + ')',
        firstname_kana: trans?.nameKana + '(' + trans?.name1 + ')',
        lastname_kana: trans?.nameKana + '(' + trans?.name2 + ')',
        sex: trans?.sex,
        birthday: trans?.birthday,
        tel: trans?.phoneNumber,
        email: trans?.email,
        postal_cd: trans?.zipCode,
        prefecture: trans?.prefectures,
        city: trans?.city,
        area: trans?.townArea,
        address: trans?.address,
        language: trans?.language,
      };
    });
  }

  /**
   * 初期表示
   */
  ngOnChanges(): void {
    if (this.userLogin !== undefined) {
      this.imagesUrl = SystemSetting.imageUrl;
      if (this.paramMapId !== undefined && this.paramMapId !== null) {
        this.customerService.getCustomer(this.userLogin.shop_id, this.paramMapId).subscribe(res => {
          if (res) {
            this.customerInfoRegisForm.patchValue(res);
            this.customerInfoRegisForm.controls.last_visit.setValue(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en-US'));
            if (res.customer_img !== null && res.customer_img !== '') {
              this.imagesUrl = res.customer_img;
            }
          }
        });
      } else {
        this.customerInfoRegisForm.controls.first_visit.setValue(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en-US'));
        this.customerInfoRegisForm.controls.last_visit.setValue(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss', 'en-US'));
        this.customerInfoRegisForm.controls.visit_cnt.setValue(0);
        this.customerInfoRegisForm.controls.shop_id.setValue(this.userLogin.shop_id);
        this.customerInfoRegisForm.controls.login_id.setValue(this.userLogin.login_id);
      }
    }
  }

  /**
   * save or update customer
   */
  saveCustomer(): void {
    this.submitted = true;
    if (!this.customerInfoRegisForm.valid) {
      return;
    }
    const id = this.customerInfoRegisForm.controls.id.value;
    let customer = new Customer();
    customer = this.customerInfoRegisForm.getRawValue();
    customer.language = customer.language === '' ? null : customer.language;
    if (id === '' || id === null) {
      // create
      customer.id = null;
      this.customerService.createCustomer(customer, this.userLogin.shop_id).subscribe(
        (res) => {
          this.translate.get('msgCompleted.registrationHasBeenCompleted').subscribe((msg: string) => {
            this.modalService.open(msg);
          });
          this.changeRouter()
        }, (error) => {
          this.modalService.open(error);
        }
      );
    } else {
      // update
      this.translate.get('confirm.updateMessage').subscribe((msg: string) => {
        this.confirmModal.prompt(msg, null, true, 'update');
      });
    }
  }

  /**
   * Emit confirm
   */
  handleConfirm(event) {
    let customer = new Customer();
    customer = this.customerInfoRegisForm.getRawValue();
    customer.language = customer.language === '' ? null : customer.language;
    // TODO
    // if (customer.customer_img !== null && customer.customer_img.indexOf('upload/customer') != -1) {
    //   const img_arr = customer.customer_img.split("upload/customer");
    //   customer.customer_img = "upload/customer" + img_arr[1];
    // }
    // Update
    if (event.name === 'update') {
      this.customerService.updateCustomer(this.userLogin.shop_id, customer).subscribe(
        (res) => {
          this.translate.get('msgCompleted.updateHasBeenCompleted').subscribe((msg: string) => {
            this.modalService.open(msg);
          });
          this.changeRouter()
        }, (error) => {
          this.modalService.open(error);
        }
      );
    }
  }

  /**
   * 郵便番号の最初の3文字を取得します
   */
  getZipCode(): void {
    // ZipCode1
    let zipCode = this.customerInfoRegisForm.controls.postal_cd.value;
    const zipCode1 = zipCode.slice(0, 3);
    if (zipCode1.length === 3 && zipCode1 !== '000') {
      const locations = this.yubinbangoService.getPostalCode(zipCode1);
      if (locations) {
        for (const [key, value] of Object.entries(locations)) {
          this.locations.push({
            code: key,
            info: value
          });
        }
        this.customerInfoRegisForm.controls.prefecture.setValue(
          this.listRegion[this.locations[0].info[0]]
        );
      }
    }

    // ZipCode2
    const zipCode2 = zipCode.slice(3, 7);
    this.customerInfoRegisForm.controls.city.setValue('');
    this.customerInfoRegisForm.controls.area.setValue('');
    if (zipCode1 && zipCode2 && zipCode2.toString().length === 4) {
      zipCode = zipCode.toString();
      const location = this.locations.find((item) => item.code === zipCode);
      if (location) {
        this.customerInfoRegisForm.controls.city.setValue(location.info[1]);
        this.customerInfoRegisForm.controls.area.setValue(location.info[2] || '' + location.info[3] || '');
      }
    }
  }

  /**
   * ファイル選択後処理
   */
  handleFileInput(event): void {
    this.customerInfoRegisForm.controls.customer_img.setValue(event.path);
  }

  /**
   * Change router
   */
  changeRouter() {
    this.router.navigate(['shops/customer-info']);
  }
}
