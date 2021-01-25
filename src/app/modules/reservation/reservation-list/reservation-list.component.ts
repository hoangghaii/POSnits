import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services';
import { ReservationService } from 'src/app/core/services/apis';
import { ListOfVisitTodayService } from 'src/app/core/services/apis/list-of-visit-today.service';
import { Helper } from 'src/app/core/utils/helper';
import { LocalTime } from 'src/app/core/utils/local-time';
import { VisitFlg } from 'src/app/constants/global-const';
/**
 * ReservationListComponent
 * 予約リストコンポーネント
 */
@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss']
})
export class ReservationListComponent implements OnInit {
  public userLogin: any;
  public listReservations = [];
  public listVisits = [];
  public listVisitors = []
  public totalCustomer = '0';
  public totalPrice = '0';
  public customerUnitPrice = "0";
  public today = new Date();
  public dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
  public displayDay = '';

  /**
   * Open modal
   */
  open = false;

  /**
   * item selected
   */
  selectCurrent: any;

  constructor(
    private reserService: ReservationService,
    private authService: AuthService,
    private listMenuService: ListOfVisitTodayService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    await this.getData();
    this.totalCustomer = Helper.formatZero(this.calTotalCustomer());
    this.displayDay = this.today.getMonth() + 1 + '' + '月' + +this.today.getDate() + '日' + '' + '(' + this.dayOfWeek[this.today.getDay()] + ')'
  }
  async getData(): Promise<void> {
    this.listReservations = await this.getListReservations();
    this.listReservations = this.parseReservations(this.listReservations);

  }
  parseReservations(listReservations: any[]): any[] {
    let price = 0;
    this.listReservations = this.listReservations.sort((a, b) => {
      const d1 = new Date(a.reservation_time).getTime();
      const d2 = new Date(b.reservation_time).getTime();
      return d1 - d2;
    });

    listReservations.forEach(item => {
      item.details.forEach(detail => {
        price += detail?.price ? detail.price : 0;
      });
    });
    this.totalPrice = Helper.formatCurrency(price);
    if (listReservations.length == 0) {
      this.customerUnitPrice = Helper.formatCurrency(0);
    } else {
      this.customerUnitPrice = Helper.formatCurrency(price / listReservations.length);
    }
    return listReservations;
  }
  /**
  * 総顧客を計算する
  */
  calTotalCustomer(): number {
    const customers = [];
    this.listReservations.forEach(item => {
      if (!customers.includes(item.customer_id)) {
        customers.push(item.customer_id);
      }
    });
    return customers.length;
  }

  /**
   * リスト予約を取得する
   */
  async getListReservations(): Promise<any[]> {
    return this.reserService.getReservationList(this.userLogin.shop_id, '', '', LocalTime.formatDate(this.today), VisitFlg.notYetVisit.toString())
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
