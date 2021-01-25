import { Component, Input } from '@angular/core';
import { ReservationTableHomeComponent } from '../../reservation-table-home/reservation-table-home.component';

@Component({
    selector: 'app-reservation-table-tab',
    template: `<div *ngIf="active">
      <ng-content></ng-content>
    </div>`,
})
export class ReservationTableTabComponent {
    @Input() tabTitle;
    active = false;
    constructor(tabs: ReservationTableHomeComponent) {
        tabs.loadTabDefault(this);
    }
}
