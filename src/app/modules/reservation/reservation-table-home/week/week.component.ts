import { Component, EventEmitter, OnInit, Output, OnChanges, Input} from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SystemSetting } from 'src/app/constants/global-const';
import { AuthService } from 'src/app/core/services';
import { ReservationReceptTimeService, ReservationService } from 'src/app/core/services/apis';
import { LocalTime } from 'src/app/core/utils/local-time';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss'],
})
export class WeekComponent implements OnInit, OnChanges {
  /**
   * Current tab
   */
  tabCurrent = new BehaviorSubject<object>({
    active: true,
    index: 0,
    category: 'reservation',
  });

  /**
   * Current user
   */
  userLogin: any;

  /**
   * list
   */
  weekList: any[] = [];
  tabList = [
    {
      active: true,
      image: 'ico_calendar_gray.svg',
      title: 'reservationTable.reservation',
      category: 'reservation',
    },
    {
      active: false,
      image: 'ico_calendar_gray.svg',
      title: 'reservationTable.treatmentTable',
      category: 'treatment',
    },
    {
      active: false,
      image: 'ico_calendar_gray.svg',
      title: 'reservationTable.equipment',
      category: 'equipment',
    },
  ];

  /**
   * Reservation recept time
   */
  objReceptTime: any;

  /**
   *
   */
  dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'];

  listShow: any[];
  arrWeekDay: any = [];

  /**
   * Image default
   */
  imageDefault = SystemSetting.imageUrl;

  @Input() statusClose: string;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private reservationReceptTimeService: ReservationReceptTimeService
  ) { }

  /**
   * Open popup
   */
  ngOnChanges(): void {
    if (this.statusClose === 'upCreate') {
      this.searchEquipmentCd(null);
    }
  }

  /**
   * コンポーネント初期処理
   */
  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    await this.reservationReceptTimeService
      .getReservationReceptTime(this.userLogin.shop_id)
      .toPromise()
      .then((res) => {
        this.objReceptTime = res[0];
      });
    await this.searchEquipmentCd(null);
  }

  /**
   * Select tab
   */
  selectTab(i: number): void {
    this.tabList.forEach((val, index) => {
      if (i === index) {
        val.active = true;
        this.tabCurrent.next({ active: val.active, index: i });
        this.searchEquipmentCd(i);
      } else {
        val.active = false;
      }
    });
  }

  // '日', '月', '火', '水', '木', '金', '土'
  checkDay(dateTime: string): any {
    switch (this.dayOfWeek[new Date(dateTime).getDay()]) {
      case '日':
        return {
          recept_start: this.objReceptTime.recept_start_mo,
          recept_end: this.objReceptTime.recept_end_mo,
        };
      case '月':
        return {
          recept_start: this.objReceptTime.recept_start_tu,
          recept_end: this.objReceptTime.recept_end_tu,
        };
      case '火':
        return {
          recept_start: this.objReceptTime.recept_start_we,
          recept_end: this.objReceptTime.recept_end_we,
        };
      case '水':
        return {
          recept_start: this.objReceptTime.recept_start_th,
          recept_end: this.objReceptTime.recept_end_th,
        };
      case '木':
        return {
          recept_start: this.objReceptTime.recept_start_fr,
          recept_end: this.objReceptTime.recept_end_fr,
        };
      case '金':
        return {
          recept_start: this.objReceptTime.recept_start_sa,
          recept_end: this.objReceptTime.recept_end_sa,
        };
      case '土':
        return {
          recept_start: this.objReceptTime.recept_start_su,
          recept_end: this.objReceptTime.recept_end_su,
        };
    }
  }

  /**
   * Parse month day
   */
  getMonthDayString(time: string): string {
    const date = new Date(time);
    return `${date.getMonth() + 1}月${date.getDate()}日(${this.dayOfWeek[date.getDay()]
      })`;
  }

  /**
   * Tab search
   */
  private searchEquipmentCd(equipmentCd: any): any {
    this.weekList = [];
    const d = new Date();
    for (let index = 0; index < 7; index++) {
      this.weekList.push({ day: moment(d).format('YYYY-MM-DD'), list: [] });
      d.setDate(moment(d).get('D') + 1);
    }
    return this.reservationService
      .getReservationList(String(this.userLogin.shop_id), '', LocalTime.formatDate(new Date()), '', '0')
      .pipe(
        map((x: any[]) => {
          if (equipmentCd === 1) {
            return x.filter((a) => a.equipment_cd === '02');
          }
          if (equipmentCd === 2) {
            return x.filter((a) => a.equipment_cd === '01');
          }
          return x;
        })
      )
      .subscribe((res) => {
        res.forEach((val: any, index) => {
          const obj: any = this.weekList.find(
            (a) =>
              a.day?.substring(0, 10) ===
              val?.reservation_time?.substring(0, 10)
          );
          if (obj) {
            obj.list?.push(val);
          }
        });
      });
  }

  /**
   * On handle detail
   */
  handleDetail(item): void {
    this.confirm.emit({ isOpen: true, status: 'upDate', currentSelect: item });
  }
}
