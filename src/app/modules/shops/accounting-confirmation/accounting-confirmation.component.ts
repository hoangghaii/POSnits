import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, ValidatorService } from 'src/app/core/services';
import { CustomerService, PaymentService } from 'src/app/core/services/apis';
import { Helper } from 'src/app/core/utils/helper';
import { LocalTime } from 'src/app/core/utils/local-time';

@Component({
  selector: 'app-accounting-confirmation',
  templateUrl: './accounting-confirmation.component.html',
  styleUrls: ['./accounting-confirmation.component.scss']
})
export class AccountingConfirmationComponent implements OnInit {
  paymentForm: FormGroup;
  paymentList: any;
  userLogin;
  submitted = false;
  formMap;
  cartlist;
  orderObj;
  date;
  helper = Helper;
  localTime = LocalTime;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private paymentService: PaymentService,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      paymentId: ['', [ValidatorService.selectRequired]],
    });
    this.orderObj = JSON.parse(localStorage.getItem('order'));
  }

  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    if (this.orderObj == null) {
      this.router.navigate(['/shops/accounting-input']);
    } else {
      let subTotal = 0;
      let taxTotal = 0;
      this.orderObj.details = this.orderObj.details.map(item => {
        if (item.isDiscount) {
          item.totalProduct = item.price;
          subTotal += item.qty * (item.price - item.discount);
          taxTotal += item.qty * ((item.price - item.discount) * (item.tax / 100));
        } else {
          item.totalProduct = item.price + (item.price * (item.tax / 100));
          subTotal += item.qty * item.price;
          taxTotal += item.qty * (item.price * (item.tax / 100));
        }
        item.totalAmount = item.qty * item.totalProduct;


        return item;
      });
      this.orderObj.subTotal = subTotal;
      this.orderObj.taxTotal = taxTotal;
      this.date = LocalTime.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
      this.paymentList = await this.paymentService.getListPayment(this.userLogin.shop_id).toPromise();
      if (this.orderObj.paymentId != null) {
        this.paymentForm.controls.paymentId.setValue(this.orderObj.paymentId);
      }

      this.translate.get('accounting-confirmation.paymentMethod').subscribe((trans) => {
        this.formMap = {
          paymentId: trans
        };
      });
    }

  }

  /**
   * Transition to accounting
   */
  submit() {
    this.submitted = true;
    if (!this.paymentForm.valid) {
      return;
    }
    this.orderObj.paymentId = this.paymentForm.controls.paymentId.value;
    localStorage.setItem('order', JSON.stringify(this.orderObj));
    this.router.navigate(['/shops/accounting-custody']);
  }

  /**
   * back
   */
  back() {
    this.orderObj.paymentId = this.paymentForm.controls.paymentId.value;
    localStorage.setItem('order', JSON.stringify(this.orderObj));
    this.router.navigate(['shops/accounting-input']);
  }
}
