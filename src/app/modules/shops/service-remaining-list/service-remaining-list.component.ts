import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {AuthService, FileDownloadService, ValidatorService} from 'src/app/core/services';
import {ServiceRemainingListService, StaffService} from 'src/app/core/services/apis';


@Component({
  selector: 'app-service-remaining-list',
  templateUrl: './service-remaining-list.component.html',
  styleUrls: ['./service-remaining-list.component.scss']
})
export class ServiceRemainingListComponent implements OnInit {
  formServiceRemaining: FormGroup;
  listStaff;
  userLogin;
  submitted = false;
  formMap;
  datePipe: any;

  constructor(private fb: FormBuilder,
              private staffService: StaffService,
              private authService: AuthService,
              private translate: TranslateService,
              private serviceRemainingListService: ServiceRemainingListService,
              private fileDownloadService: FileDownloadService) {
    this.translate.get('remainingList').subscribe((trans) => {
      this.formMap = {
        target_day_from: trans?.specifyPeriod,
        target_day_to: trans?.specifyPeriod,
        target_type: trans?.target,
        staff_id: trans?.personInCharge,
      };
    });
  }

  async ngOnInit(): Promise<void> {
    this.formServiceRemaining = this.fb.group({
      shop_id: [''],
      target_from: ['', ValidatorService.selectRequired],
      target_to: ['', ValidatorService.selectRequired],
      target_type: ['0'],
      staff_id: ['', ValidatorService.selectRequired],
    });
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.listStaff = await this.staffService.getStaffList(this.userLogin.shop_id).toPromise();
    this.formServiceRemaining.controls.shop_id.setValue(this.userLogin.shop_id);
  }

  /**
   * Submit
   */
  submit() {
    const data = this.formServiceRemaining.getRawValue();
    this.serviceRemainingListService.getServiceRemainingOutput(this.userLogin.shop_id, data).subscribe(resp => {
      let fileName = '顧客別役務残一覧';
      if (Number(data.target_type) === 1) {
        fileName = 'コース別役務残一覧';
      }
      this.fileDownloadService.downloadExcel(resp, fileName);
    });
  }
}
