import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Constants } from 'src/app/constants/constants';

import {ModalService} from 'src/app/core/services';
import {EquipmentMenuService, MenuReserveService} from 'src/app/core/services/apis';
import { Helper } from 'src/app/core/utils/helper';

@Component({
  selector: 'app-modal-menu-equipment',
  templateUrl: './modal-menu-equipment.component.html',
  styleUrls: ['./modal-menu-equipment.component.scss']
})
export class ModalMenuEquipmentComponent implements OnChanges {
  public listMenuTech: any[];
  public listMenuCourse: any[];
  arrSelect: any[] = [];
  @Input() listExist = [];
  @Input() open: boolean;
  @Input() selectCurrent: any;
  @Input() userLogin;
  @Input() equipmentId;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);
  helper = Helper;

  constructor(private menuService: MenuReserveService,
              private equipmentMenuService: EquipmentMenuService,
              private translate: TranslateService,
              private modalService: ModalService,) {
  }

  /**
   * ポップアップの変更
   */
  async ngOnChanges(): Promise<void> {
    if (this.open == true) {
      const listMenu = await this.menuService.getListReserveMenu(this.userLogin.shop_id)
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
  toggleList(e, index, name = 'tech'): void {
    let list;
    let btnToggle;
    if (name == 'tech') {
      list = document.getElementById('dropdown-list-tech' + index);
      btnToggle = document.getElementById('dropdown-toggle-tech' + index);
    } else {
      list = document.getElementById('dropdown-list-course' + index);
      btnToggle = document.getElementById('dropdown-toggle-course' + index);
    }
    if (list.hasAttribute('open')) {
      list.removeAttribute('open');
      list.classList.remove('dropdown-show');
    } else {
      list.setAttribute('open', "");
      list.classList.toggle('dropdown-show');
    }
    // e.classList.toggle('active');
    // if (this.listMenu[index].isActive) {
    //   this.listMenu[index].isActive = true;
    // } else {
    //   this.listMenu[index].isActive = false;
    // }
    // const panel = e.nextElementSibling;
    // if (panel.style.maxHeight) {
    //   panel.style.maxHeight = panel.scrollHeight + 'px';
    // } else {
    //   panel.style.maxHeight = null;

    // }
  }

  /**
   * Check item is existed on list
   * @param id
   * @param category_cd
   */
  checkItemExist(id, categoryCd): boolean {
    let flag = false;
    for (const item of this.listExist) {
      if (item.menu_id === id && item.category_cd == categoryCd) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  /**
   * select item
   */
  clickItem(i, j, details, itemMenu): void {
    const data = {
      equipment_id: this.equipmentId,
      category_cd: itemMenu.category_cd,
      menu_id: details.id
    };
    const divContent = document.getElementById('dropdown-content__item' + i + j);
    if (divContent.hasAttribute('bgPink')) {
      divContent.removeAttribute('bgPink');
      divContent.classList.remove('focus');
      this.arrSelect = this.arrSelect.filter(itemArr => {
        if (details.id !== itemArr.menu_id) {
          return true;
        }
        return false;
      });
    } else {
      divContent.setAttribute('bgPink', '');
      divContent.classList.toggle('focus');
      if (!this.checkItemExist(details.id, itemMenu.category_cd)) {
        this.arrSelect.push(data);
      }
    }
  }

  /**
   * call api create / update equipment menu
   */
  submit(): void {
    this.equipmentMenuService.createEquipmentMenu(this.equipmentId, this.arrSelect).subscribe(item => {
      this.translate.get('msgCompleted.registrationHasBeenCompleted').subscribe((msg: string) => {
        this.modalService.open(msg);
      });
      this.open = false;
      this.arrSelect = [];
      this.confirm.emit({name: 'getList', open: false});
    }, (error) => {
      this.modalService.open(error);
    });
  }

  /**
   * remove row selected
   */
  async resetListDetails(): Promise<void> {
    this.arrSelect = [];
    for (let i = 0; i < this.listMenuTech.length; i++) {
      for (let j = 0; j < this.listMenuTech[i].details.length; j++) {
        const divContent = document.getElementById('dropdown-content__item' + i + j);
        if (divContent.hasAttribute('bgPink')) {
          divContent.removeAttribute('bgPink');
          divContent.classList.remove('focus');
        }
      }
    }
    for (let i = 0; i < this.listMenuCourse.length; i++) {
      for (let j = 0; j < this.listMenuCourse[i].details.length; j++) {
        const divContent = document.getElementById('dropdown-content__item' + i + j);
        if (divContent.hasAttribute('bgPink')) {
          divContent.removeAttribute('bgPink');
          divContent.classList.remove('focus');
        }
      }
    }
  }

  /**
   * Close modal
   */
  closeModal(): void {
    this.open = false;
    this.arrSelect = [];
    this.confirm.emit({open: false});
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
