import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Constants } from 'src/app/constants/constants';
import { SystemSetting } from 'src/app/constants/global-const';
import { ModalService } from 'src/app/core/services';
import { ReservationService } from 'src/app/core/services/apis';
import { ListOfVisitTodayService } from 'src/app/core/services/apis/list-of-visit-today.service';
import { Helper } from 'src/app/core/utils/helper';
import { LocalTime } from 'src/app/core/utils/local-time';

@Component({
  selector: 'app-reservation-details-modal',
  templateUrl: './reservation-details-modal.component.html',
  styleUrls: ['./reservation-details-modal.component.scss']
})

export class ReservationDetailsModalComponent implements OnChanges {
  /**
   *
   */
  dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'];

  /**
   * Obj current
   */
  objInfo: any;

  /**
   * To day
   */
  toDay = new Date();
  infoDate: Date;
  listMenus: any[] = [];

  /**
   * Constanst
   */
  gender = Constants.sex;
  helper = Helper;
  localTime = LocalTime;

  /**
   * Image default
   */
  imageDefault = SystemSetting.imageUrl;

  isOpen = false;

  @Input() open = false;
  @Input() selectCurrent: any;
  @Input() userLogin: any;
  @Output() confirmEmit: EventEmitter<object> = new EventEmitter<object>(null);
  @Output() confirmEmitRegister: EventEmitter<object> = new EventEmitter<object>(null);

  constructor(
    private reservationService: ReservationService,
    private modalService: ModalService,
    private translate: TranslateService,
    private listMenuService: ListOfVisitTodayService,
    private router: Router) { }

  /**
   * Change popup
   */
  async ngOnChanges(): Promise<void> {
    if (this.selectCurrent && this.open) {
      this.listMenus = [];
      this.objInfo = await this.reservationService.getReservation(String(this.userLogin.shop_id), this.selectCurrent.id)
        .toPromise().then(res => res[0]);
      if (this.objInfo.details && this.objInfo.details.length > 0) {
        await this.objInfo.details.forEach(async (element) => {
          const menus = await this.listMenuService.getMenuId(this.userLogin.shop_id, {
            category_cd: element.category_cd,
            menu_id: element.menu_id
          }).toPromise();
          this.listMenus?.push(menus);
        });
      }
      this.infoDate = new Date(this.objInfo.reservation_time);
    }
  }

  /**
   * Get time start
   */
  getTimeStartEnd(): string {
    return `${moment(this.infoDate).format('H:mm')} ~ ${moment(this.infoDate).format('H:mm')}`;
  }

  /**
   * Update
   */
  updateReservation(): void {
    if (this.objInfo && this.objInfo.visit_flg === '1') {
      this.router.navigate(['shops/accounting-input'], { state: this.objInfo });
      return;
    }
    const obj: any = [{ ...this.objInfo, visit_flg: '1' }];
    this.reservationService.updateReservationReceptTime(this.objInfo.shop_id, obj).subscribe((res) => {
      this.confirmEmit.emit({ open: false, status: 'update' });
      this.router.navigate(['reservations/list-reservation']);
    });
  }

  /**
   * Cancel
   */
  cancelReservation(): void {
    if (this.objInfo && this.objInfo.visit_flg === '0') {
      this.reservationService.deleteReservationReceptTime(this.objInfo.shop_id, this.objInfo.id).subscribe(res => {
        this.confirmEmit.emit({ open: false, status: 'update' });
      });
      return;
    }
    const obj: any = [{ ...this.objInfo, visit_flg: '0' }];
    this.reservationService.updateReservationReceptTime(this.objInfo.shop_id, obj).subscribe((res) => {
      this.confirmEmit.emit({ open: false, status: 'cancel' });
      this.router.navigate(['reservations/list-reservation']);
    });
  }

  /**
   * Close modal
   */
  closeModal(): void {
    this.confirmEmit.emit({ open: false });
  }

  /**
   * 予約変更画面へ遷移
   */
  openPopup(): void {
    this.isOpen = true;
  }

  /**
   * Close modal
   */
  closeModalRegister(event): void {
    this.isOpen = event?.isOpen;
    if (event && event.status === 'upCreate') {
      this.confirmEmit.emit({ open: false, status: 'update' });
    }
  }
}


