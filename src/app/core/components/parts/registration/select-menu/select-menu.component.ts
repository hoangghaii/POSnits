import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { find } from 'rxjs/operators';
import { MenuReserveService } from 'src/app/core/services/apis';
import { Helper } from 'src/app/core/utils/helper';

@Component({
  selector: 'app-select-menu',
  templateUrl: 'select-menu.component.html',
  styleUrls: ['select-menu.component.scss']
})

export class SelectMenuComponent implements OnInit, OnChanges {
  listMenu: any[];
  arrSelect: any[] = [];
  helper = Helper;

  @Input() arrSelectParent: any[];
  @Input() selectMenuStatus = false;
  @Input() userLogin;
  @Input() selectCurrent: any;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);

  constructor(
    private menuService: MenuReserveService,) { }

  /**
   * Change popup
   */
  ngOnChanges(): void {
    if (this.arrSelectParent && this.arrSelectParent.length > 0) {
      this.arrSelect = this.arrSelectParent;
    }
  }

  /**
   *
   */
  async ngOnInit(): Promise<void> {
    if (this.selectMenuStatus) {
      this.listMenu = await this.menuService.getListReserveMenu(this.userLogin.shop_id).toPromise();
    }
  }

  /**
   * 背景を切り替える
   */
  toggleBg(i, j, details, itemMenu): void {
    const data = {
      reservation_id: null,
      treatment_time: null,
      category_cd: itemMenu.category_cd,
      menu_id: details.id,
      menu_name: details.name
    };
    const divContent = document.getElementById('dropdown-content__item' + i + j);
    if (divContent.hasAttribute('bgPink') || divContent.className.includes('bgPink')) {
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
      this.arrSelect.push(data);
    }
  }

  /**
   * Close Popup
   */
  closeModal(): void {
    this.selectMenuStatus = false;
    this.arrSelect = [];
    this.confirm.emit({ open: false });
  }

  /**
   * On submit
   */
  onSubmit(): void {
    this.selectMenuStatus = false;
    this.confirm.emit({
      open: false,
      arrSelect: this.arrSelect
    });
  }

  /**
   * Check select
   */
  checkSelect(value): boolean {
    const a = this.arrSelectParent.find(x => (x.menu_id === value.id && x.menu_name === value.name));
    if (a) {
      return true;
    }
    return false;
  }

  /**
   * Toggle list
   */
  toggleList(i): void {
    const list = document.getElementById('dropdown-list' + i);
    const btnToggle = document.getElementById('dropdown-toggle' + i);
    if (list.hasAttribute('open')) {
      list.removeAttribute('open');
      list.classList.remove('dropdown-hidden');
      btnToggle.classList.remove('not-active');
    } else {
      list.setAttribute('open', '');
      btnToggle.classList.toggle('not-active');
      list.classList.toggle('dropdown-hidden');
    }
  }
}
