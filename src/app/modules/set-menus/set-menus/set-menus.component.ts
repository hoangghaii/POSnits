import {Component, OnInit} from '@angular/core';
import {MenuRegistration} from 'src/app/core/models';
import {AuthService} from 'src/app/core/services';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {SetMenuService} from 'src/app/core/services/apis';

@Component({
  selector: 'app-set-menus',
  templateUrl: './set-menus.component.html',
  styleUrls: ['./set-menus.component.scss']
})
export class SetMenusComponent implements OnInit {
  selectCurrent: any;
  isOpen = false;
  userLogin;
  menuList: MenuRegistration[] = [];

  constructor(private authService: AuthService,
              private setMenuService: SetMenuService) {
  }

  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    await this.getMenus();
  }

  /**
   * レジスターを開く
   */
  openModal(status?: string): void {
    if (status === 'create') {
      this.selectCurrent = null;
    }
    this.isOpen = true;
  }

  /**
   * モーダルを閉じる
   */
  async closeModal(event: any): Promise<void> {
    this.selectCurrent = null;
    if (event && event.isReload === true) {
      await this.getMenus();
    }
    this.isOpen = event.isOpen;
  }

  /**
   * 分類情報一覧を取得する
   */
  async getMenus(): Promise<any> {
    this.menuList = await this.setMenuService.getSetMenuList(this.userLogin.shop_id).toPromise();
  }

  /**
   * 落とす
   * @param event
   */
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.menuList,
      event.previousIndex,
      event.currentIndex
    );
    for (let i = 0; i < this.menuList.length; i++) {
      this.menuList[i].sort = i;
    }
    this.updateSortIndex();
  }

  /**
   * 分類情報一覧を取得する
   */
  updateSortIndex(): void {
    const body = {
      shopId: this.userLogin.shop_id,
      list: this.menuList
    };
    this.setMenuService
      .updateSetMenuListSort(this.userLogin.shop_id, body)
      .subscribe(
        async (rs) => {
          this.menuList = rs;
        });
  }

  /**
   * モーダルを開く。
   */
  selectedRow(select): void {
    this.selectCurrent = select;
    this.openModal();
  }
}
