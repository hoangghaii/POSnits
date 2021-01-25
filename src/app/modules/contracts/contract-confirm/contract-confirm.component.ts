import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Helper} from 'src/app/core/utils/helper';
import {Constants} from 'src/app/constants/constants';

@Component({
  selector: 'app-contract-confirm',
  templateUrl: './contract-confirm.component.html',
  styleUrls: ['./contract-confirm.component.scss']
})
export class ContractConfirmComponent implements OnInit {
  /**
   * Helper Util
   */
  helper = Helper;

  /**
   * 契約者・店舗情報・ログイン情報 ・契約内容
   */
  contract;

  /**
   * 会計処理設定一覧
   */
  accountingList = Constants.listAccounting;

  constructor(private fb: FormBuilder,
              private router: Router,
              private translate: TranslateService) {
    this.contract = this.router.getCurrentNavigation().extras.state;
  }

  /**
   * Init component
   */
  ngOnInit(): void {
    if (!this.contract) {
      this.back();
    }
  }

  /**
   * Back menu
   */
  back(isClick = false): void {
    if (isClick) {
      this.router.navigate(['contracts/selection'], {state: this.contract});
      return;
    }
    this.router.navigate(['contracts'], {state: this.contract});
  }

  /**
   * Go to payment
   */
  goToPayment(): void {
    this.router.navigate(['contracts/complete'], {state: this.contract});
  }
}
