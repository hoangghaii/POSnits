import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-staff-shift-registration-detail',
  templateUrl: 'staff-shift-registration-detail.component.html',
  styleUrls: ['staff-shift-registration-detail.component.scss'],
})
export class StaffShiftRegistrationDetailComponent {
  /**
   * Select staff
   */
  selectShiftId = '';

  @Input() isOpen = false;
  @Input() detailDate = '';
  @Input() staff;
  @Input() listBasicShift;

  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);

  constructor() {
  }

  /**
   * モーダルを閉じる
   */
  closeModal(): void {
    this.confirm.emit({isOpen: false, data: null});
  }

  /**
   * Emit
   */
  onSubmit(): void {
    this.confirm.emit({isOpen: false, data: {date: this.detailDate, staff: this.staff, shiftId: this.selectShiftId}});
  }
}
