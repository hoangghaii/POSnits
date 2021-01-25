import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { StaffReceptService, StaffService } from 'src/app/core/services/apis';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Constants } from 'src/app/constants/constants';
import { ValidatorService } from 'src/app/core/services';

/**
 * ReservableStaffSettingComponent
 * 予約可能なスタッフ設定コンポーネント
 */
@Component({
  selector: 'app-reservable-staff-setting',
  templateUrl: './reservable-staff-setting.component.html',
  styleUrls: ['./reservable-staff-setting.component.scss'],
})
export class ReservableStaffSettingComponent implements OnInit {
  userLogin: any;
  staffsForm: FormGroup;
  staffErrForm: FormGroup;
  formMap: object;
  listWebFlg = Constants.webFlagStaffRecepts;
  staffList = [];
  rptStaffs = [];
  public status = '';
  public flag = false;
  constructor(
    private fb: FormBuilder,
    private staffRptService: StaffReceptService,
    private modalService: ModalService,
    private translate: TranslateService,
    private staffService: StaffService,
    private authService: AuthService,
    private router: Router
  ) {}

  submitted: boolean;
  update: boolean;

  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void> {

    this.initForm();
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.staffList = await this.staffService
      .getStaffList(this.userLogin.shop_id)
      .toPromise();
    await this.reloadScreen();
  }
  /**
   * 画面のリロード
   */
  async reloadScreen():Promise<void>{
   this.initForm();
    this.rptStaffs = await this.staffRptService
    .getStaffReceptsList(this.userLogin.shop_id)
    .toPromise();
  if (this.rptStaffs.length > 0) {
    this.flag = true;
    this.translate.get('common').subscribe((trans) => {
      this.status =  trans.update;});
    this.update = true;
  }

  this.staffList.forEach((staff) => {
    const staffs = this.staffsForm.get('staffs') as FormArray;
    staffs.push(this.addStaffForm(staff));
  });
  }
  /**
   * Init form
   */
  initForm(): void {
    this.translate.get('reservableStaff').subscribe((trans) => {
      this.status =  trans.next;});
    this.translate.get('reservableStaff.header').subscribe((trans) => {

      this.formMap = {
        staffName: trans?.staffName,
        receptAmount: trans?.receptsAmount,
        webFlg: trans?.webFlg,
        nomination: trans?.nomination,
      };
    });
    this.staffsForm = this.fb.group({
      staffs: this.fb.array([]),
    });
  }

  /**
   * Add child form
   */
  addStaffForm(staff): FormGroup {
    const staffForm = this.fb.group({
      id: [null],
      staffId: [staff.id],
      staffName: [staff.name],
      receptAmount: [
        '',
        [
          ValidatorService.required,
          ValidatorService.isNumber,
          ValidatorService.maxLength(2),
          ValidatorService.min(0),

        ],
      ],
      webFlg: ['0', [ValidatorService.required, ValidatorService.maxLength(1)]],
      nomination: [
        '',
        [
          ValidatorService.required,
          ValidatorService.isNumber,
          ValidatorService.maxLength(4),
          ValidatorService.min(0),
        ],
      ],
      updatedAt: [''],
    });

    for (const item of this.rptStaffs) {
      if (item.staff_id === staff.id) {
        staffForm.patchValue({
          id: item.id,
          staffId: item.staff_id,
          receptAmount: item.recept_amount,
          webFlg: item.web_flg,
          nomination: item.nomination,
          updatedAt: item.updated_at,
        });
        break;
      }
    }
    if(staffForm.controls.webFlg.value=='0'){
      staffForm.controls['nomination'].setValidators([ValidatorService.isNumber,
        ValidatorService.maxLength(4),
        ValidatorService.min(0),]);
      staffForm.controls['receptAmount'].setValidators([ValidatorService.isNumber,
        ValidatorService.maxLength(2),
        ValidatorService.min(0),]);
    }
    return staffForm;
  }

  /**
   * Get staffs form
   */
  get staffs(): FormArray {
    return this.staffsForm.get('staffs') as FormArray;
  }

  /**
   * Save
   */
 async next(): Promise<void> {
    this.submitted = true;
    if (this.staffsForm.invalid) {
      const staffsForm = this.staffsForm.get('staffs') as FormArray;
      for (const st of staffsForm.controls) {
        if (st.invalid || st.dirty) {
          this.staffErrForm = st as FormGroup;
        }
      }

      return;
    }
    const staffs = [];
    const rawVal = this.staffsForm.getRawValue();
    rawVal.staffs.forEach((staff) => {
      staffs.push({
        id: staff.id,
        staff_id: staff.staffId,
        recept_amount: staff.receptAmount,
        web_flg: staff.webFlg,
        nomination: staff.nomination,
        updated_at: staff.updatedAt,
      });
    });

    if (this.update) {
      this.staffRptService
        .updateStaffRecepts(String(this.userLogin.shop_id), staffs)
        .subscribe(async (res) => {
          await this.reloadScreen();
        });
    } else {
      this.staffRptService
        .createStaffRecepts(String(this.userLogin.shop_id), staffs)
        .subscribe(async (res) => {
          this.router.navigateByUrl('reservation-setting/step-4');
        });
    }
  }
  changeValue(e,i){
    if(this.staffs.controls[i]['controls'].webFlg.value=='0'){
      this.staffs.controls[i]['controls']['nomination'].setValidators([ValidatorService.isNumber,
        ValidatorService.maxLength(4),
        ValidatorService.min(0),]);
        this.staffs.controls[i]['controls']['receptAmount'].setValidators([ValidatorService.isNumber,
        ValidatorService.maxLength(2),
        ValidatorService.min(0),]);
        this.staffs.controls[i]['controls']['nomination'].updateValueAndValidity();
        this.staffs.controls[i]['controls']['receptAmount'].updateValueAndValidity();
    }
    else{
      if(this.staffs.controls[i]['controls']['nomination'].value==""){
        this.staffs.controls[i].patchValue({
          nomination: 0,
        });
      }
      this.staffs.controls[i]['controls']['nomination'].setValidators([ ValidatorService.required,ValidatorService.isNumber,
        ValidatorService.maxLength(4),
        ValidatorService.min(0),]);
        this.staffs.controls[i]['controls']['receptAmount'].setValidators([ ValidatorService.required,ValidatorService.isNumber,
        ValidatorService.maxLength(2),
        ValidatorService.min(0),]);
        this.staffs.controls[i]['controls']['nomination'].updateValueAndValidity();
        this.staffs.controls[i]['controls']['receptAmount'].updateValueAndValidity();
    }

  }
}
