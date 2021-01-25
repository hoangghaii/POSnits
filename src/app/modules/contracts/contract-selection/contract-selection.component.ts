import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import {ValidatorService} from 'src/app/core/services';
import {ContractSetting} from 'src/app/constants/global-const';
import {Helper} from 'src/app/core/utils/helper';

@Component({
  selector: 'app-contract-selection',
  templateUrl: './contract-selection.component.html',
  styleUrls: ['./contract-selection.component.scss']
})
export class ContractSelectionComponent implements OnInit {
  /**
   * Helper
   */
  helper = Helper;

  /**
   * 契約内容
   */
  formDetail: FormGroup;

  /**
   * Submit status
   */
  submitted = false;

  /**
   * Form map item
   */
  formMap: object;

  /**
   * Contract service fee
   */
  contractFee = ContractSetting.fee;

  /**
   * 契約者・店舗情報・ログイン情報
   */
  contract;

  constructor(private fb: FormBuilder,
              private router: Router,
              private translate: TranslateService) {
    this.contract = this.router.getCurrentNavigation().extras.state;
  }

  /**
   * Init component
   */
  ngOnInit(): void {
    this.initForm();
    if (!this.contract) {
      this.back();
    } else {
      if (this.contract.serviceFee) {
        this.formDetail.patchValue(this.contract.serviceFee);
        this.updateTotal();
      }
    }
  }

  /**
   * Init form
   */
  initForm(): void {
    this.translate.get('contractors.selectDetail').subscribe((trans) => {
      this.formMap = {
        standard: trans?.standardFeature,
        option: trans?.option,
        total: trans?.total,
      };
    });
    this.formDetail = this.fb.group({
      standard: [this.contractFee.standard],
      web: [false],
      payment: [false],
      webFee: [this.contractFee.web],
      paymentFee: [this.contractFee.payment],
      total: ['', ValidatorService.required],
    });
    this.updateTotal();
  }

  /**
   * Update total fee
   */
  updateTotal(): void {
    let total = this.formDetail.get('standard').value;
    if (this.formDetail.get('web').value) {
      total += this.formDetail.get('webFee').value;
    }

    if (this.formDetail.get('payment').value) {
      total += this.formDetail.get('paymentFee').value;
    }

    this.formDetail.get('total').setValue(total);
  }

  /**
   * Back menu
   */
  back(): void {
    this.router.navigate(['contracts'], {state: this.contract});
  }

  /**
   * Go to confirm
   */
  goToConfirm(): void {
    this.submitted = true;
    // stop here if form is invalid
    if (this.formDetail.invalid) {
      // Validation error 複数エラーがある場合は複数返す
      return;
    }

    this.router.navigate(['contracts/confirm'], {state: {...this.contract, ...{serviceFee: this.formDetail.getRawValue()}}});
  }
}
