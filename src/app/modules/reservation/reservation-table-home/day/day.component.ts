import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Constants } from 'src/app/constants/constants';
import { SystemSetting } from 'src/app/constants/global-const';
import { AuthService } from 'src/app/core/services';
import {
  ReceptionSettingService,
  ReservationReceptTimeService,
  ReservationService,
} from 'src/app/core/services/apis';
import { LocalTime } from 'src/app/core/utils/local-time';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
})
export class DayComponent implements OnInit, OnChanges {
  /**
   * Current tab
   */
  tabCurrent: any = new BehaviorSubject<object>({
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
  dayList: any = [];
  tabList = [
    {
      active: true,
      image: 'ico_calendar_white.svg',
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
   * List time
   */
  listTime: any[];

  /**
   *
   */
  dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'];

  /**
   * Current date
   */
  seletedDate = new Date();

  /**
   * Jump
   */
  jump: string;
  jumpList = Constants.reservInterval;

  /**
   * Constant
   */
  categoryCd = Constants.categoryCd;

  /**
   * Image default
   */
  imageDefault = SystemSetting.imageUrl;

  @Input() statusClose: string;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private reservationReceptTimeService: ReservationReceptTimeService,
    private receptionSettingService: ReceptionSettingService
  ) { }

  /**
   * Change popup
   */
  ngOnChanges(): void {
    if (this.statusClose === 'upCreate') {
      this.searchEquipmentCd(this.tabCurrent.value.index);
    }
  }

  /**
   * コンポーネント初期処理
   */
  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    await this.receptionSettingService
      .getReceptionSetting(this.userLogin.shop_id)
      .toPromise()
      .then((res) => {
        this.jump = res[0]?.reserv_interval;
      });
    await this.reservationReceptTimeService
      .getReservationReceptTime(this.userLogin.shop_id)
      .toPromise()
      .then((res) => {
        this.objReceptTime = res[0];
        this.getListTime(this.jump);
      });

    const listReser: any = await this.getReservationList(
      String(this.userLogin.shop_id),
      '',
      '',
      LocalTime.formatDate(this.seletedDate),
      '0'
    );

    listReser.forEach((x, index) => {
      const date = new Date(x.reservation_time);
      // set minutes
      date.setMinutes(x.treatments_time + date.getMinutes());
      const obj: any = this.dayList.find((a) => a.staff === x.staff_id);
      if (obj) {
        x = {
          ...x, treatments_time_end: moment(date).format('YYYY-MM-DD HH:mm:ss'),
          height: this.setHeight(x.reservation_time, moment(date).format('YYYY-MM-DD HH:mm:ss')),
          marginTop: this.setMarginTop(obj.list[index - 1]?.treatments_time_end, x.reservation_time)
        };
        obj.list?.push(x);
      } else {
        const firtsDate = new Date();
        firtsDate.setHours(this.objReceptTime.recept_start.substring(0, 2), this.objReceptTime.recept_start.substring(3, 5), 0);
        this.dayList?.push({
          staff: x.staff_id, list: [
            {
              ...x, treatments_time_end: moment(date).format('YYYY-MM-DD HH:mm:ss'),
              height: this.setHeight(x.reservation_time, moment(date).format('YYYY-MM-DD HH:mm:ss')),
              marginTop: this.setMarginTop(moment(firtsDate).format('YYYY-MM-DD HH:mm:ss'), x.reservation_time)
            },
          ],
        });
      }
    });
  }

  /**
   * Select tab
   */
  selectTab(i: number): void {
    this.tabList.forEach((val, index) => {
      if (i === index) {
        val.active = true;
        val.image = 'ico_calendar_white.svg';
        this.tabCurrent.next({
          active: val.active,
          index: i,
          category: val.category,
        });
        this.searchEquipmentCd(i);
      } else {
        val.active = false;
        val.image = 'ico_calendar_gray.svg';
      }
    });
  }

  /**
   * Next day
   */
  async nextDay(): Promise<void> {
    this.seletedDate.setDate(this.seletedDate.getDate() + 1);
    await this.searchEquipmentCd(this.tabCurrent.value.index);
  }

  /**
   * Prevous day
   */
  async prevousDay(): Promise<void> {
    this.seletedDate.setDate(this.seletedDate.getDate() - 1);
    await this.searchEquipmentCd(this.tabCurrent.value.index);
  }

  /**
   * Get reservation list
   */
  private async getReservationList(shopId: string, month: string, week: string, day: string, visitFlg: string): Promise<any> {
    return await this.reservationService
      .getReservationList(shopId, month, week, day, visitFlg)
      .toPromise();
  }

  /**
   * Seacrh equipment_cd
   */
  private searchEquipmentCd(tabIndex: number = 0): any {
    return this.reservationService
      .getReservationList(
        String(this.userLogin.shop_id), '', '', LocalTime.formatDate(this.seletedDate), '0'
      )
      .pipe(
        map((x: any[]) => {
          if (tabIndex === 1) {
            return x.filter((a) => a.equipment_cd === '02');
          }
          if (tabIndex === 2) {
            return x.filter((a) => a.equipment_cd === '01');
          }
          return x;
        })
      )
      .subscribe((res) => {
        this.dayList = [];
        res.forEach((x, index) => {
          const date = new Date(x.reservation_time);
          date.setMinutes(x.treatments_time + date.getMinutes());
          const obj: any = this.dayList.find((a) => a.staff === x.staff_id);

          if (obj) {
            x = {
              ...x, treatments_time_end: moment(date).format('YYYY-MM-DD HH:mm:ss'),
              height: this.setHeight(x.reservation_time, moment(date).format('YYYY-MM-DD HH:mm:ss')),
              marginTop: this.setMarginTop(obj.list[index - 1]?.treatments_time_end, x.reservation_time)
            };
            obj.list?.push(x);
          } else {
            const firtsDate = new Date();
            firtsDate.setHours(this.objReceptTime.recept_start.substring(0, 2), this.objReceptTime.recept_start.substring(3, 5), 0);
            this.dayList?.push({
              staff: x.staff_id, list: [
                {
                  ...x, treatments_time_end: moment(date).format('YYYY-MM-DD HH:mm:ss'),
                  height: this.setHeight(x.reservation_time, moment(date).format('YYYY-MM-DD HH:mm:ss')),
                  marginTop: this.setMarginTop(moment(firtsDate).format('YYYY-MM-DD HH:mm:ss'), x.reservation_time)
                },
              ],
            });
          }
        });
      });
  }

  /**
   * Set top item
   */
  setMarginTop(prevStart: any, currentStart: any): any {
    let px = null;
    const time1 = moment(new Date());
    const time2 = moment(new Date());
    const timeStart = new Date(currentStart);
    const timePreEnd = new Date(prevStart);
    const twoLine = 118.5;
    const oneLine = 55;

    if (prevStart) {
      const a = time1.set({ hours: timeStart.getHours(), minutes: timeStart.getMinutes(), seconds: 0, milliseconds: 0 });
      const b = time2.set({ hours: timePreEnd.getHours(), minutes: timePreEnd.getMinutes(), seconds: 0, milliseconds: 0 });
      const middel = moment.duration(a.diff(b)).asHours();
      if (middel >= 1) {
        px = twoLine * middel;
      } else {
        px = oneLine;
        if (middel === 0) {
          px = 0;
        }
      }
    }
    return px;
  }

  /**
   * Set heigh auto
   */
  setHeight(start: any, end: any): any {
    let px = null;
    const time1 = moment(new Date());
    const time2 = moment(new Date());
    const timeStart = new Date(start);
    const timeEnd = new Date(end);
    const a = time1.set({ hours: timeStart.getHours(), minutes: timeStart.getMinutes(), seconds: 0, milliseconds: 0 });
    const b = time2.set({ hours: timeEnd.getHours(), minutes: timeEnd.getMinutes(), seconds: 0, milliseconds: 0, });
    const heightConst = 133;
    const middle = moment.duration(b.diff(a)).asHours();
    px = heightConst * middle;
    return px;
  }

  /**
   * Get time end
   */
  getTimeEnd(time, treatments): any {
    if (time === null) {
      return null;
    }
    const date = new Date(time);
    date.setMinutes(treatments);
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  }

  /**
   * Get time list
   */
  getListTime(jump: any): void {
    this.listTime = [];
    const timeStart = new Date();
    const timeEnd = new Date();
    for (const item of this.jumpList) {
      if (item.value === jump) {
        jump = this.getTimeReservInterval(item.value);
        break;
      }
    }

    timeStart.setHours(Number(this.objReceptTime?.recept_start.substring(0, 2)),
      Number(this.objReceptTime?.recept_start.substring(3, 5)), 0);
    timeEnd.setHours(Number(this.objReceptTime?.recept_end.substring(0, 2)), Number(this.objReceptTime?.recept_end.substring(3, 5)), 0);

    const currentTime = timeStart;
    this.listTime.push(moment(currentTime).format('HH:mm'));
    while (currentTime.getHours() <= timeEnd.getHours()) {
      currentTime.setMinutes(currentTime.getMinutes() + jump);
      this.listTime.push(moment(currentTime).format('HH:mm'));
      if (
        currentTime.getHours() === timeEnd.getHours() &&
        currentTime.getMinutes() === timeEnd.getMinutes()
      ) {
        break;
      }
    }
  }

  /**
   * Parse jump
   */
  getTimeReservInterval(value): number {
    if (value === '0') {
      return 5;
    } else if (value === '1') {
      return 10;
    } else if (value === '2') {
      return 15;
    } else if (value === '3') {
      return 20;
    } else if (value === '4') {
      return 30;
    } else {
      return 60;
    }
  }

  /**
   * On handle detail
   */
  handleDetail(item): void {
    const sDay = moment(this.seletedDate);
    const cDay = moment(new Date());
    if (sDay.format('YYYY-MM-DD') < cDay.format('YYYY-MM-DD')) {
      return;
    }
    this.confirm.emit({ isOpen: true, status: 'upDate', currentSelect: item });
  }
}
