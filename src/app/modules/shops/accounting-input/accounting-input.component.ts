import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/constants/constants';
import { Customer } from 'src/app/core/models';
import { AuthService } from 'src/app/core/services';
import { CustomerService, DiscountService, TaxService } from 'src/app/core/services/apis';
import { ListOfVisitTodayService } from 'src/app/core/services/apis/list-of-visit-today.service';
import { Helper } from 'src/app/core/utils/helper';

@Component({
  selector: 'app-accounting-input',
  templateUrl: './accounting-input.component.html',
  styleUrls: ['./accounting-input.component.scss']
})
export class AccountingInputComponent implements OnInit {
  userLogin;
  shopId;
  customerInfo: Customer;
  helper = Helper;
  isOpen = false;
  productList = [];
  taxList;
  discountList;
  totalAmount = 0;
  orderObj;
  data;
  receptionDate = new Date();
  abbreviationCategory = Constants.abbreviationCategory;
  openSearch = false;
  math = Math;
  constructor(
    private authService: AuthService,
    private taxService: TaxService,
    private customerService: CustomerService,
    private discountService: DiscountService,
    private router: Router,
    private listMenuService: ListOfVisitTodayService,
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.data = this.router.getCurrentNavigation().extras.state;
    }
   }

  /**
   * コンポーネント初期処理
   */
  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.shopId = this.userLogin.shop_id;
    this.discountList = await this.discountService.getDiscountList(this.shopId).toPromise();
    this.taxList = await this.taxService.getTaxList(this.shopId).toPromise();
    if (this.data) {
      this.customerInfo = await this.customerService.getCustomer(this.shopId, this.data.customer_id).toPromise();
      for (let i = 0; i < this.data.details.length; i++) {
        const menus = await this.listMenuService.getMenuId(this.userLogin.shop_id, {
          category_cd: this.data.details[i].category_cd,
          menu_id: this.data.details[i].menu_id
        }).toPromise();
        if (menus.tax_id) {
          this.taxService.getTax(this.shopId, menus.tax_id).subscribe((res) => {
            this.productList.push({
              ...menus, tax: res.tax, abbreviationCategory: this.getAbbreviationCategory(menus.category_cd),
              qty: menus.qty ? menus.qty : 1, isDiscount: menus.isDiscount ? menus.isDiscount : false,
              discountId: menus.discountId ? menus.discountId : null, discount: menus.discount ? menus.discount : 0,
              discountType: menus.discountType ? menus.discountType : '', discountQty: menus.discountQty ? menus.discountQty : 1
            });
            this.total();
          });
        } else {
          this.productList.push({
            ...menus, tax: 10, abbreviationCategory: this.getAbbreviationCategory(menus.category_cd),
            qty: menus.qty ? menus.qty : 1, isDiscount: menus.isDiscount ? menus.isDiscount : false,
            discountId: menus.discountId ? menus.discountId : null, discount: menus.discount ? menus.discount : 0,
            discountType: menus.discountType ? menus.discountType : '', discountQty: menus.discountQty ? menus.discountQty : 1
          });
          this.total();
        }
      }
    } else {
      this.orderObj = JSON.parse(localStorage.getItem('order'));
      if (this.orderObj) {
        this.productList = this.orderObj.details;
        this.customerInfo = await this.customerService.getCustomer(this.shopId, this.orderObj.customerId).toPromise();
        this.total();
      }
    }

  }

  /**
    * レジスターを開く
    */
  openModal(): void {
    this.isOpen = true;
  }

  /**
   * モーダルを閉じる
   */
  async confirmModal(event: any): Promise<void> {
    this.isOpen = event.open;
    this.productList = [];
    for (let i = 0; i < event.data.length; i++) {
      if (event.data[i].tax_id) {
        this.taxService.getTax(this.shopId, event.data[i].tax_id).subscribe((res) => {
          this.productList.push({
            ...event.data[i], tax: res.tax, abbreviationCategory: this.getAbbreviationCategory(event.data[i].category_cd),
            qty: event.data[i].qty ? event.data[i].qty : 1, isDiscount: event.data[i].isDiscount ? event.data[i].isDiscount : false,
            discountId: event.data[i].discountId ? event.data[i].discountId : null, discount: event.data[i].discount ? event.data[i].discount : 0,
            discountType: event.data[i].discountType ? event.data[i].discountType : '', discountQty: event.data[i].discountQty ? event.data[i].discountQty : 1
          });
          this.total();
        });
      } else {
        this.productList.push({
          ...event.data[i], tax: 10, abbreviationCategory: this.getAbbreviationCategory(event.data[i].category_cd),
          qty: event.data[i].qty ? event.data[i].qty : 1, isDiscount: event.data[i].isDiscount ? event.data[i].isDiscount : false,
          discountId: event.data[i].discountId ? event.data[i].discountId : null, discount: event.data[i].discount ? event.data[i].discount : 0,
          discountType: event.data[i].discountType ? event.data[i].discountType : '', discountQty: event.data[i].discountQty ? event.data[i].discountQty : 1
        });
        this.total();
      }
    }
  }

  /**
   * Remove item
   * @param id
   * @param menuId
   */
  removeItem(id, menuId) {
    this.productList = this.productList.filter(x => x.menu_id !== menuId || x.id !== id);
    this.total();
  }

  /**
   * Get total Price
   */
  total() {
    let amount = 0;
    if (this.productList) {
      for (let i = 0; i < this.productList.length; i++) {
        const price = this.productList[i].price * this.productList[i].qty;
        const tax = this.productList[i].tax / 100;
        let discount = 0;
        if (this.productList[i].isDiscount && this.productList[i].discountType == '2') {
          discount = this.productList[i].discount * this.productList[i].discountQty;
          amount += Math.ceil((price - discount) + ((price - discount) * tax));
        } else if (this.productList[i].isDiscount && this.productList[i].discountType == '1') {
          discount = (price * this.productList[i].discount) / 100;
          amount += Math.ceil((price - discount) + ((price - discount) * tax));
        } else {
          amount += Math.ceil(price + (price * tax));
          this.totalAmount = amount >= 0 ? amount : 0;
        }
      }
    }
    this.totalAmount = amount >= 0 ? amount : 0;
  }

  /**
   * Get discount info per product
   * @param product
   */
  getDiscountInfo(product) {
    this.discountService.getDiscount(this.shopId, product.discountId).subscribe((res) => {
      for (let i = 0; i < this.productList.length; i++) {
        if (product.id === this.productList[i].id && product.category_cd === this.productList[i].category_cd) {
          this.productList[i].discount = res[0].discount;
          this.productList[i].discountType = res[0].discount_type;
          this.total();
          break;
        }
      }
    });
  }

  /**
   * Go to next screen
   */
  nextPage() {
    if (this.productList.length == 0) {
      return;
    }
    const order = {
      customerId: this.customerInfo.id,
      customerName: this.customerInfo.firstname + ' ' + this.customerInfo.lastname,
      gender: this.helper.getSex(this.customerInfo.sex),
      visitCnt: this.customerInfo.visit_cnt,
      lastVisit: this.customerInfo.last_visit,
      qty: this.productList.length,
      money: this.totalAmount,
      details: this.productList,
      reservationId: this.data ? this.data.id : null,
      paymentId: this.orderObj ? this.orderObj.paymentId : null,
    };
    localStorage.setItem('order', JSON.stringify(order));
    this.router.navigate(['shops/accounting-confirmation']);
  }

  /**
   * Get Abbreviation Category
   * @param data
   */
  getAbbreviationCategory(data) {
    let text = '';
    for (const item of this.abbreviationCategory) {
      if (item.value === data) {
        text = item.key;
      }
    }
    return text;
  }

  /**
   * Get || Delete discount
   * @param data
   */
  getDiscount(data) {
    data.isDiscount = !data.isDiscount;
    if (!data.isDiscount) {
      data.discount = 0;
      this.total();
    } else {
      if (data.discountId) {
        this.discountService.getDiscount(this.shopId, data.discountId).subscribe((res) => {
          data.discount = res[0].discount;
          this.total();
        });
      }
    }
  }

  /**
   * Go back to previous screen
   */
  goBack() {
    this.router.navigate(['/top']);
  }

  /**
   * Search customer
   */
  customerSearch(): void {
    this.openSearch = true;
  }

  searchResult(event: any): void {
    this.openSearch = event.status;
    this.customerInfo = event.customerList;
  }
}


