import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from 'src/app/core/services';
import {ReservationService} from 'src/app/core/services/apis';
import {ListOfVisitTodayService} from 'src/app/core/services/apis/list-of-visit-today.service';
import {Helper} from 'src/app/core/utils/helper';
import {LocalTime} from 'src/app/core/utils/local-time';
import {VisitFlg} from 'src/app/constants/global-const';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {
  public userLogin: any;
  public totalCustomer = '0';
  public totalPrice = '0';
  public customerUnitPrice = '0';
  public totalCustomerVisit = '0';
  public totalPriceVisit = '0';
  public customerUnitPriceVisit = '0';
  public today = new Date();
  reservations = [];
  visitedReservations = [];
  /**
   * Open modal
   */
  open = false;

  /**
   * item selected
   */
  selectCurrent: any;

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private listMenuService: ListOfVisitTodayService,
    private router: Router,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    await this.getData();
  }

  /**
   * リスト予約を取得する
   */
  async getReservations(visitFlg): Promise<any[]> {
    return this.reservationService.getReservationList(this.userLogin.shop_id, '', '', LocalTime.formatDate(this.today), visitFlg)
      .toPromise();
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

    if (flg === VisitFlg.notYetVisit) {
      this.totalPrice = Helper.formatCurrency(price);
      if(reservations.length == 0){ 
            this.customerUnitPrice = Helper.formatCurrency(0);
       }
       else{
            this.customerUnitPrice = Helper.formatCurrency(price / reservations.length);
            }
    } else {
      this.totalPriceVisit = Helper.formatCurrency(price);
      if(reservations.length == 0){  
          this.customerUnitPriceVisit = Helper.formatCurrency(0);
        }
      else{
          this.customerUnitPriceVisit = Helper.formatCurrency(price / reservations.length);
      }
     
    }

    return reservations;
  }

  /**
   * Click row
   */
  selectedRow(select: any): void {
    this.selectCurrent = select;
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
   * Research
   */
  async getData(): Promise<void> {
    this.reservations = await this.getReservations(VisitFlg.notYetVisit);
    this.reservations = await this.parseReservations(this.reservations);
    this.visitedReservations = await this.getReservations(VisitFlg.visited);
    this.visitedReservations = await this.parseReservations(this.visitedReservations, VisitFlg.visited);

    this.totalCustomer = Helper.formatZero(this.calTotalCustomer(this.reservations));
    this.totalCustomerVisit = Helper.formatZero(this.calTotalCustomer(this.visitedReservations));
  }

  /**
   * Change router
   */
  changeRouter(name): void {
    if (name === 'listReservation') {
      this.router.navigate(['reservations/list-reservation']);
    } else {
      this.router.navigate(['reservations/list-of-visit-today']);
    }
  }
}
