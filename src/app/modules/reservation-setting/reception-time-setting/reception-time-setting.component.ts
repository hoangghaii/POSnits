import {Component, OnInit} from '@angular/core';
import {Helper} from 'src/app/core/utils/helper';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Constants} from 'src/app/constants/constants';
import {AuthService, ValidatorService} from 'src/app/core/services';
import {ReservationReceptTimeService} from 'src/app/core/services/apis';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-reception-time-setting',
  templateUrl: 'reception-time-setting.component.html',
  styleUrls: ['reception-time-setting.component.scss']

})

export class ReceptionTimeSettingComponent implements OnInit {
  /**
   * 予約受付時間設定
   */
  timeSettingForm: FormGroup;
  statusCommon = true;
  userLogin: any;
  isCreate = true;
  formMap: object;
  public openingTimeList: any[] = Helper.generateTime(24);
  public closingTimeList: any[] = Helper.generateTime(24);
  public status = '';
  submitted = false;
  public flag = false;
  constructor(private fb: FormBuilder,
              private reservationReceptTimeService: ReservationReceptTimeService,
              private authService: AuthService,
              private translate: TranslateService,
              private router: Router) {
  }

  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void> {
    this.initForm();
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.onGetReceptionTimeSetting();
  }

  /**
   * Init Form
   */
  initForm(): void {
    this.translate.get('receptionTime').subscribe((trans) => {
      this.status = trans.next;
      this.formMap = {
        receptType: '',
        receptStart: trans?.dayOfTheWeekSetting,
        receptEnd: trans?.dayOfTheWeekSetting,
        receptStartMo: trans?.monday,
        receptEndMo: trans?.monday,
        receptStartTu: trans?.tuesday,
        receptEndTu: trans?.tuesday,
        receptStartWe: trans?.wednesday,
        receptEndWe: trans?.wednesday,
        receptStartTh: trans?.thursday,
        receptEndTh: trans?.thursday,
        receptStartFr: trans?.friday,
        receptEndFr: trans?.friday,
        receptStartSa: trans?.saturday,
        receptEndSa: trans?.saturday,
        receptStartSu: trans?.sunday,
        receptEndSu: trans?.sunday,
        receptStartHo: trans?.celebration,
        receptEndHo: trans?.celebration,
      };
    });
    this.timeSettingForm = this.fb.group({
      id: [''],
      shopId: [null],
      receptType: ['1'],
      receptStart: [Constants.timeStore.startTime],
      receptEnd: [Constants.timeStore.endTime],
      receptStartMo: [Constants.timeStore.startTime],
      receptEndMo: [Constants.timeStore.endTime],
      receptStartTu: [Constants.timeStore.startTime],
      receptEndTu: [Constants.timeStore.endTime],
      receptStartWe: [Constants.timeStore.startTime],
      receptEndWe: [Constants.timeStore.endTime],
      receptStartTh: [Constants.timeStore.startTime],
      receptEndTh: [Constants.timeStore.endTime],
      receptStartFr: [Constants.timeStore.startTime],
      receptEndFr: [Constants.timeStore.endTime],
      receptStartSa: [Constants.timeStore.startTime],
      receptEndSa: [Constants.timeStore.endTime],
      receptStartSu: [Constants.timeStore.startTime],
      receptEndSu: [Constants.timeStore.endTime],
      receptStartHo: [Constants.timeStore.startTime],
      receptEndHo: [Constants.timeStore.endTime],
      updatedAt: [null]
    });
    setTimeout(() => {
      this.updateFormValidators();
    });
  }

  /**
   * Update form validators
   */
  updateFormValidators(): void {
    for (const key in this.timeSettingForm.controls) {
      this.timeSettingForm.get(key).clearValidators();
    }
    if (this.timeSettingForm.controls.receptType.value === '1') {
      this.timeSettingForm.get('receptEnd').setValidators(ValidatorService.isGteDate('receptStart', true));
    } else {
      this.timeSettingForm.get('receptEndMo').setValidators(ValidatorService.isGteDate('receptEndMo', true));
      this.timeSettingForm.get('receptEndTu').setValidators(ValidatorService.isGteDate('receptStartTu', true));
      this.timeSettingForm.get('receptEndWe').setValidators(ValidatorService.isGteDate('receptStartWe', true));
      this.timeSettingForm.get('receptEndTh').setValidators(ValidatorService.isGteDate('receptStartTh', true));
      this.timeSettingForm.get('receptEndFr').setValidators(ValidatorService.isGteDate('receptEndMo', true));
      this.timeSettingForm.get('receptEndSa').setValidators(ValidatorService.isGteDate('receptStartSa', true));
      this.timeSettingForm.get('receptEndSu').setValidators(ValidatorService.isGteDate('receptStartSu', true));
      this.timeSettingForm.get('receptEndHo').setValidators(ValidatorService.isGteDate('receptStartHo', true));
    }

    for (const key in this.timeSettingForm.controls) {
      if (key === 'id' || key === 'updatedAt') {
        continue;
      }
      this.timeSettingForm.get(key).updateValueAndValidity();
    }
  }

