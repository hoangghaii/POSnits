import { DiscountService } from 'src/app/core/services/apis/discount.service';
import { Constants } from 'src/app/constants/constants';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Discount } from 'src/app/core/models';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AuthService } from 'src/app/core/services/auth.service';
import { Helper } from 'src/app/core/utils/helper';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss'],
})
/**
 * DiscountComponent
 * 割引コンポーネント
 */
export class DiscountComponent implements OnInit {
  shopId = '';
  status = false;
  submitted = false;
  addDiscount: FormGroup;
  listDiscountType: any[] = Constants.listDiscountType;
  discountList: any[] = [];
  discoutListFilter: any[] = [];
  arrList: any[] = [];
  isConfirm = false;
  isOpenDialog = false;
  isEdit = false;
  isCreate = false;
  apiMessage = '';
  isDelete = false;
  isConfirmDlt = false;
  helper = Helper;

  /**
   * 現在のユーザーログイン
   */
  userLogin: any;
  selectCurrent: any;

  /**
   * オープンモーダル
   */
  open = false;
  statusOpen = null;

  /**
   * 初期表示
   * discountService
   * authService
   */
  constructor(
    private discountService: DiscountService,
    private authService: AuthService
  ) {
  }

  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.shopId = this.userLogin.shop_id;
    this.discountList = await this.getDiscountList();
  }

  /**
   * 割引リストを取得します
   */
  async getDiscountList(): Promise<any[]> {
    return await this.discountService
      .getDiscountList(this.userLogin.shopId)
      .toPromise();
  }

  /**
   * モーダルを閉じる
   * @param event
   */
  async closeModal(event: any): Promise<void> {
    if (event.status && event.status === 'upCreate') {
      this.discountList = await this.getDiscountList();
    }
    this.open = event.open;
  }

  /**
   * ドロップリストを処理する
   * @param event
   * @param classId
   */
  handleDropList(event: CdkDragDrop<string[]>, classId: number) {
    this.discoutListFilter = this.discountList.filter(
      (item) => item.class_id === classId
    );
    let beforeIndex: number = event.previousIndex;
    let afterIndex: number = event.currentIndex;

    const before: Discount = this.discoutListFilter[beforeIndex];
    const after: Discount = this.discoutListFilter[afterIndex];

    for (const { index, value } of this.discountList.map((value, index) => ({
      index,
      value,
    }))) {
      if (before.id == value.id) {
        beforeIndex = index;
      }
      if (after.id == value.id) {
        afterIndex = index;
      }
    }

    moveItemInArray(this.discountList, beforeIndex, afterIndex);
  }

  /**
   * 落とす
   * @param event
   */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.discountList, event.previousIndex, event.currentIndex);
    this.handleUpdateList(this.discountList);
    let index = 0;
    this.arrList.forEach((item) => {
      item.sort = index;
      index++;
    });
    this.updateSortDiscount();
  }

  /**
   * 更新リストを処理します
   * @param array
   */
  handleUpdateList(array: any[]): void {
    this.arrList = [];
    array.forEach((element) => {
      this.arrList.push(element);
    });
  }

  /**
   * フォームフィールドに簡単にアクセスできる便利なゲッター
   */
  get f() {
    return this.addDiscount.controls;
  }

  /**
   * 並べ替え割引を更新する
   */
  updateSortDiscount(): void {
    const discount = {
      shop_id: this.shopId,
      list: JSON.stringify(this.arrList),
    };
    this.discountService.updateSortDiscount(discount).subscribe((techList) => {
      this.getDiscountList();
    });
  }

  /**
   * レジスターを開く
   */
  openModal(status?: string): void {
    if (status === 'create') {
      this.selectCurrent = null;
    }
    this.open = true;
  }

  /**
   * アイテムを選択
   * @param input
   */
  selectItem(input: any) {
    this.selectCurrent = input;

    this.openModal('update');
  }

  /**
   * Toggle big list
   */
  toggleBigList(): void {
    const toggle = document.getElementById('toggle-bigList');
    const btnToggle = document.getElementById('btn-toggle-bigList');
    if (toggle.hasAttribute('open')) {
      toggle.removeAttribute('open');
      toggle.classList.remove('animation');
      btnToggle.classList.toggle('animation');
    } else {
      toggle.setAttribute('open', "");
      toggle.classList.toggle('animation');
      btnToggle.classList.toggle('animation');
    }
  }

  /**
   * Check Category
   */
  checkCategory(discountCd: string): string {
    const cd: any = Constants.listDiscountCd.find(x => x.value === discountCd);
    return cd.value === '00' ? 'すべて' : cd.key;
  }
}
