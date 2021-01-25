import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Constants} from 'src/app/constants/constants';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ValidatorService, YubinbangoService} from 'src/app/core/services';
import {RegexValidator} from 'src/app/constants/global-const';

@Component({
  selector: 'app-contract-entry',
  templateUrl: './contract-entry.component.html',
  styleUrls: ['./contract-entry.component.scss']
})
export class ContractEntryComponent implements OnInit {
  /**
   * 契約者・店舗情報・ログイン情報
   */
  contract;

  /**
   * 契約者・店舗情報入力
   */
  contractorForm: FormGroup;

  /**
   * 会計処理設定一覧
   */
  accountingList = Constants.listAccounting;

  /**
   * Submit status
   */
  submitted = false;

  /**
   * Form name
   */
  formMap: object;

  /**
   * 郵便番号一覧
   */
  locations: any[] = [];

  /**
   * 都道府県
   */
  listRegion: any[] = Constants.listRegion;

  /**
   * Prefix mail domain
   */
  mailDomain = '@posnist.jp';

  constructor(private fb: FormBuilder,
              private router: Router,
              private translate: TranslateService,
              private yubService: YubinbangoService) {
    this.contract = this.router.getCurrentNavigation().extras.state;
  }

  /**
   * Init component
   */
  async ngOnInit(): Promise<void> {
    this.initForm();
    if (this.contract) {
      this.contract.shop.email = this.contract.shop.email.replace(this.mailDomain, '');
      this.contractorForm.patchValue(this.contract);
    }
  }

  /**
   * Init form
   */
  initForm(): void {
    this.translate.get('contractors.registerInformation').subscribe((trans) => {
      this.formMap = {
        company: {
          name: trans?.sectionCompany?.name,
          postalCd: trans?.sectionCompany?.postalCd,
          prefecture: trans?.sectionCompany?.prefecture,
          city: trans?.sectionCompany?.city,
          area: trans?.sectionCompany?.area,
          address: trans?.sectionCompany?.address,
          cutoffDate: trans?.sectionCompany?.cutoffDate,
          accounting: trans?.sectionCompany?.accounting,
        },
        shop: {
          name: trans?.sectionShop?.name,
          postalCd: trans?.sectionShop?.postalCd,
          prefecture: trans?.sectionShop?.prefecture,
          city: trans?.sectionShop?.city,
          area: trans?.sectionShop?.area,
          address: trans?.sectionShop?.address,
          email: trans?.sectionShop?.email,
        },
        user: {
          name: trans?.user?.name,
          email: trans?.user?.email,
          password: trans?.user?.password,
          passwordConfirm: trans?.user?.passwordConfirm
        },
      };
    });
    this.contractorForm = this.fb.group({
      company: this.fb.group({
        name: ['', ValidatorService.required],
        postalCd: ['', ValidatorService.required],
        prefecture: ['', ValidatorService.required],
        city: ['', ValidatorService.required],
        address: ['', ValidatorService.required],
        area: ['', ValidatorService.required],
        extAddress: [''],
        cutoffDate: ['', [ValidatorService.required, ValidatorService.isDay]],
        accounting: ['', ValidatorService.selectRequired]
      }),
      shop: this.fb.group({
        name: ['', ValidatorService.required],
        postalCd: ['', ValidatorService.required],
        prefecture: ['', ValidatorService.required],
        city: ['', ValidatorService.required],
        address: ['', ValidatorService.required],
        area: ['', ValidatorService.required],
        extAddress: [''],
        email: ['', [ValidatorService.required]],
      }),
      user: this.fb.group({
        name: ['', ValidatorService.required],
        email: ['', [ValidatorService.required, ValidatorService.email]],
        password: ['', ValidatorService.required],
        passwordConfirm: ['', ValidatorService.required],
      }),
    });
  }

  /**
   * Get zip code
   */
  getZipCode(name = ''): void {
    // ZipCode1
    let zipCode = this.contractorForm.get('company').get('postalCd').value;
    if (name === 'shop') {
      zipCode = this.contractorForm.get('shop').get('postalCd').value;
    }

    const zipCode1 = zipCode.slice(0, 3);
    if (zipCode1.length === 3 && zipCode1 !== '000') {
      const locations = this.yubService.getPostalCode(zipCode1);
      if (locations) {
        for (const [key, value] of Object.entries(locations)) {
          this.locations.push({
            code: key,
            info: value
          });
        }
        if (name === 'shop') {
          this.contractorForm.get('shop').get('prefecture').setValue(this.listRegion[this.locations[0].info[0]]);
        } else {
          this.contractorForm.get('company').get('prefecture').setValue(this.listRegion[this.locations[0].info[0]]);
        }
      } else {
        return;
      }
    }

    // ZipCode2
    const zipCode2 = zipCode.slice(3, 7);
    if (name === 'shop') {
      this.contractorForm.get('shop').get('city').setValue('');
      this.contractorForm.get('shop').get('address').setValue('');
    } else {
      this.contractorForm.get('company').get('city').setValue('');
      this.contractorForm.get('company').get('address').setValue('');
    }

    if (zipCode1 && zipCode2 && zipCode2.toString().length === 4) {
      zipCode = zipCode.toString();
      const location = this.locations.find((item) => item.code === zipCode);
      if (location) {
        if (name === 'shop') {
          this.contractorForm.get('shop').get('city').setValue(location.info[1]);
          this.contractorForm.get('shop').get('address').setValue((location.info[2] || '') + (location.info[3] || ''));
        } else {
          this.contractorForm.get('company').get('city').setValue(location.info[1]);
          this.contractorForm.get('company').get('address').setValue((location.info[2] || '') + (location.info[3] || ''));
        }
      }
    }
  }

  /**
   * Back menu
   */
  back(): void {

  }

  /**
   * Go to confirm
   */
  goToConfirm(): void {
    this.submitted = true;
    // stop here if form is invalid
    if (this.contractorForm.invalid) {
      // Validation error 複数エラーがある場合は複数返す
      return;
    }

    const contract = this.contractorForm.getRawValue();
    contract.shop.email = contract.shop.email + this.mailDomain;
    this.router.navigate(['contracts/selection'], {state: contract});
  }
}
