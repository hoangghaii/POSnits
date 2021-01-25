import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/constants/constants';
import { Reservation } from 'src/app/core/models';
import { AuthService, ModalService } from 'src/app/core/services';
import { CustomerService, MenuReserveService, ReservationService, StaffService } from 'src/app/core/services/apis';
import { ListOfVisitTodayService } from 'src/app/core/services/apis/list-of-visit-today.service';
import { Helper } from 'src/app/core/utils/helper';
import { LocalTime } from 'src/app/core/utils/local-time';
import {VisitFlg} from 'src/app/constants/global-const';

/**
 * ListOfVisitTodayComponent
 * 訪問コンポーネントのリスト
 */
@Component({
  selector: 'app-list-of-visit-today',
  templateUrl: './list-of-visit-today.component.html',
  styleUrls: ['./list-of-visit-today.component.scss']
})
export class ListOfVisitTodayComponent implements OnInit {

  public userLogin: any;
  public visitedReservations = [];
  public totalPriceVisit = '0';
  public totalCustomerVisit = '0';
  public customerUnitPriceVisit = '0';

  /**
   * Open modal
   */
  open = false;

  /**
   * item selected
   */
  selectCurrent: any;

  public today = new Date();
  public dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
  public displayDay = '';

  /**
   * コンストラクタ
   * @param reserService
   * @param authService
   * @param listMenuService
   * @param router
   * @param modalService
   */
  constructor(
    private reserService: ReservationService,
    private authService: AuthService,
    private listMenuService: ListOfVisitTodayService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    await this.getData();
    this.displayDay = this.today.getMonth() + 1 + '' + '月' + +this.today.getDate() + '日' + '' + '(' + this.dayOfWeek[this.today.getDay()] + ')'
  }

  /**
   * Research
   */
  async getData(): Promise<void> {
    this.visitedReservations = await this.getReservations(VisitFlg.visited);
    this.visitedReservations = await this.parseReservations(this.visitedReservations, VisitFlg.visited);
    this.totalCustomerVisit = Helper.formatZero(this.calTotalCustomer(this.visitedReservations));
  }

  /**
   * 総顧客を計算する
   */
  calTotalCustomer(list): number {
    const customers = [];
    list.forEach(item => {
      if (!customers.includes(item.customer_id)) {
        customers.push(item.customer_id);
      }
    });
    return customers.length;
  }

  /**
   * リストビスティットを取得する
   */
  parseReservations(reservations, flg = VisitFlg.notYetVisit): any {
    let price = 0;
    reservations = reservations.sort((a, b) => {
      const d1 = new Date(a.reservation_time).getTime();
      const d2 = new Date(b.reservation_time).getTime();
      return d1 - d2;
    });

    reservations.forEach(item => {
      item.details.forEach(detail => {
        price += detail?.price ? detail.price : 0;
      });
    });

    this.totalPriceVisit = Helper.formatCurrency(price);
    this.customerUnitPriceVisit = Helper.formatCurrency(price / reservations.length);
    if (reservations.length == 0) {
      this.customerUnitPriceVisit = Helper.formatCurrency(0);
    }
    return reservations;
  }

  /**
   * リスト予約を取得する
   */
  async getReservations(visitFlg): Promise<any[]> {
    return this.reserService.getReservationList(this.userLogin.shop_id, '', '', LocalTime.formatDate(this.today), visitFlg)
      .toPromise();
  }

  /**
   * Open modal
   */
  openModal(): void {
    this.open = true;
  }

   /**
   * Close modal
   */
  async closeModal(event: any): Promise<void> {
    if (event && event.status === 'update') {
      this.getData();
    }
    this.open = event.open;
  }

  /**
   * Click row
   */
  selectedRow(select: any): void {
    this.selectCurrent = select;
    this.open = true;
  }
}
