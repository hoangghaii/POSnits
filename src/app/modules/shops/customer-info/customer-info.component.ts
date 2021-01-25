import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Constants } from 'src/app/constants/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from 'src/app/core/models/customer.model';
import { CustomerService } from 'src/app/core/services/apis/customer.service';
import { Helper } from 'src/app/core/utils/helper';
import { AuthService } from 'src/app/core/services';
import { SystemSetting } from 'src/app/constants/global-const';
import { StaffService } from 'src/app/core/services/apis';


@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss'],
})
export class CustomerInfoComponent implements OnInit {
  public shopId: string;
  public status = false;
  public customerList: Customer[];
  public helper = Helper;
  showList = true;
  systemSetting = SystemSetting;

  inCharge: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private authService: AuthService,
    private staffService: StaffService,
    private router: Router
  ) {
  }

  /**
   * コンポネント初期処理
   */
  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => (this.shopId = params.get('shopId'))
    );
    this.authService.getCurrentUser().subscribe((res) => {
      this.shopId = res.shop_id;
      this.staffService.getStaffList(this.shopId).subscribe((data) => {
        this.inCharge = data;
      });
    });
    this.getCustomerList();
  }

  /**
   * get Customer List
   */
  getCustomerList() {
    this.customerService.getListCustomer(this.shopId).subscribe((res) => {
      this.customerList = res;
    });
  }

  /**
   * search Customer
   */
  async confirmModal(event: any): Promise<void> {
    this.status = event.status;
    if (event.customerList) {
      this.customerList = event.customerList;
    }
  }

  /**
   * Move edit page
   * @param id
   */
  moveEditPage(id) {
    this.router.navigate(['customer', id]);
  }

  confirmCustomerList(e) {
    switch (e.status) {
      case 'createCustomer':
        this.router.navigate(['customer']);
        break;
      case 'searchCustomer':
        this.status = true;
        break;
      case 'itemSelected':
        const item = e.data;
        this.router.navigate(['customer', item.id]);
        break;
    }
  }
}
