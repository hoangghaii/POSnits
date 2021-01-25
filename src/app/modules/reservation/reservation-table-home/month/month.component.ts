import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/core/services';
import { ReservationService } from 'src/app/core/services/apis';
import { LocalTime } from 'src/app/core/utils/local-time';
import {Constants} from 'src/app/constants/constants';

@Component({
  selector: 'app-month',
  templateUrl: 'month.component.html',
  styleUrls: ['month.component.scss']
})

export class MonthComponent implements OnInit, OnChanges {
  userLogin;
  selectedDate: string = '';
  reservations = [];
  choiceDate = {
    date: null,
    month: null,
    year: null,
    day: ''
  };
  dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
  dateSelected: string = '';
  monthSelected = LocalTime.formatDate(new Date());
  reservationsSort = [];
  reservationItems = [];
  visitFlg: string = '0';
  categoryCd = Constants.categoryCd;
  visitFlgConstants = Constants.visitFlg;
  sex = Constants.sex;

  @Input() statusClose: string;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);

  constructor(private authService: AuthService, private reservationService: ReservationService) { }

  /**
   * Event Change
   */
  ngOnChanges(): void {
    if (this.statusClose === 'upCreate') {
      this.getReservationList(this.visitFlg, this.monthSelected);
    }
  }

  async ngOnInit() {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.getCurrentDate();
    this.getReservationList(this.visitFlg, this.monthSelected);
  }

  /**
   * On select date in celenndar
   */
  onSelectDate(event) {
    this.dateSelected = event
    const date = this.dateSelected.split('-')[2];
    const month = this.dateSelected.split('-')[1];
    const year = this.dateSelected.split('-')[0];
    const day = new Date(parseInt(year), parseInt(month) - 1, parseInt(date));
    this.choiceDate = {
      date: date,
      month: month,
      year: year,
      day: this.dayOfWeek[day.getDay()]
    }
    if (month && this.monthSelected != this.dateSelected) {
      this.monthSelected = this.dateSelected;
      this.getReservationList(this.visitFlg, this.monthSelected);
    }
    this.reservationItems = [];
    this.reservations.map((item, index) => {
      let dateItem = new Date(item.reservation_time).getDate();
      if (parseInt(date) === dateItem) {
        this.reservationItems.push(item);
      }
    })
  }

  /**
   * Get current date
   */
  getCurrentDate() {
    this.selectedDate = LocalTime.formatDate(new Date());
  }

  /**
   * Get Rservation List
   */
  getReservationList(visitFlg: string, month: string) {
    this.reservationService.getReservationList(this.userLogin.shop_id, month, '', '', visitFlg).subscribe(res => {
      if (res) {
        this.reservationsSort = [];
        this.reservations = res;
        this.reservations.forEach(i => {
          let abc = new Date(i.reservation_time).getDate();
          this.reservationsSort[abc] = (this.reservationsSort[abc] || 0) + 1;
        })
      }
    });
  }

  /**
   * On click next day "翌日"
   */
  nextDay() {
    this.selectedDate = LocalTime.formatDate(new Date(parseInt(this.choiceDate.year), parseInt(this.choiceDate.month) - 1, parseInt(this.choiceDate.date) + 1));
  }

  /**
   * On click next and prev in celenndar
   */
  onNextPrev(event) {
    this.getReservationList(this.visitFlg, event);
  }

  /**
   * On handle detail
   */
  handleDetail(item) {
    this.confirm.emit({ isOpen: true, status: 'upDate', currentSelect: item });
  }
}
