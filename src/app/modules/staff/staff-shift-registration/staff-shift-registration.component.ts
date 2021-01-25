import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService, ModalService} from 'src/app/core/services';
import {
  BasicShiftService,
  StaffService,
  StaffShiftService,
} from 'src/app/core/services/apis';
import * as moment from 'moment';
import {TranslateService} from '@ngx-translate/core';
import {Constants} from 'src/app/constants/constants';

@Component({
  selector: 'app-staff-shift-registration',
  templateUrl: 'staff-shift-registration.component.html',
  styleUrls: ['staff-shift-registration.component.scss'],
})
export class StaffShiftRegistrationComponent implements OnInit {
  shiftFrom: FormGroup;
  updatePastDate = false;
  currentMonth = moment().format('YYYY-MM-DD');
  userLogin;
  listStaff = [];
  listBasicShift = [];
  listStaffShift: any[] = [];
  listStaffShiftSort: any[] = [];
  submitted = false;
  dayOfWeeks = Constants.dayOfWeek;
  detailOpen = false;
  detailDate = '';
  monthAndYear = [];
  getDate;
  currentStaff = [];

  /**
   * Form map item
   */
  formMap;

  constructor(
    private fb: FormBuilder,
    private staffService: StaffService,
    private authService: AuthService,
    private basicShiftService: BasicShiftService,
    private staffShiftService: StaffShiftService,
    private translate: TranslateService,
    private modalService: ModalService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.translate.get('staffShiftRegistration.err').subscribe((trans) => {
      this.formMap = {
        staffId: trans?.staffSelection,
        applyToAllDay: trans?.appliesToAllDays,
        dayOfWeek: trans?.applyByDayOfTheWeek,
        applyToAllDayOfWeek: trans?.appliesToAllDays,
      };
    });
    const now = new Date();
    let month = now.getMonth() + 1;
    let year = now.getFullYear();
    for (let i = 0; i < 12; i++) {
      this.monthAndYear.push({
        value: year + '-' + (month < 10 ? '0' + month : month) + '-01',
        label: year + '年' + (month < 10 ? '0' + month : month) + '月'
      });
      month += 1;
      if (month > 12) {
        month = 1;
        year += 1;
      }
    }
    this.initForm();
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.listStaff = await this.staffService
      .getStaffList(this.userLogin.shop_id)
      .toPromise();
    this.listBasicShift = await this.basicShiftService
      .getBasicShiftList(String(this.userLogin.shop_id))
      .toPromise();
    this.getStaffShift();
  }

  /**
   * Init form
   */
  initForm(): any {
    this.shiftFrom = this.fb.group({
      id: [null],
      staffId: ['', Validators.required],
      shiftId: [''],
      day: [''],
      startTime: [''],
      endTime: [''],
      updatedAt: [''],
      month: [this.monthAndYear[0].value, Validators.required],
      applyAllShift: [''],
      dayOfWeek: [''],
      applyOptionShift: [''],
      applyOneShift: [''],
    });
  }

  /**
   * On Apply To All
   */
  applyAll(): any {
    this.shiftFrom.controls.applyAllShift.setValidators([Validators.required]);
    this.shiftFrom.controls.dayOfWeek.setValidators([]);
    this.shiftFrom.controls.applyOptionShift.setValidators([]);
    this.shiftFrom.controls.applyAllShift.updateValueAndValidity();
    this.shiftFrom.controls.dayOfWeek.updateValueAndValidity();
    this.shiftFrom.controls.applyOptionShift.updateValueAndValidity();

    this.submitted = true;

    if (!this.shiftFrom.valid) {
      return;
    }
    const staffShift = this.shiftFrom.getRawValue();
    // This code will be check if month regist <= month selected
    const month = moment(staffShift.month);
    const startMonth = month.startOf('month');
    const endMonth = moment(staffShift.month).endOf('month');
    const shifts = [];
    const shift = this.listBasicShift.find(x => Number(x.id) === Number(staffShift.applyAllShift));

    while (startMonth < endMonth) {
      if (startMonth.isSameOrBefore(moment())) {
        startMonth.add(1, 'day');
        continue;
      }
      const stShip = this.listStaffShift.find(x => x.day === startMonth.format('YYYY-MM-DD'));
      shifts.push({
        id: stShip ? stShip.id : null,
        day: startMonth.format('YYYY-MM-DD'),
        staff_id: staffShift.staffId,
        basicshift_id: shift.id,
        start_time: shift.start_time,
        end_time: shift.end_time
      });
      startMonth.add(1, 'day');
    }

    this.createStaffShift(shifts);
  }

