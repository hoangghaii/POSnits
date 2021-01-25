import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, ModalService } from 'src/app/core/services';
import { ValidatorService } from 'src/app/core/services';
import { Helper } from 'src/app/core/utils/helper';
import { AccoutingCustodyService, CustomerService, ReservationService } from 'src/app/core/services/apis';
import { Router } from '@angular/router';
import { Constants } from 'src/app/constants/constants';
import * as moment from 'moment';

@Component({
  selector: 'app-accounting-custody',
  templateUrl: './accounting-custody.component.html',
  styleUrls: ['./accounting-custody.component.scss'],
})
export class AccountingCustodyComponent implements OnInit {
  /**
   * Current user
   */
  userLogin: any;

  /**
   * Form map msg
   */
  formMap: any;

  /**
   * Form account
   */
  formCreateAccount: FormGroup;

  /**
   * Info
   */
  customerInfo: any;

  /**
   * Constant
   */
  helper = Helper;
  gender = Constants;

  /**
   * Check submit
   */
  submitted = false;

  /**
   * First visit date
   */
  firstVisitDate = new Date();

  /**
   * list sale
   */
  listSales: any = [];

  objInfo: any;
  receptionDate = new Date();

  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private accoutingCustodyService: AccoutingCustodyService,
    private router: Router,
    private reservationService: ReservationService,
  ) { }

  /**
   * コンポーネント初期処理
   */
  async ngOnInit(): Promise<void> {
    this.initForm();
    this.objInfo = await JSON.parse(localStorage.getItem('order'));
    this.userLogin = await this.authService.getCurrentUser().toPromise();
  }

  /**
   * 初期化フォーム
   */
  initForm(): void {
    this.translate.get('accoutingCustody').subscribe((trans) => {
      this.formMap = {
        moneyInput: trans?.cash,
      };
    });

    this.formCreateAccount = this.fb.group({
      moneyInput: [null, [ValidatorService.required, ValidatorService.maxLength(20)]],
    });
  }

  /**
   * フォームフィールドに簡単にアクセスできる便利なゲッター
   */
  get f(): any {
    return this.formCreateAccount.controls;
  }

  /**
   * 作成および更新
   */
  handleCreate(): void {
    this.submitted = true;

    if (!this.formCreateAccount.valid) {
      return;
    }

    if (!this.objInfo.reservationId) {
      const reservation = this.parseObjReservation();
      this.reservationService.createReservation(String(this.userLogin.shop_id), reservation).subscribe((res) => {
        this.objInfo.reservationId = res[0].id;
        const obj = [this.parserObj(this.objInfo)];
        this.accoutingCustodyService.createSale(String(this.userLogin.shop_id), obj).subscribe(res => {
          localStorage.setItem('objLS', JSON.stringify(
            {
              customerName: this.objInfo.customerName,
              gender: this.objInfo.gender,
              visitCnt: this.objInfo.visitCnt,
              lastVisit: this.objInfo.lastVisit,
              totalMoneyInput: this.getTotalMoney(),
              moneyInput: this.formCreateAccount.controls.moneyInput.value,
              money: this.objInfo.money,
              saleId: res[0].id,
            }));
          localStorage.removeItem("order");
          this.router.navigate(['/shops/accounting-completed']);
        });
      });
    } else {
      const obj = [this.parserObj(this.objInfo)];
      this.accoutingCustodyService.createSale(String(this.userLogin.shop_id), obj).subscribe(res => {
        localStorage.setItem('objLS', JSON.stringify(
          {
            customerName: this.objInfo.customerName,
            gender: this.objInfo.gender,
            visitCnt: this.objInfo.visitCnt,
            lastVisit: this.objInfo.lastVisit,
            totalMoneyInput: this.getTotalMoney(),
            moneyInput: this.formCreateAccount.controls.moneyInput.value,
            money: this.objInfo.money,
            saleId: res[0].id,
          }));
        localStorage.removeItem("order");
        this.router.navigate(['/shops/accounting-completed']);
      });
    }
  }

  /**
   * オブジェクトの解析
   */
  parserObj(obj: any): object {
    const detail = [];
    obj.details.forEach(item => {
      const value = {
        id: null,
        sale_id: item?.saleId,
        category_cd: item?.category_cd,
        menu_id: item?.id,
        money: item?.price,
        tax_id: item?.tax_id,
        discont_id: item?.discountId,
        discount: item?.discount,
        amount: item?.qty,
        updated_at: item?.updateAt,
      };
      detail.push(value);
    });
    return {
      customer_id: obj?.customerId,
      shop_id: String(this.userLogin.shop_id),
      reservation_id: obj.reservationId ? obj.reservationId : null,
      payment_id: obj.paymentId ? obj.paymentId : null,
      money: obj?.money,
      update_at: obj?.updateAt,
      details: detail,
    };
  }

  /**
   * Get Money
   */
  getTotalMoney(): number {
    if (this.formCreateAccount.controls.moneyInput.value === null) {
      return 0;
    }
    return this.formCreateAccount.controls.moneyInput.value - this.objInfo.money;
  }

  /**
   * Get full name
   */
  getFullName(): string {
    return `${this.customerInfo.firstname} ${this.customerInfo?.lastname}`;
  }

  /**
   * Go back to previous screen
   */
  back() {
    this.router.navigate(['shops/accounting-confirmation']);
  }

  /**
   * Parse obj create reservation
   */
  parseObjReservation(): any {
    const reservationTime = new Date();
    let totalTreatmentTime = 0;
    let details = [];
    this.objInfo.details.forEach((element, i) => {
      const obj = {
        id: null,
        reservation_id: null,
        treatment_time: element.treatment_time ? element.treatment_time : 0,
        category_cd: element.category_cd,
        menu_id: element.id,
        equipment1: null,
        equipment2: null,
        staff_id: null,
        updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      };
      details.push(obj);
      totalTreatmentTime += element.treatment_time ? element.treatment_time : 0;
    });

    return [{
      id: null,
      customer_id: this.objInfo.customerId,
      shop_id: this.userLogin.shop_id,
      reservation_time: moment(reservationTime).format('YYYY-MM-DD HH:mm:ss'),
      staff_id: null,
      treatments_time: totalTreatmentTime,
      web_reservation_flg: '0',
      prepaid_flg: '0',
      visit_flg: '0',
      payment_flg: '0',
      cancel_flg: '0',
      remark: '',
      memo: '',
      details: details,
      updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    }];
  }
}
