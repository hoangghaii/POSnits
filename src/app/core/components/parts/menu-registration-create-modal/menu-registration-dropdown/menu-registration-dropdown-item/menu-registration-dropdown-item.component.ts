import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MenuReserveService } from 'src/app/core/services/apis/menu-reserve.service';
import { Helper } from 'src/app/core/utils/helper';

@Component({
  selector: 'app-menu-registration-dropdown-item',
  templateUrl: './menu-registration-dropdown-item.component.html',
  styleUrls: ['./menu-registration-dropdown-item.component.scss'],
})

/**
 * MenuRegistrationDropdownItemComponent
 * メニュー登録ドロップダウンアイテムコンポーネント
 */
export class MenuRegistrationDropdownItemComponent
  implements OnInit, OnChanges {
  public isFocusItem: boolean = false;
  public isChoose: boolean = false;
  public helper = Helper;

  @Input() detail: any;
  @Input() open: boolean;
  @Input() idParent: string;
  @Input() category_cd: string;

  /**
   * コンストラクタ
   * @param menuService
   */
  constructor(private menuService: MenuReserveService) {}

  /**
   * ポップアップの変更
   */
  ngOnChanges(): void {
    let obj = {
      idParent: this.idParent,
      category_cd: this.category_cd,
      id: this.detail.id,
      name: this.detail.name,
      price: this.detail.price,
    };
    this.isChoose = this.menuService.isExist(obj);
    if (this.open && this.isChoose) {
      this.isFocusItem = true;
    }
  }

  /**
   * 初期表示
   */
  ngOnInit(): void {}

  /**
   * 背景を切り替える
   */
  toggleBg(): void {
    let list = [];
    let obj = {
      idParent: this.idParent,
      category_cd: this.category_cd,
      id: this.detail.id,
      name: this.detail.name,
      price: this.detail.price,
    };
    this.isFocusItem = !this.isFocusItem;
    if (this.menuService.isExist(obj)) this.isChoose = true;
    if (this.isChoose && !this.isFocusItem) {
      this.menuService.listMenu.forEach((item) => {
        if ((JSON.stringify(obj) === JSON.stringify(item)) == false) {
          list.push(item);
        }
      });
      this.menuService.listMenu = list;
    } else {
      if (!this.isChoose && this.isFocusItem) {
        let obj = {
          idParent: this.idParent,
          category_cd: this.category_cd,
          id: this.detail.id,
          name: this.detail.name,
          price: this.detail.price,
        };
        this.menuService.addData(obj);
      }
    }
  }
}
