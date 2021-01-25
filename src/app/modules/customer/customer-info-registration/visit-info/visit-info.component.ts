import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModalService, ValidatorService } from 'src/app/core/services';
import { ReservationService } from 'src/app/core/services/apis';
import { Helper } from 'src/app/core/utils/helper';
import { LocalTime } from 'src/app/core/utils/local-time';
@Component({
  selector: 'app-visit-info',
  templateUrl: './visit-info.component.html',
  styleUrls: ['./visit-info.component.scss']
})
export class VisitInfoComponent implements OnChanges {
  @Input() userLogin;
  @Input() paramMapId;
  form: FormGroup;
  helper = Helper;
  reservationList: any[] = [];
  visitDate = {
    first: '',
    last: '',
  }
  formMap;
  submitted = false;
  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private translate: TranslateService,
    private reservationService: ReservationService,
    private router: Router,) {
    this.form = this.fb.group({
      memo: ['', ValidatorService.required],
    });
    this.translate.get('customer').subscribe((trans) => {
      this.formMap = {
        memo: trans?.visitMemo,
      };
    });
  }

  /**
   * 初期表示
   */
  async ngOnChanges(): Promise<void> {
    if (this.userLogin !== undefined) {
      this.reservationList = await this.reservationService.getReservationList(this.userLogin.shop_id, '', '', '', '1').toPromise();
      this.reservationList = this.reservationList.sort((a, b) => {
        const d1 = new Date(a.reservation_time).getTime();
        const d2 = new Date(b.reservation_time).getTime();
        return d1 - d2;
      });
      this.reservationList.map((item) => {
        item.error = false;
      })
      if (this.reservationList.length == 1) {
        this.visitDate.first = LocalTime.formatDate(this.reservationList[0].reservation_time);
        this.visitDate.last = this.visitDate.first;
      } else if (this.reservationList.length > 1) {
        this.visitDate.first = LocalTime.formatDate(this.reservationList[0].reservation_time);
        this.visitDate.last = LocalTime.formatDate(this.reservationList[this.reservationList.length - 1].reservation_time);
      }
    }
  }

  changeMemo(data) {
    this.form.controls.memo.setValue(data.memo);
    this.reservationList.forEach(item => {
      item.error = false;
    })
    if ((data.memo == null || data.memo == '') && this.submitted) {
      data.error = true;
    } else {
      data.error = false;
    }
  }

  /**
   * Call api update reservation
   */
  submit(data) {
    const arr = [{ ...data }];
    this.submitted = true;
    this.form.controls.memo.setValue(data.memo);
    if (data.memo == null || data.memo == '') {
      data.error = true;
      return;
    }
    this.reservationService
      .updateReservationReceptTime(String(this.userLogin.shop_id), arr).subscribe((res) => {
        this.translate.get('msgCompleted.updateHasBeenCompleted').subscribe((msg: string) => {
          this.modalService.open(msg);
        });
      }, (error) => {
        this.modalService.open(error);
      });
  }

  /**
   * Total amount
   * @param arr
   */
  totalAmount(arr) {
    let sum = 0;
    for (let item of arr) {
      sum += item.price;
    }
    return sum;
  }

  /**
   * Format date
   * @param date
   */
  formatDate(date) {
    return LocalTime.formatDate(date);
  }

  /**
   * Change router
   */
  changeRouter() {
    this.router.navigate(['shops/customer-info']);
  }
}
