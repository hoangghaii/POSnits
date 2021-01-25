import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';

import {Helper} from 'src/app/core/utils/helper';
import {CompanyService, StoreService, CompanyContractService} from 'src/app/core/services/apis';

@Component({
  selector: 'app-contract-complete',
  templateUrl: './contract-complete.component.html',
  styleUrls: ['./contract-complete.component.scss']
})
export class ContractCompleteComponent implements OnInit {
  /**
   * Helper Util
   */
  helper = Helper;

  /**
   * 契約者・店舗情報・ログイン情報 ・契約内容
   */
  contract;

  constructor(private fb: FormBuilder,
              private router: Router,
              private companyService: CompanyService,
              private shopService: StoreService,
              private compContractService: CompanyContractService) {
    this.contract = this.router.getCurrentNavigation().extras.state;
  }

  /**
   * Init component
   */
  async ngOnInit(): Promise<any> {
    if (!this.contract || !this.contract.hasOwnProperty('company') || !this.contract.hasOwnProperty('shop')
      || !this.contract.hasOwnProperty('user') || !this.contract.hasOwnProperty('serviceFee')) {
      this.back();
    }

    const company = {
      name: this.contract.company.name,
      postal_cd: this.contract.company.postalCd,
      prefecture: this.contract.company.prefecture,
      city: this.contract.company.city,
      area: this.contract.company.area,
      address: this.contract.company.address + ' ' + this.contract.company.extAddress,
      accounting: this.contract.company.accounting,
      cutoff_date: this.contract.company.cutoffDate,
      updated_at: new Date()
    };
    const rsCompany = await this.companyService.addCompany(company).toPromise();
    if (rsCompany) {
      const shop = {
        company_id: rsCompany.id,
        name: this.contract.shop.name,
        postal_cd: this.contract.shop.postalCd,
        prefecture: this.contract.shop.prefecture,
        city: this.contract.shop.city,
        area: this.contract.shop.area,
        address: this.contract.shop.address + ' ' + this.contract.shop.extAddress,
        email: this.contract.shop.email,
        updated_at: new Date()
      };

      const rsShop = await this.shopService.addStore(shop).toPromise();

      if (rsShop) {
        const user = {
          shop_id: rsShop.id,
          company_id: rsCompany.id,
          name: this.contract.user.name,
          login_id: this.contract.user.email,
          password: this.contract.user.password,
          email: this.contract.user.email,
          updated_at: new Date()
        };
        const companyContract = {
          company_id: rsCompany.id,
          web_reserv_flg: this.contract.serviceFee.web === true ? 1 : 0,
          settlement_flg: this.contract.serviceFee.payment === true ? 1 : 0,
          updated_at: new Date()
        };
        const rsUser = await this.companyService.createUser(rsCompany.id, user).toPromise();
        rsUser.password = this.contract.user.password;
        const contract = {...companyContract, ...{shop: rsShop, user: rsUser, fee: this.contract.serviceFee}};
        await this.compContractService.createContract(contract).toPromise();
      }
    }
  }

  /**
   * Back menu
   */
  back(): void {
    this.router.navigate(['contracts'], {state: this.contract});
  }

  /**
   * Complete
   */
  goToComplete(): void {
  }
}