  /**
   * Parser Object
   */
  parserObj(obj: any): object {
    return {
      id: obj.id,
      shop_id: obj.shopId,
      recept_type: obj.receptType,
      recept_start: obj.receptStart,
      recept_end: obj.receptEnd,
      recept_start_mo: obj.receptStartMo,
      recept_end_mo: obj.receptEndMo,
      recept_start_tu: obj.receptStartTu,
      recept_end_tu: obj.receptEndTu,
      recept_start_we: obj.receptStartWe,
      recept_end_we: obj.receptEndWe,
      recept_start_th: obj.receptStartTh,
      recept_end_th: obj.receptEndTh,
      recept_start_fr: obj.receptStartFr,
      recept_end_fr: obj.receptEndFr,
      recept_start_sa: obj.receptStartSa,
      recept_end_sa: obj.receptEndSa,
      recept_start_su: obj.receptStartSu,
      recept_end_su: obj.receptEndSu,
      recept_start_ho: obj.receptStartHo,
      recept_end_ho: obj.receptEndHo,
      updated_at: obj.updatedAt,
    };
  }

  /**
   * Parse Into Form
   */
  parseIntoForm(obj: any): void {
    this.timeSettingForm.controls.id.setValue(obj.id);
    this.timeSettingForm.controls.receptType.setValue(obj.recept_type);
    this.timeSettingForm.controls.receptStart.setValue(obj.recept_start.substr(0, 5));
    this.timeSettingForm.controls.receptEnd.setValue(obj.recept_end.substr(0, 5));
    this.timeSettingForm.controls.receptStartMo.setValue(obj.recept_start_mo.substr(0, 5));
    this.timeSettingForm.controls.receptEndMo.setValue(obj.recept_end_mo.substr(0, 5));
    this.timeSettingForm.controls.receptStartTu.setValue(obj.recept_start_tu.substr(0, 5));
    this.timeSettingForm.controls.receptEndTu.setValue(obj.recept_end_tu.substr(0, 5));
    this.timeSettingForm.controls.receptStartWe.setValue(obj.recept_start_we.substr(0, 5));
    this.timeSettingForm.controls.receptEndWe.setValue(obj.recept_end_we.substr(0, 5));
    this.timeSettingForm.controls.receptStartTh.setValue(obj.recept_start_th.substr(0, 5));
    this.timeSettingForm.controls.receptEndTh.setValue(obj.recept_end_th.substr(0, 5));
    this.timeSettingForm.controls.receptStartFr.setValue(obj.recept_start_fr.substr(0, 5));
    this.timeSettingForm.controls.receptEndFr.setValue(obj.recept_end_fr.substr(0, 5));
    this.timeSettingForm.controls.receptStartSa.setValue(obj.recept_start_sa.substr(0, 5));
    this.timeSettingForm.controls.receptEndSa.setValue(obj.recept_end_sa.substr(0, 5));
    this.timeSettingForm.controls.receptStartSu.setValue(obj.recept_start_su.substr(0, 5));
    this.timeSettingForm.controls.receptEndSu.setValue(obj.recept_end_su.substr(0, 5));
    this.timeSettingForm.controls.receptStartHo.setValue(obj.recept_start_ho.substr(0, 5));
    this.timeSettingForm.controls.receptEndHo.setValue(obj.recept_end_ho.substr(0, 5));
    this.timeSettingForm.controls.updatedAt.setValue(obj.updated_at);
    this.timeSettingForm.controls.shopId.setValue(obj.shop_id);
    this.updateFormValidators();
  }

  /**
   * On ComboBox Select
   */
  changeType(val): void {
    this.timeSettingForm.controls.receptType.setValue(val);
    this.updateFormValidators();
    this.statusCommon = val === '1' ? true : false;
  }

  /**
   * Get Reception Time Setting
   */
  onGetReceptionTimeSetting(): void {
    this.reservationReceptTimeService.getReservationReceptTime(this.userLogin.shop_id)
      .subscribe((res) => {
        if (res.length) {
           this.flag = true;
          this.translate.get('common').subscribe((trans) => {
            this.status = trans.update;});
          this.parseIntoForm(res[0]);
          this.isCreate = false;
          this.statusCommon = res[0].recept_type === '1' ? true : false;
          return;
        }
      });
  }

  /**
   * Get form control
   */
  get f() {
    return this.timeSettingForm.controls;
  }

  get v() {
    return this.timeSettingForm.value;
  }

  /**
   * Submit Form
   */
  onSubmit(): void {
    this.submitted = true;

    if (!this.timeSettingForm.valid) {
      return;
    }

    const obj: any = this.parserObj(this.timeSettingForm.getRawValue());
    if (this.isCreate) {
      this.reservationReceptTimeService.createReservationReceptTime(obj, String(this.userLogin.shop_id))
        .subscribe((res) => {
          this.submitted = false;
          this.router.navigateByUrl('reservation-setting/step-2');
        });
      return;
    }
    this.reservationReceptTimeService.updateReservationReceptTime(String(this.userLogin.shop_id), obj)
      .subscribe((res) => {
        this.submitted = false;
        this.onGetReceptionTimeSetting();
      });
  }
}
