import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegexValidator } from 'src/app/constants/global-const';
import { YubinbangoService } from 'src/app/core/services/yubinbango.service';
import { Constants } from 'src/app/constants/constants';
import { CompanyService } from 'src/app/core/services/apis/company.service';
import { fadeAnimation } from 'src/app/constants/animation';
import { AuthService } from 'src/app/core/services/auth.service';
import { Helper } from 'src/app/core/utils/helper';
import { ConfirmModalComponent } from 'src/app/core/directives/confirm-modal.component';
import { ViewChild } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorService } from 'src/app/core/services';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  animations: [fadeAnimation],
})
export class CompaniesComponent implements OnInit {
  /**
   * 会社情報
   */
  companyForm: FormGroup;
  submitted = false;
  accountingList = Constants.listAccounting;
  listRegion = Constants.listRegion;
  showConfirmPop = false;
  locations = [];
  apiMessage = '';
  isOpenDialog = false;
  /**
   * Company ID
   */
  companyId: string = '';
  /**
   * Edit mode
   */
  edit = false;

  /**
   * current user login
   */
  userLogin: any;
  formMap = {
    name: '',
    zipCode01: '',
    zipCode02: '',
    address: '',
    extAddress: '',
    area: '',
    accounting: '',
    cutoffDate: '',
  };

