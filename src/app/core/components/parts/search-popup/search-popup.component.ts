import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {Constants} from 'src/app/constants/constants';
import {Customer} from 'src/app/core/models';
import {CustomerService, StaffService} from 'src/app/core/services/apis';

@Component({
  selector: 'app-search-popup',
  templateUrl: './search-popup.component.html',
  styleUrls: ['./search-popup.component.scss']
})
export class SearchPopupComponent implements OnInit {

  @Input() shopId;
  @Input() status: boolean;
  @Input() registerBtn = false;
  @Output() confirm: EventEmitter<any> = new EventEmitter();
  @Input() isPopup = false;
  statusPopup = false;
  customerList: Customer[];
  public customerForm: FormGroup;
  startNo = '';
  endNo = '';
  public memberID = Constants.listMember;

  /**
   * TODO
   */
  inCharge: any[] = [];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private staffService: StaffService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      id: [''],
      firstname: [''],
      lastname: [''],
      firstname_kana: [''],
      lastname_kana: [''],
      customer_no: [''],
      staff_id: [''],
      tel: [''],
      member_flg: [''],
    });
    this.staffService.getStaffList(this.shopId).subscribe((data) => {
      this.inCharge = data;
    });
  }

  nextPage() {
    this.router.navigate(['customer']);
  }

  getData() {
    this.customerForm.getRawValue();
    this.customerForm.controls.customer_no.setValue('');
    if (this.startNo || this.endNo) {
      this.customerForm.controls.customer_no.setValue(this.startNo + ',' + this.endNo);
    }
    this.customerService
      .getListCustomerWithCondition(this.shopId, this.customerForm)
      .subscribe((res) => {
        if (this.isPopup) {
          this.statusPopup = true;
          this.customerList = res;
        } else {
          this.confirm.emit({customerList: res, status: false});
        }
      });
  }

  closeModal() {
    this.confirm.emit({status: false});
  }

  confirmCustomerList(e) {
    this.statusPopup = false;
    if (e.status == 'itemSelected') {
      this.confirm.emit({status: false, customerList: e.data});
    }
  }
}
