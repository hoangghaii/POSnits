import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StaffService, StoreService } from 'src/app/core/services/apis';
import { AuthService } from 'src/app/core/services';
import { Staff } from 'src/app/core/models';
import { SystemSetting } from 'src/app/constants/global-const';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss']
})
export class AddStaffComponent implements OnInit {
  /**
   * URL load image
   */
  urlImage = 'http://192.168.0.32:8000/';

  /**
   * current user login
   */
  userLogin: any;
  shopId;
  showStoreName = true;

  /**
   * Image
   */
  accessImage = SystemSetting.imageUrl;

  /**
   * Open modal
   */
  open = false;
  statusOpen = null;

  /**
   * List staff
   */
  staffList: any[] = [];

  /**
   * Position
   */
  shopName: string;

  /**
   * item selected
   */
  selectCurrent: any;

  /**
   * Shop list
   */
  shopList: any;

  constructor(
    private authService: AuthService,
    private staffService: StaffService,
    private storeService: StoreService) {
  }

  /**
   * コンポーネント初期処理
   */
  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.shopId = this.userLogin.shop_id;
    this.staffList = await this.searchStaffList();
    this.getStores();
  }

  /**
   * Open register
   */
  openModal(status?: string): void {
    if (status === 'create') {
      this.selectCurrent = null;
    }
    this.open = true;
  }

  /**
   * Close modal
   */
  async closeModal(event: any): Promise<void> {
    if (event.status && event.status === 'upCreate') {
      this.staffList = await this.searchStaffList();
    }
    this.open = event.open;
  }

  /**
   * Search staff list
   */
  async searchStaffList(): Promise<Staff[]> {
    return await this.staffService.getStaffList(this.userLogin.shop_id).toPromise();
  }

  /**
   * Click row
   */
  selectedRow(select: Staff): void {
    this.selectCurrent = select;
    this.open = true;
  }

  /**
   * Get store
   */
  getStores(): void {
    this.storeService.getStores(this.userLogin.shop_id).subscribe(
      (res) => {
        this.shopList = res;
        this.shopName = this.shopList[0].name;
        if (this.shopList.length < 2) {
          this.showStoreName = false;
        }
      }
    );
  }

  /**
   * ドロップリストを処理する
   *
   * @param {Event} event
   * @param {String[]} classId
   *
   * @return void
   */
  handleDropList(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.staffList, event.previousIndex, event.currentIndex);
    this.updateSort();
  }

  /**
   * 並べ替えアイテムを更新
   */
  updateSort(): void {
    for (let i = 0; i < this.staffList.length; i++) {
      this.staffList[i].sort = i;
    }

    const staff = {
      shopId: this.shopId,
      list: JSON.stringify(this.staffList),
    };

    // Update list product
    this.staffService.updateStaffs(staff).subscribe(() => {
      this.searchStaffList();
    })
  }
}
