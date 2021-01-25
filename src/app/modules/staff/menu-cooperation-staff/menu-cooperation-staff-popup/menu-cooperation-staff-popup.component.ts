import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from 'src/app/constants/constants';
import { ModalService } from 'src/app/core/services';
import { MenuReserveService, StaffMenuService } from 'src/app/core/services/apis';
import { Helper } from 'src/app/core/utils/helper';

@Component({
  selector: 'app-menu-cooperation-staff-popup',
  templateUrl: './menu-cooperation-staff-popup.component.html',
  styleUrls: ['./menu-cooperation-staff-popup.component.scss']
})
export class MenuCooperationStaffPopupComponent implements OnChanges {
  public listMenu: any[];
  public listMenuTech: any[];
  public listMenuCourse: any[];
  arrSelect: any[] = [];
  helper = Helper;
  @Input() isOpen: boolean;
  @Input() selectCurrent: any
  @Input() shopId;
  @Input() staffId;
  @Input() listExist;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);

  constructor(private menuService: MenuReserveService,
    private staffMenuService: StaffMenuService,
    private translate: TranslateService,
    private modalService: ModalService,) { }

  /**
   * ポップアップの変更
   */
  async ngOnChanges(): Promise<void> {
    if (this.isOpen == true) {
     const listMenu = await this.menuService.getListReserveMenu(this.shopId)
        .toPromise();
      listMenu.sort((a, b) => {
        return (Number(a.id) - Number(b.id));
      })
      this.listMenuTech = listMenu.filter(item => {
        return item.category_cd == Constants.categoryClass.TECH;
      })
      this.listMenuCourse = listMenu.filter(item => {
        return item.category_cd == Constants.categoryClass.COURSE;
      })
    }
  }

  /**
   * Toggle list
   */
  toggleList(e, i, name = 'tech') {
    let list;
    let btnToggle;
    if (name == 'tech') {
      list = document.getElementById('dropdown-list-tech' + i);
      btnToggle = document.getElementById('dropdown-toggle-tech' + i);
    } else {
      list = document.getElementById('dropdown-list-course' + i);
      btnToggle = document.getElementById('dropdown-toggle-course' + i);
    }
    if (list.hasAttribute('open')) {
      list.removeAttribute('open');
      list.classList.remove('dropdown-show');
    } else {
      list.setAttribute('open', "");
      list.classList.toggle('dropdown-show');
    }
  }

  /**
   * 背景を切り替える
   */
  toggleBg(i, j, details, itemMenu): void {
    const data = {
      staff_id: this.staffId,
      category_cd: itemMenu.category_cd,
      menu_id: details.id
    }
    const divContent = document.getElementById('dropdown-content__item' + i + j);
    if (divContent.hasAttribute('bgPink')) {
      divContent.removeAttribute('bgPink');
      divContent.classList.remove('focus');
      this.arrSelect = this.arrSelect.filter(itemArr => {
        if (details.id !== itemArr.menu_id) {
          return true;
        }
        return false;
      })
    } else {
      divContent.setAttribute('bgPink', "");
      divContent.classList.toggle('focus');
      if (!this.checkItemExist(details.id, itemMenu.category_cd)) {
        this.arrSelect.push(data);
      }
    }
  }

  /**
   * Call api create / update staff menu
   */
  submit() {
    this.staffMenuService.createStaffMenu(this.staffId, this.arrSelect).subscribe(item => {
      this.translate.get('msgCompleted.registrationHasBeenCompleted').subscribe((msg: string) => {
        this.modalService.open(msg);
      });
      this.isOpen = false;
      this.arrSelect = [];
      this.confirm.emit({ name: 'getList', open: false })
    }, (error) => {
      this.modalService.open(error);
    })
  }

  /**
   * remove row selected
   */
  async resetListDetails() {
    let i, j: number
    this.arrSelect = [];
    for (i = 0; i < this.listMenuTech.length; i++) {
      for (j = 0; j < this.listMenuTech[i].details.length; j++) {
        const divContent = document.getElementById('dropdown-content__item' + i + j);
        if (divContent.hasAttribute('bgPink')) {
          divContent.removeAttribute('bgPink');
          divContent.classList.remove('focus');
        }
      }
    }
    for (i = 0; i < this.listMenuCourse.length; i++) {
      for (j = 0; j < this.listMenuCourse[i].details.length; j++) {
        const divContent = document.getElementById('dropdown-content__item' + i + j);
        if (divContent.hasAttribute('bgPink')) {
          divContent.removeAttribute('bgPink');
          divContent.classList.remove('focus');
        }
      }
    }
  }

  /**
   * Close Popup
   */
  closeModal() {
    this.isOpen = false;
    this.arrSelect = [];
    this.confirm.emit({ open: false });
  }

  /**
   * Check item is existed on list
   * @param id
   */
  checkItemExist(id, category_cd) {
    let flag = false;
    for (const item of this.listExist) {
      if (item.menu_id === id && item.category_cd === category_cd) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  /**
   * Toggle list
   */
  toggleAccordian(event: any): any {
    event.classList.toggle('active');
    const panel = event.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      panel.style.maxHeight = null;
    }
  }

}
