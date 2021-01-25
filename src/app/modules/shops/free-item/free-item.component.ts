import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FreeItemService } from 'src/app/core/services/apis';
import { AuthService } from 'src/app/core/services/auth.service';
import { FreeItem } from 'src/app/core/models';

@Component({
  selector: 'app-free-item',
  templateUrl: './free-item.component.html',
  styleUrls: ['./free-item.component.scss'],
})
export class FreeItemComponent implements OnInit {
  public free_itemList: FreeItem[] = [];
  public free_item: FreeItem[] = [];
  public free_itemListFilter: any[] = [];
  public statusOpen = null;
  public selectCurrent: any;
  public userLogin: any;
  public isOpen: boolean;

  constructor(
    private freeItemService: FreeItemService,
    private authService: AuthService
  ) {}

  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();

    this.free_itemList = await this.getFreeItemList();
  }

  /**
   * スキルリストを取得する
   */
  async getFreeItemList(): Promise<FreeItem[]> {
    return await this.freeItemService
      .getFreeItemList(this.userLogin.company_id)
      .toPromise();
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
    if (event.status && event.status === 'upCreate') {
      this.free_itemList = await this.getFreeItemList();
    }
    this.isOpen = event.isOpen;
  }

  /**
   * モーダルを開く。
   */
  selectedRow(select: FreeItem): void {
    this.selectCurrent = select;
    this.isOpen = true;
  }

  /**
   * 落とす
   * @param event
   */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.free_itemList,
      event.previousIndex,
      event.currentIndex
    );
    for (let i = 0; i < this.free_itemList.length; i++) {
      this.free_itemList[i].sort = i;
    }
    this.updateSortIndex();
  }

  /**
   * 分類情報一覧を取得する
   */
  updateSortIndex(): void {
    let body = {
      companyId: this.userLogin.company_id,
      list: this.free_itemList,
    };
    this.freeItemService
      .updateFreeItemListSort(body)
      .subscribe((free_itemList) => (this.free_itemList = free_itemList));
  }

  countAnswer(item) {
    const arr = item.split(",");
    return arr.length;
  }
}
