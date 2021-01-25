import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Constants } from 'src/app/constants/constants';
import { MenuRegistrationService } from 'src/app/core/services/apis';

@Component({
  selector: 'app-accounting-input-popup',
  templateUrl: './accounting-input-popup.component.html',
  styleUrls: ['./accounting-input-popup.component.scss']
})
export class AccountingInputPopupComponent implements OnChanges {

  listMenu;
  arrSelect;
  categoryClass = Constants.categoryClass;
  @Input() isOpen = false;
  @Input() shopId;
  @Input() existArr;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);

  constructor(
    private menuRegisterService: MenuRegistrationService,
  ) { }

  /**
   * ポップアップの変更
   */
  async ngOnChanges(): Promise<void> {
    this.arrSelect = [];
    this.listMenu = [];
    if (this.isOpen == true) {
      this.listMenu = await this.menuRegisterService.getShopMenuList(this.shopId).toPromise();
      this.listMenu.map(item => {
        if (item.category_cd == this.categoryClass.SETMENU || item.category_cd == this.categoryClass.COUPON) {
          item.active = false;
          return item;
        } else {
          for (let i = 0; i < item.details.length; i++) {
            item.details[i].active = false;
          }
          return item;
        }
      });
      if (this.existArr.length > 0) {
        this.arrSelect = this.existArr;
        for (let itemMenu of this.listMenu) {
          for (let itemExist of this.existArr) {
            if ((itemExist.category_cd == this.categoryClass.SETMENU || itemExist.category_cd == this.categoryClass.COUPON)) {
              if (itemExist.id == itemMenu.id && itemExist.category_cd == itemMenu.category_cd) {
                itemMenu.active = true;
              }
            } else {
              for (let i = 0; i < itemMenu.details.length; i++) {
                if (itemExist.id == itemMenu.details[i].id && itemExist.category_cd == itemMenu.details[i].category_cd) {
                  itemMenu.details[i].active = true;
                }
              }
            }
          }
        }
      }
    }
  }

  /**
   * 背景を切り替える
   */
  async toggleBg(details): Promise<void> {
    details.active = !details.active;
    if (details.active) {
      this.arrSelect.push(details);
    } else {
      this.arrSelect = this.arrSelect.filter(itemArr => {
        if (details.id !== itemArr.id || (details.id == itemArr.id && details.category_cd !== itemArr.category_cd)) {
          return true;
        }
        return false;
      });
    }
  }

  /**
   * Toggle list
   */
  toggleList(i) {
    const list = document.getElementById('dropdown-list' + i);
    const btnToggle = document.getElementById('dropdown-toggle' + i);
    if (list.hasAttribute('open')) {
      list.removeAttribute('open');
      list.classList.remove('dropdown-hidden');
    } else {
      list.setAttribute('open', "");
      list.classList.toggle('dropdown-hidden');
    }
  }

  /**
   * Call api create / update staff menu
   */
  submit() {
    this.isOpen = false;
    this.confirm.emit({ data: this.arrSelect, open: false });
  }

  /**
   * remove row selected
   */
  async resetListDetails() {
    this.arrSelect = [];
    for (let itemMenu of this.listMenu) {
      for (let itemDetail of itemMenu.details) {
        itemDetail.active = false;
        itemMenu.active = false;
      }
    }
  }

  /**
   * Close Popup
   */
  closeModal() {
    this.isOpen = false;
    this.confirm.emit({ data: this.existArr, open: false });
  }
}
