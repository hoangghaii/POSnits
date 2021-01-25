import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';

import {AuthService} from 'src/app/core/services/auth.service';
import {RegularHoliday} from 'src/app/core/models';
import {RegularHolidayService} from 'src/app/core/services/apis';
import {Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ReservationCalendarComponent } from 'src/app/core/components/parts/reservation-calendar/reservation-calendar.component';

/**
 * RegularHolidaySettingComponent
 * 通常の休日設定コンポーネント
 */
@Component({
  selector: 'app-regular-holiday-setting',
  templateUrl: './regular-holiday-setting.component.html',
  styleUrls: ['./regular-holiday-setting.component.scss'],
})
export class RegularHolidaySettingComponent implements OnInit {
  weekOff = [];
  dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  userLogin: any;
  listRegularHoliday = [];
  listDateReturn = [];
  listDateChoice = [];
  mode = 'create';
  public status = '';
  @ViewChild(ReservationCalendarComponent, {static: true}) calendarComponent: ReservationCalendarComponent;

  constructor(
    private authService: AuthService,
    private regularHolidayService: RegularHolidayService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private translate :TranslateService
  ) {
  }

  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.translate.get('regularHoliday').subscribe((trans) => {
        this.status = trans.next;
    });
    this.getListRegularHoliday();
  }

  /**
   * 選択平日
   * @param weekDay
   */
  choice(weekDay: string): void {
    const day = this.dayOfWeek.indexOf(weekDay);
    if (!this.weekOff.includes(day)) {
      this.weekOff.push(day);
    } else {
      this.weekOff.splice(this.weekOff.indexOf(day), 1);
    }
    this.calendarComponent.refreshCalendar();
    this.cdr.detectChanges();
  }

  /**
   * カレンダーから日付を一覧表示
   * @param event
   */
  choiceDate(event): void {
    this.listDateReturn = event ? event : [];
  }

  /**
   * リストの定休日を取得
   */
  getListRegularHoliday(): void {
    this.regularHolidayService
      .getRegularHolidayList(this.userLogin.shop_id)
      .subscribe((res) => {
        this.listRegularHoliday = res;
        if (res.length > 0) {
          this.translate.get('common').subscribe((trans) => {
            this.status = trans.update;
        });
          this.mode = 'update';
          this.listRegularHoliday.forEach((item) => {
            if (item.holiday_type == 0) {
              for (const [key, value] of Object.entries(item)) {
                if (this.dayOfWeek.includes(key) && value != null
                  && parseInt(value.toString(), 10) === 1) {
                  this.weekOff.push(this.dayOfWeek.indexOf(key));
                }
              }
            } else {
              this.listDateChoice.push(item.day);
            }
          });
        }
      });
  }

  /**
   * 通常の休日を更新する
   */
  updateRegularHoliday(): void {
    const listHolidayUpdate: RegularHoliday[] = [];
    this.listDateReturn.forEach((item) => {
      listHolidayUpdate.push({
        id: null,
        shop_id: this.userLogin.shop_id.toString(),
        holiday_type: '1',
        day: item,
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
        updated_at: null,
      });
    });
    if (this.weekOff.length > 0) {
      listHolidayUpdate.push({
        id: null,
        shop_id: this.userLogin.shop_id.toString(),
        holiday_type: '0',
        day: null,
        monday: this.weekOff.includes(this.dayOfWeek.indexOf('monday')) ? '1' : null,
        tuesday: this.weekOff.includes(this.dayOfWeek.indexOf('tuesday')) ? '1' : null,
        wednesday: this.weekOff.includes(this.dayOfWeek.indexOf('wednesday')) ? '1' : null,
        thursday: this.weekOff.includes(this.dayOfWeek.indexOf('thursday')) ? '1' : null,
        friday: this.weekOff.includes(this.dayOfWeek.indexOf('friday')) ? '1' : null,
        saturday: this.weekOff.includes(this.dayOfWeek.indexOf('saturday')) ? '1' : null,
        sunday: this.weekOff.includes(this.dayOfWeek.indexOf('sunday')) ? '1' : null,
        updated_at: null,
      });
    }

    if (this.mode === 'create') {
      this.regularHolidayService
        .createRegularHoliday(String(this.userLogin.shop_id), listHolidayUpdate)
        .subscribe(() => {
          this.router.navigateByUrl('reservation-setting/step-5')
        });
    }
    if (this.mode === 'update') {
      this.regularHolidayService
        .updateRegularHoliday(String(this.userLogin.shop_id), listHolidayUpdate)
        .subscribe(() => {
          this.getListRegularHoliday();
        });
    }
  }
}
