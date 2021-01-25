import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SystemSetting } from 'src/app/constants/global-const';
import { AuthService } from 'src/app/core/services';
import { StaffService } from 'src/app/core/services/apis';
import { ReservationTableTabComponent } from '../components/reservation-table-tab/reservation-table-tab.component';

@Component({
  selector: 'app-reservation-table-home',
  templateUrl: './reservation-table-home.component.html',
  styleUrls: ['./reservation-table-home.component.scss']
})
export class ReservationTableHomeComponent implements OnInit {
  isOpen = false;
  userLogin;
  selectCurrent: any;
  statusAction: string;

  /**
   * Tab current
   */
  tabCurrent: any = new BehaviorSubject<object>({ active: true, index: 0 });

  /**
   * List
   */
  tabList: ReservationTableTabComponent[] = [];
  userList = [];

  /**
   * Image default
   */
  imageDefault = SystemSetting.imageUrl;

  constructor(private staffService: StaffService, private authService: AuthService) { }

  /**
   * コンポーネント初期処理
   */
  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.userList = await this.staffService.getStaffList(this.userLogin.shop_id).toPromise();
  }

  /**
   * Load tab default
   */
  loadTabDefault(tab: ReservationTableTabComponent): void {
    if (this.tabList.length === 0) {
      tab.active = true;
      this.tabCurrent.next({ active: tab.active, index: 0 });
    }
    this.tabList.push(tab);
  }

  /**
   * Select tab
   */
  async selectTab(tab: ReservationTableTabComponent, i: number): Promise<void> {
    this.statusAction = null;
    this.tabList.forEach(val => {
      val.active = false;
    });
    tab.active = true;
    await this.tabCurrent.next({ active: tab.active, index: i });
  }

  /**
   * レジスターを開く
   */
  openModal(status?: string): void {
    this.statusAction = null;
    if (status === 'create') {
      this.selectCurrent = null;
    }
    this.isOpen = true;
  }

  /**
   * モーダルを閉じる
   */
  closeModal(event: any): void {
    this.isOpen = event.isOpen;
    this.selectCurrent = event?.currentSelect;
    this.statusAction = (event && event.status) ? event.status : null;
  }

  onSelectCurrent(event: any): void {
    this.selectCurrent = event.currentSelect;
    this.openModal(event.currentSelect.status);
  }
}
