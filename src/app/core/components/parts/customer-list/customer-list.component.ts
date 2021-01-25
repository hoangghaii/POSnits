import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SystemSetting } from 'src/app/constants/global-const';
import { Customer } from 'src/app/core/models';

import { Helper } from 'src/app/core/utils/helper';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  @Input() customerList: Customer[];
  public helper = Helper;
  showList = true;
  systemSetting = SystemSetting;
  @Input() isPopup = false;
  @Input() status = false;
  inCharge: any[] = [];
  @Output() confirmEmit: EventEmitter<object> = new EventEmitter<object>(null);
  constructor(
  ) {
  }


  /**
   * コンポネント初期処理
   */
  ngOnInit(): void {
  }

  /**
   * Next page
   */
  nextPage() {
    this.confirmEmit.emit({status: 'createCustomer', flag: true})
  }

  /**
   * Move edit page
   * @param id
   */
  moveEditPage(item) {
    this.status = false;
    this.confirmEmit.emit({status: 'itemSelected', data: item})
  }

  /**
   * Open popup
   */
  openPopup() {
    this.confirmEmit.emit({status: 'searchCustomer', flag: true})
  }

  /**
   * Close popup
   */
  closePopup() {
    this.status = false;
    this.confirmEmit.emit({status: 'close', flag: true})
  }
}
