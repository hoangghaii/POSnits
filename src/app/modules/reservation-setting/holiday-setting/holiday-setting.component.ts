import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {HolidaySetting} from 'src/app/core/models';
import {AuthService, ModalService} from 'src/app/core/services';
import {ShopPublicHolidayService} from 'src/app/core/services/apis';
import { ReservationCalendarComponent } from 'src/app/core/components/parts/reservation-calendar/reservation-calendar.component';

@Component({
  selector: 'app-holiday-setting',
  templateUrl: './holiday-setting.component.html',
  styleUrls: ['./holiday-setting.component.scss']
})
export class HolidaySettingComponent implements OnInit {
  userLogin;
  shopHoliday = new HolidaySetting();
  holidays = [];
  days = [];
  selectedDate;
  public status = '';
  public flag = false;
  @ViewChild(ReservationCalendarComponent, {static: true}) calendarComponent: ReservationCalendarComponent;

  constructor(
    private  shopPublicHolidayService: ShopPublicHolidayService,
    private modalService: ModalService,
    private authService: AuthService,
    private router: Router,
    private translate : TranslateService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.translate.get('button').subscribe(res=>{
      this.status = res.next;
    })
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    const holidays = await this.shopPublicHolidayService.getShopPublicHoliday(this.userLogin.shop_id).toPromise();
    if (holidays && holidays.length > 0) {
      this.flag = true;
      this.translate.get('common').subscribe(res=>{
        this.status = res.update;
      })
      this.holidays = holidays;
      holidays.forEach((holiday) => {
        this.days.push(holiday.date);
      });
      this.calendarComponent.refreshCalendar();
    }
  }

  /**
   * function returns the selected date
   * @param e
   */
  choiceDate(e) {
    if (!(e instanceof Event) && e && e != null && e !== '') {
      this.days = e;
    }
  }

  /**
   * event create shop_public_holiday and go to the terms / privacy policy settings screen.
   */
  nextStep(): void {
    const holidays = [];
    this.days.forEach((date) => {
      if (date !== undefined && date != null) {
        holidays.push({
          id: null,
          shop_id: this.userLogin.shop_id,
          date: date
        });
      }
    });
    if (this.holidays.length > 0 && holidays) {
      this.shopPublicHolidayService.updateShopPublicHoliday(this.userLogin.shop_id, holidays).subscribe(
        (res) => {
          // this.router.navigate(['/reservation-setting/step-6']);
        }, (error) => {
          this.modalService.open(error);
        });
    } else {
      if (holidays) {
        this.shopPublicHolidayService.createShopPublicHoliday(this.userLogin.shop_id, holidays).subscribe(
          (res) => {
             this.router.navigate(['/reservation-setting/step-6']);
          }, (error) => {
            this.modalService.open(error);
          });
      } else {
        this.router.navigate(['/reservation-setting/step-6']);
      }
    }
  }
}
