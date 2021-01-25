import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, FileDownloadService, ValidatorService } from 'src/app/core/services';
import { SaleTotalService, StaffService } from 'src/app/core/services/apis';

@Component({
  selector: 'app-sale-total',
  templateUrl: './sale-total.component.html',
  styleUrls: ['./sale-total.component.scss']
})
export class SaleTotalComponent implements OnInit {
  listStaff;
  userLogin;
  saleTotal;
  form: FormGroup;
  submitted = false;
  formMap;
  isSearch = false;

  constructor(
    private fb: FormBuilder,
    private staffService: StaffService,
    private authService: AuthService,
    private translate: TranslateService,
    private saleTotalService: SaleTotalService,
    private fileDownloadService: FileDownloadService
  ) {
    this.translate.get('saleTotal').subscribe((trans) => {
      this.formMap = {
        target_day_from: trans?.specifyPeriod,
        target_day_to: trans?.specifyPeriod,
        staff_id: trans?.personInCharge,
      };
    });
   }

  /**
   * ngOnInit
   */
  async ngOnInit(): Promise<void> {
    this.form = this.fb.group({
      shop_id: [''],
      target_day_from: ['', ValidatorService.selectRequired],
      target_day_to: ['', ValidatorService.selectRequired],
      staff_id: ['', ValidatorService.selectRequired],
      staff_name: ['']
    });

    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.listStaff = await this.staffService.getStaffList(this.userLogin.shop_id).toPromise();
    this.form.controls.shop_id.setValue(this.userLogin.shop_id);
  }

  /**
   * Get staff_name
   */
  getStaffName() {
    for (const item of this.listStaff) {
      if (item.id == this.form.get('staff_id').value) {
        this.form.controls.staff_name.setValue(item.name);
      }
    }
  }

  /**
   * Download
   */
  download() {
    this.submitted = true;
    if (!this.form.valid) {
      return;
    }
    this.saleTotalService.getSaleTotalOutput(this.userLogin.shop_id, this.form.getRawValue()).subscribe(resp => {
      let fileName = '売上集計一覧';
      this.fileDownloadService.downloadExcel(resp, fileName);
    });
  }

  /**
   * Search
   */
  search() {
    this.submitted = true;
    if (!this.form.valid) {
      return;
    }
    this.saleTotalService.getSaleTotalList(this.userLogin.shop_id, this.form.getRawValue()).subscribe(item => {
      this.saleTotal = item;
      this.isSearch = true;
    });
  }
}
