import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from 'src/app/constants/constants';
import { SystemSetting } from 'src/app/constants/global-const';
import { AuthService, ModalService, UploadService, ValidatorService, YubinbangoService } from 'src/app/core/services';
import { InformationDisplayService } from 'src/app/core/services/apis/information-display.service';
import { Helper } from 'src/app/core/utils/helper';
import {DomSanitizer,SafeResourceUrl} from '@angular/platform-browser';
/**
 * InformationDisplayComponent
 * 情報表示コンポーネント
 */
@Component({
  selector: 'app-information-display',
  templateUrl: './information-display.component.html',
  styleUrls: ['./information-display.component.scss']
})

export class InformationDisplayComponent implements OnInit {

  public userLogin: any;
  public informationDisplays: any[];
  public locations = [];
  public listRegion = Constants.listRegion;
  public submitted = false;
  public informationDisplaytForm: FormGroup;
  imagesUrl: string;
  public status = '';
  flag = false;
  urlGG:SafeResourceUrl ;
  /**
  * Form map item
  */
  formMap;
  /**
   * コンストラクタ
   * @param authService
   * @param fb
   * @param informationService
   * @param yubinbangoService
   * @param uploadService
   */
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private informationService: InformationDisplayService,
    private yubinbangoService: YubinbangoService,
    private uploadService: UploadService,
    private router: Router,
    private translate: TranslateService,
    private modalService: ModalService,
    private sanitizer: DomSanitizer
  ) {
  }

  /**
   * 初期化
   */
  async ngOnInit(): Promise<void> {
    this.initForm();
    this.imagesUrl = SystemSetting.imageUrl;
    this.userLogin = await this.authService.getCurrentUser().toPromise();

    this.informationDisplays = await this.getInfo();
    if (this.informationDisplays.length>0) {
      this.flag = true;
      this.translate.get('common').subscribe((trans) => {
        this.status  = trans.update;});
      this.patchValueForm();
    }
  }

  /**
   * パッチ値フォーム
   */
  patchValueForm(): void {
    const res = this.informationDisplays[0];
    this.informationDisplaytForm.patchValue({
      name: res.name,
      postal_cd: res.postal_cd,
      prefecture: res.prefecture,
      city: res.city,
      area: res.area,
      address: res.address.substring(0, res.address.indexOf(' ')),
      access: res.access,
      extAddress: res.address.substring(res.address.indexOf(' '), res.address.length-1),
      log_img: res.log_img,
      updated_at: res.updated_at,
      id: res.id,
      email: res.email,
      tel: res.tel,
      zipCode01: res.postal_cd.substring(0, 3),
      zipCode02: res.postal_cd.substring(3, 7),
      shop_id: this.userLogin.shop_id
    });
    this.imagesUrl = res.log_img;
    let a = res.address.substring(res.address.indexOf(' '), res.address.length-1);
    if(a){
      this.informationDisplaytForm.patchValue({
        extAddress: a
      })
    }
  }

  /**
   * 情報表示を取得
   */
  async getInfo(): Promise<any> {
    return await this.informationService.getListInformationDispay(this.userLogin.shop_id).toPromise();
  }

  /**
   * 初期化フォーム
   */
  initForm(): void {
    this.translate.get('informationDisplay').subscribe((trans) => {
     this.status  = trans.btnNext;
      this.formMap = {
        name: trans?.name,
        email: trans?.email,
        prefecture: trans?.prefecture,
        address: trans?.address,
        extAddress: trans?.extAddress,
        access: trans?.access,
        log_img: trans?.image,
        tel: trans?.tel,
        zipCode01: trans?.zipCode01,
        zipCode02: trans?.zipCode02,
      };
    });
    this.informationDisplaytForm = this.fb.group({
      id: [''],
      name: ['', [ValidatorService.required]],
      postal_cd: ['', [ValidatorService.required]],
      prefecture: ['', [ValidatorService.required]],
      city: ['', [ValidatorService.required]],
      area: ['',],
      address: ['', [ValidatorService.required]],
      extAddress: ['', ValidatorService.required],
      access: ['', []],
      updated_at: [''],
      log_img: ['', []],
      email: ['', [ValidatorService.required, ValidatorService.email]],
      tel: ['', [ValidatorService.required, ValidatorService.isNumber, ValidatorService.isTelNumber(11),]],
      zipCode01: [
        '',
        [
          ValidatorService.required,
          ValidatorService.minLength(3),
          ValidatorService.maxLength(3),
          ValidatorService.isNumber,
        ],
      ],
      zipCode02: [
        '',
        [
          ValidatorService.required,
          ValidatorService.maxLength(4),
          ValidatorService.minLength(4),
          ValidatorService.isNumber,
        ],
      ],
    });
  }

  /**
   * プロセスファイル画像
   * @param files
   */
  onFileChange(event): void {
    this.informationDisplaytForm.controls.log_img.setValue(event.file.path);
  }

  /**
   * Get post code
   */
  getZipCode01(): void {
    this.informationDisplaytForm.controls.prefecture.setValue('');
    const zipCode = this.informationDisplaytForm.controls.zipCode01.value.toString();
    if (zipCode.length === 3 && zipCode != '000') {
      this.locations = [];
      const locations = this.yubinbangoService.getPostalCode(zipCode);
      if (locations) {
        for (const [key, value] of Object.entries(locations)) {
          this.locations.push({
            code: key,
            info: value,
          });
        }
        this.informationDisplaytForm.controls.prefecture.setValue(
          this.listRegion[this.locations[0].info[0]]
        );
      }
      this.getZipCode02();
    }
  }

  /**
   * Get post code part 2
   */
  getZipCode02(): void {
    this.informationDisplaytForm.controls.city.setValue('');
    this.informationDisplaytForm.controls.address.setValue('');
    this.informationDisplaytForm.controls.extAddress.setValue('');
    let zipCode = this.informationDisplaytForm.controls.zipCode02.value;
    let zipcode02 = this.informationDisplaytForm.value.zipCode02;
    if (zipcode02 == null || zipcode02 == '') {
      this.informationDisplaytForm.patchValue({
        city: '',
        address: '',
        extAddress: '',
      })
      return;
    }
    if (zipCode && zipCode.toString().length === 4) {
      zipCode =
        this.informationDisplaytForm.controls.zipCode01.value.toString() +
        zipCode.toString();
      const location = this.locations.find((item) => item.code === zipCode);

      if (location) {
        this.informationDisplaytForm.controls.city.setValue(location.info[1]);
        this.informationDisplaytForm.controls.address.setValue(location.info[2] || '');
        this.informationDisplaytForm.controls.extAddress.setValue(location.info[3] || '');
        this.informationDisplaytForm.controls.postal_cd.setValue(this.f.zipCode01.value + this.f.zipCode02.value);

        this.urlGG =this.sanitizer.bypassSecurityTrustResourceUrl(
          "https://maps.google.com/maps?q='"+this.informationDisplaytForm.value.prefecture+","
          +this.informationDisplaytForm.value.city+","
          +this.informationDisplaytForm.value.zipCode01+"-"+this.informationDisplaytForm.value.zipCode02+","
          +this.informationDisplaytForm.value.name+","
          +this.informationDisplaytForm.value.address+","
          +"',''&output=embed")
      }
    }
  }

  /**
   * 提出されたプロセス
   */
  async process(): Promise<any> {
    this.submitted = true;
    if (this.informationDisplaytForm.invalid) {
      return;
    } else {
      const obj = this.parseInformation(this.informationDisplaytForm.value);
      if (this.informationDisplays.length>0) {
        if(obj['log_img'].indexOf("8000/")>0)
        obj['log_img'] = obj['log_img'].substring(obj['log_img'].indexOf("8000/")+5,obj['log_img'].length);
        await this.informationService.updateInformationDispay(this.userLogin.shop_id, obj).toPromise();
        this.router.navigateByUrl('/reservations');
      } else {
        await this.informationService.createInformationDispay(this.userLogin.shop_id, obj).toPromise();
        this.router.navigateByUrl('/reservations');
      }
      this.informationDisplays = await this.getInfo();

    }

    this.submitted = false;
  }

  /**
   * 製品情報フォームコントロールを取得する
   */
  get f() {
    return this.informationDisplaytForm.controls;
  }

  /**
   * Parse info
   *
   * @param {Object} obj
   *
   * @return {Object}
   */
  parseInformation(obj): object {
    return {
      name: obj.name,
      postal_cd: obj.zipCode01 + obj.zipCode02,
      prefecture: obj.prefecture,
      city: obj.city,
      area: obj.area,
      address: obj.address + ' ' + obj.extAddress,
      access: obj.access,
      log_img: obj.log_img,
      updated_at: obj.updated_at,
      id: obj.id,
      email: obj.email,
      tel: obj.tel,
      shop_id: this.userLogin.shop_id
    };
  }
}
