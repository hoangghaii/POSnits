import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from 'src/app/constants/constants';
import { AuthService, ValidatorService } from 'src/app/core/services';
import { ReceptionSettingService } from 'src/app/core/services/apis';
import { ReceptAmountDayService } from 'src/app/core/services/apis/recept-amount-day.service';

@Component({
  selector: 'app-reception-setting',
  templateUrl: 'reception-setting.component.html',
  styleUrls: ['reception-setting.component.scss'],
})
export class ReceptionSettingComponent implements OnInit {
  receptionSettingForm: FormGroup;
  isError = false;
  public receptAmountDay : any;
  public  recept_amount_day : any;
  /**
   * Check validator
   */
  submitted = false;
  /**
   * Obj
   */
  objReservRecept: any;

  /**
   * Constant
   */
  cancelSettingFlgList = Constants.cancelSettingFlg;
  cancelWaitFlgList = Constants.cancelWaitFlg;
  reservIntervalList = Constants.reservInterval;
  receptRestList = Constants.receptRest;
  cancelLimitList = Constants.cancelLimit;
  futureReservNumList = Constants.futureReservNum;
  formMap;
  public isOpen = false;
  /**
   * current user login
   */
  userLogin: any;
  public status = '';
  public flag = false;
  constructor(
    private fb: FormBuilder,
    private receptionSettingService: ReceptionSettingService,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private amountService : ReceptAmountDayService
  ) {}

  /**
   * コンポーネント初期処理
   */
  async ngOnInit() {
    this.initForm();
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    await this.reloadScreen();
  }
  /**
   * 画面のリロード
   */
  async reloadScreen ():Promise<void>{
    this.objReservRecept = await this.receptionSettingService
    .getReceptionSetting(this.userLogin.shop_id)
    .toPromise();
  if (this.objReservRecept[0]) {
    this.receptAmountDay = await this.amountService.getRecept(this.objReservRecept[0].id).toPromise();
    this.receptAmountDay =  this.receptAmountDay[0];
    this.flag = true;
    this.translate.get('common').subscribe((trans) => {
      this.status = trans.update;
    });
    const obj = this.parseObj(this.objReservRecept[0], 'update');
    this.receptionSettingForm.patchValue(obj);
  }
  }
  /**
   * 初期化フォーム
   */
  initForm() {
    this.translate.get('receptionSetting').subscribe((trans) => {
      this.status = trans.next;
      this.formMap = {
        reservInterval: trans?.reservationInterval,
        receptRest: trans?.receptionRestrictions,
        receptAmount: trans?.acceptableNumber,
        cancelSettingFlg: trans?.cancelSetting,
        cancelLimit: trans?.cancellationDeadline,
        futureReservNum: trans?.numberOfFutureReservations,
        cancelWaitFlg: trans?.waitingList,
      };
    });
    this.receptionSettingForm = this.fb.group({
      id: [null],
      shopId: [''],
      reservInterval: ['', ValidatorService.selectRequired],
      receptRest: ['', ValidatorService.selectRequired],
      receptAmount: [
        0,
        [
          ValidatorService.isNumber,
          ValidatorService.min(1),
          ValidatorService.maxLength(11),
        ],
      ],
      cancelSettingFlg: ['0', ValidatorService.selectRequired],
      cancelLimit: ['', ValidatorService.selectRequired],
      futureReservNum: ['', ValidatorService.selectRequired],
      cancelWaitFlg: ['', ValidatorService.selectRequired],
      menuSelectFlg: ['0'],
      staffSelectFlg: ['0'],
      guestFlg: ['0'],
      memberReserveFlg: ['0'],
      updatedAt: [''],
    });
  }

  /**
   * Submit form
   */
  async onSubmit(): Promise<void>{
    this.submitted = true;
    if (!this.receptionSettingForm.valid) {
      return;
    }

    const obj: any = this.parseObj(this.receptionSettingForm.getRawValue());

    if (this.receptionSettingForm.controls.id.value) {
      this.updateReception(obj);
    } else {
      this.createReception(obj);
    }
    await this.reloadScreen();
  }

  /**
   * Create Reception
   */
  createReception(obj: any) {
    this.receptionSettingService
      .createReceptionSetting(String(this.userLogin.shop_id), obj)
      .subscribe((res) => {
        let list = [];
        this.receptAmountDay.reserv_recept_id = res[0].id;
        list.push(this.receptAmountDay);
        this.amountService.createReceipts(res[0].id,list).subscribe();
        this.submitted = false;
       this.router.navigate(['reservation-setting/step-3']);
      });
  }

  /**
   * Update Reception
   */
  updateReception(obj: any) {
    this.receptionSettingService
      .updateReceptionSetting(String(this.userLogin.shop_id), obj)
      .subscribe((res) => {
        this.submitted = false;
        let list = [];
        list.push(this.receptAmountDay);
        this.amountService.update(res.id,list).subscribe();
      //  this.router.navigate(['reservation-setting/step-3']);
        this.ngOnInit();
      });
  }

  /**
   * Get form control
   */
  get f() {
    return this.receptionSettingForm.controls;
  }

  /**
   * Parse obj
   */
  parseObj(obj: any, type?: string) {
    if (type === 'update') {
      return {
        id: obj.id,
        shopId: Number(obj.shop_id),
        reservInterval: obj.reserv_interval,
        receptRest: obj.recept_rest,
        receptAmount: Number(obj.recept_amount),
        cancelSettingFlg: obj.cancel_setting_flg,
        cancelSetting_flg: obj.cancel_setting_flg,
        cancelLimit: obj.cancel_limit,
        futureReservNum: Number(obj.future_reserv_num),
        cancelWaitFlg: obj.cancel_wait_flg,
        menuSelectFlg: obj.menu_select_flg ? obj.menu_select_flg : '0',
        staffSelectFlg: obj.staff_select_flg ? obj.staff_select_flg : '0',
        guestFlg: obj.guest_flg ? obj.guest_flg : '0',
        memberReserveFlg: obj.member_reserve_flg ? obj.member_reserve_flg : '0',
        updatedAt: obj.updated_at,
      };
    }
    return {
      id: obj.id,
      shop_id: Number(obj.shopId),
      reserv_interval: obj.reservInterval,
      recept_rest: obj.receptRest,
      recept_amount: Number(obj.receptAmount),
      cancel_setting_flg: obj.cancelSettingFlg,
      cancel_limit: obj.cancelLimit,
      future_reserv_num: Number(obj.futureReservNum),
      cancel_wait_flg: obj.cancelWaitFlg,
      menu_select_flg: obj.menuSelectFlg,
      staff_select_flg: obj.staffSelectFlg,
      guest_flg: obj.guestFlg,
      member_reserve_flg: obj.memberReserveFlg,
      updated_at: obj.updatedAt,
    };
  }
  openModal(){
    this.isOpen = true;
  }
  closeModal(event){
    if(event.data){
      this.receptionSettingForm.patchValue({
        receptAmount: Number(event.data.amount),
      })
      this.receptAmountDay = event.data;
    }
    
    this.isOpen = event.open;
  }
}