  /**
   * Confirm modal view
   */
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private authService: AuthService,
    private yubinbangoService: YubinbangoService,
    private translate: TranslateService,
    private modalService: ModalService
  ) { }

  /**
   * Init component
   */
  async ngOnInit(): Promise<void> {
    this.initForm();
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.companyId = this.userLogin.company_id;
    await this.getCompany();
  }

  /**
   * Get company
   */
  async getCompany(): Promise<void> {
    this.companyService.getCompany(this.companyId).subscribe((company) => {
      if (company != null) {
        this.edit = true;
      }
      const postalCd: string = company.postal_cd;
      const address: string[] = company.address.split(' ');
      this.companyForm.patchValue({
        name: company.name,
        zipCode01: postalCd.substring(0, 3),
        zipCode02: postalCd.substring(3, 8),
        prefecture: company.prefecture,
        city: company.city,
        address: address[0],
        extAddress: address[1],
        area: company.area,
        accounting: company.accounting,
        cutoffDate: company.cutoff_date,
        updatedAt: company.updated_at,
      });
    });
  }

  /**
   * Init form
   */
  initForm(): void {
    this.translate.get('common').subscribe((trans) => {
      this.formMap.zipCode01 = trans?.zipCode1;
      this.formMap.zipCode02 = trans?.zipCode2;
    });
    this.translate.get('company').subscribe((trans) => {
      this.formMap.name = trans?.lbCompanyName;
      this.formMap.address = trans?.lbAddress;
      this.formMap.extAddress = trans?.placeholderExtAddress;
      this.formMap.area = trans?.buildingName;
      this.formMap.accounting = trans?.lbAccounting;
      this.formMap.cutoffDate = trans?.lbCutoffDate;
    });

    this.companyForm = this.fb.group({
      name: ['', ValidatorService.required],
      zipCode01: [
        '',
        [
          ValidatorService.required,
          ValidatorService.minLength(3),
          ValidatorService.maxLength(3),
        ],
      ],
      zipCode02: [
        '',
        [
          ValidatorService.required,
          ValidatorService.minLength(4),
          ValidatorService.maxLength(4),
        ],
      ],
      prefecture: [''],
      city: [''],
      address: ['', ValidatorService.required],
      extAddress: ['', ValidatorService.required],
      area: ['', ValidatorService.required],
      accounting: ['', ValidatorService.required],
      cutoffDate: [
        '',
        [ValidatorService.required, ValidatorService.isDay],
      ],
      updatedAt: [''],
    });
  }

  /**
   * 製品情報フォームコントロールを取得する
   */
  get f() {
    return this.companyForm.controls;
  }

  /**
   * Get post code
   */
  getZipCode01(): void {
    this.companyForm.controls.prefecture.setValue('');
    const zipCode = this.companyForm.controls.zipCode01.value.toString();
    if (zipCode.length === 3 && zipCode != '000') {
      this.locations = []
      const locations = this.yubinbangoService.getPostalCode(zipCode);
      if (locations) {
        for (const [key, value] of Object.entries(locations)) {

          this.locations.push({
            code: key,
            info: value,

          });
          this.companyForm.controls.prefecture.setValue(
            this.listRegion[this.locations[0].info[0]]
          );
        }

      }
    }
  }

  /**
   * Get post code part 2
   */
  getZipCode02(): void {
    this.companyForm.controls.city.setValue('');
    this.companyForm.controls.address.setValue('');
    this.companyForm.controls.extAddress.setValue('');
    let zipCode = this.companyForm.controls.zipCode02.value;

    if (zipCode && zipCode.toString().length === 4) {
      zipCode =
        this.companyForm.controls.zipCode01.value.toString() +
        zipCode.toString();
      const location = this.locations.find((item) => item.code === zipCode);

      if (location) {
        this.companyForm.controls.city.setValue(location.info[1]);
        this.companyForm.controls.address.setValue(location.info[2] || '');
        this.companyForm.controls.extAddress.setValue(location.info[3] || '');
      }
    }
  }

  /**
   * Save
   */
  save(): void {
    const objCompany = this.companyForm.getRawValue();
    this.showConfirmPop = false;
    this.companyService.addCompany(this.parseCompany(objCompany)).subscribe(
      (res) => {
        if (res) {
          this.apiMessage = '登録が完了しました。';
          this.isOpenDialog = true;
          this.submitted = false;
          this.initForm();
          this.getCompany();
        }
      },
      (error) => {
        this.apiMessage = '登録が失敗しました。';
        this.isOpenDialog = true;
        this.submitted = false;
      }
    );
  }

  /**
   * Convert company data for submit api
   *
   * @param {object} objCompany
   *
   * @return {object}
   */
  parseCompany(objCompany): object {
    return {
      name: objCompany.name,
      postal_cd: objCompany.zipCode01 + objCompany.zipCode02,
      prefecture: objCompany.prefecture,
      city: objCompany.city,
      area: objCompany.area,
      address: objCompany.address + ' ' + objCompany.extAddress,
      accounting: objCompany.accounting,
      cutoff_date: objCompany.cutoffDate,
      updated_at: objCompany.updatedAt,
    };
  }

  /**
   * Valid company and save
   */
  signUp(): void {
    this.submitted = true;
    // stop here if form is invalid
    if (this.companyForm.invalid) {
      // Validation error 複数エラーがある場合は複数返す
      return;
    } else {
      this.showConfirmPop = true;
    }
  }

  /**
   * Update
   */
  handleUpdate(): void {
    this.submitted = true;
    if (this.companyForm.invalid) {
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
      if (this.companyForm.invalid) {
        return;
      }
      const obj: any = this.parseCompany(this.companyForm.value);
      this.companyService
        .updateCompany(String(this.companyId), obj)
        .subscribe((res) => {
          this.translate
            .get('msgCompleted.updateHasBeenCompleted')
            .subscribe((msg: string) => {
              this.modalService.open(msg);
              this.submitted = false;
              this.initForm();
              this.getCompany();
            });
        });
    }

    // Delete
    if (event.name === 'delete') {
      this.companyService
        .deleteCompany(String(this.companyId))
        .subscribe((res) => {
          this.translate
            .get('msgCompleted.deletetionHasBeenCompleted')
            .subscribe((msg: string) => {
              this.modalService.open(msg);
              this.submitted = false;
              this.initForm();
              this.getCompany();
            });
        });
    }
  }
}