  /**
   * On Apply To One Day
   */
  applyOption(): void {
    this.shiftFrom.controls.dayOfWeek.setValidators([Validators.required]);
    this.shiftFrom.controls.applyOptionShift.setValidators([Validators.required]);
    this.shiftFrom.controls.applyAllShift.setValidators([]);
    this.shiftFrom.controls.dayOfWeek.updateValueAndValidity();
    this.shiftFrom.controls.applyOptionShift.updateValueAndValidity();
    this.shiftFrom.controls.applyAllShift.updateValueAndValidity();
    this.submitted = true;

    if (!this.shiftFrom.valid) {
      return;
    }
    const staffShift = this.shiftFrom.getRawValue();
    // This code will be check if month regist <= month selected
    const month = moment(staffShift.month);
    const startMonth = month.startOf('month');
    const endMonth = moment(staffShift.month).endOf('month');
    const shifts = [];
    const shift = this.listBasicShift.find(x => Number(x.id) === Number(staffShift.applyOptionShift));

    while (startMonth < endMonth) {
      if (startMonth.isSameOrBefore(moment())) {
        startMonth.add(1, 'day');
        continue;
      }
      const dayOfWeek = new Date(startMonth.format('YYYY-MM-DD')).getDay();
      const stShip = this.listStaffShift.find(x => x.day === startMonth.format('YYYY-MM-DD'));
      if (Number(dayOfWeek) === Number(staffShift.dayOfWeek)) {
        shifts.push({
          id: stShip ? stShip.id : null,
          day: startMonth.format('YYYY-MM-DD'),
          staff_id: staffShift.staffId,
          basicshift_id: shift.id,
          start_time: shift.start_time,
          end_time: shift.end_time
        });
      } else {
        if (stShip) {
          shifts.push(stShip);
        }
      }

      startMonth.add(1, 'day');
    }

    if (this.listStaffShift.length > 0) {
      this.updateStaffShift(shifts);
    } else {
      this.createStaffShift(shifts);
    }
  }

  /**
   * Get Staff Shift
   */
  async getStaffShift(staffId: string = '', month: string = ''): Promise<void> {
    if (staffId !== '' && month !== '') {
      this.listStaffShift = await this.staffShiftService.getStaffShiftList(this.userLogin.shop_id, staffId, month).toPromise();
      this.listStaffShiftSort = [];

      if (this.listStaffShift && this.listStaffShift.length) {
        this.listStaffShift.forEach((i) => {
          const index = new Date(i.day).getDate();
          this.listStaffShiftSort[index] = (this.listStaffShiftSort[index] || 0) + 1;
        });

        return;
      }
    }
  }

  /**
   * Create Staff Shift
   */
  createStaffShift(staffShifts): void {
    this.staffShiftService
      .createStaffShiftList(
        this.userLogin.shop_id,
        this.shiftFrom.controls.staffId.value,
        this.shiftFrom.controls.month.value,
        staffShifts
      )
      .subscribe((rep) => {
        this.translate
          .get('addStaff.staffCreate.registrationHasBeenCompleted')
          .subscribe((msg: string) => {
            this.modalService.open(msg);
            this.onSelectCondition();
            this.submitted = false;
            this.updatePastDate = false;
          });
      });
  }

  /**
   * Update Staff Shift
   */
  updateStaffShift(staffShifts): void {
    this.staffShiftService
      .updateStaffShiftList(
        this.userLogin.shop_id,
        this.shiftFrom.controls.staffId.value,
        this.shiftFrom.controls.month.value,
        staffShifts
      )
      .subscribe((rep) => {
        this.translate
          .get('addStaff.staffCreate.updateHasBeenCompleted')
          .subscribe((msg: string) => {
            this.modalService.open(msg);
            this.onSelectCondition();
            this.submitted = false;
          });
      });
  }

  /**
   * On Select Condition
   */
  async onSelectCondition(): Promise<void> {
    if (this.shiftFrom.controls.staffId.value) {
      this.currentStaff = this.listStaff.find(x => Number(x.id) === Number(this.shiftFrom.controls.staffId.value));
    }
    this.currentMonth = moment(this.shiftFrom.controls.month.value).format('YYYY-MM-DD');
    await this.getStaffShift(this.shiftFrom.controls.staffId.value, this.currentMonth);
  }

  /**
   * Calender
   */
  handleCalender(event: any): void {
    this.detailOpen = true;
    this.detailDate = event;
  }

  /**
   * Emit Popup
   */
  detailShift(event: any): any {
    this.detailOpen = event.isOpen;
    if (event.data) {
      this.shiftFrom.controls.dayOfWeek.setValidators([]);
      this.shiftFrom.controls.applyOptionShift.setValidators([]);
      this.shiftFrom.controls.applyAllShift.setValidators([]);
      this.shiftFrom.controls.dayOfWeek.updateValueAndValidity();
      this.shiftFrom.controls.applyOptionShift.updateValueAndValidity();
      this.shiftFrom.controls.applyAllShift.updateValueAndValidity();
      this.submitted = true;

      if (!this.shiftFrom.valid) {
        return;
      }
      const staffShift = this.shiftFrom.getRawValue();
      // This code will be check if month regist <= month selected
      const date = moment(event.data.date);
      const shifts = [];
      const shift = this.listBasicShift.find(x => Number(x.id) === Number(event.data.shiftId));
      const stShip = this.listStaffShift.find(x => x.day === date.format('YYYY-MM-DD'));
      shifts.push({
        id: stShip ? stShip.id : null,
        day: date.format('YYYY-MM-DD'),
        staff_id: staffShift.staffId,
        basicshift_id: shift.id,
        start_time: shift.start_time,
        end_time: shift.end_time
      });

      if (this.listStaffShift.length > 0) {
        this.updateStaffShift(shifts);
      } else {
        this.createStaffShift(shifts);
      }
    }
  }
}
