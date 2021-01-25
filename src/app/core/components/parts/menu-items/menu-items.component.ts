import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {MenuReserveService} from '../../../../core/services/apis';

import {Helper} from '../../../../core/utils/helper';


@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss']
})
export class MenuItemsComponent implements OnInit, OnChanges {
  helper = Helper;
  @Input() currentMenus;
  @Input() menuType;
  @Input() isOpen: boolean;
  menuItems = [];
  loginUser;
  selectMenus = [];

  @Output() select: EventEmitter<object> = new EventEmitter<object>(null);
  /**
   * View calendar
   */
  @ViewChild('menuItem', {static: true}) menuItem: ElementRef;

  constructor(
    private menuService: MenuReserveService,
    private renderer: Renderer2,) {
      this.loginUser = JSON.parse(localStorage.getItem('POS-CURRENT-USER'));
  }

  /**
   * Init
   */
  async ngOnInit(): Promise<any> {
    this.menuItems = await this.menuService.getListReserveMenu(this.loginUser.shop_id).toPromise();
    this.menuItems.sort((a, b) => {
      if (Number(a.category_cd) === Number(b.category_cd)) {
        return (Number(a.sort) - Number(b.sort));
      } else {
        return (Number(a.category_cd) - Number(b.category_cd));
      }
    });

    setTimeout(() => {
      this.menuItem.nativeElement.querySelectorAll('.collapsible').forEach((item) => {
        item.addEventListener('click', () => {
          item.classList.toggle('active');
          item.querySelector('.dropdown-icon').style.css = 'display: flex !important;';
          const content = item.nextElementSibling;
          if (content.style.display === 'block') {
            content.style.display = 'none';
          } else {
            content.style.display = 'block';
          }
        });
      });

      this.menuItem.nativeElement.querySelectorAll('.child-item').forEach((item) => {
        item.addEventListener('click', () => {
          const menu = item.getAttribute('data-item').split('_');
          if (item.classList.contains('choice')) {
            item.classList.remove('choice');
            this.selectMenus = this.selectMenus.filter((m) => Number(m.id) !== Number(menu[1]));
          } else {
            item.classList.add('choice');
            const classMenu = this.menuItems.find((x) => Number(x.id) === Number(menu[0]));
            if (classMenu) {
              const data = classMenu.details.find((x) => Number(x.id) === Number(menu[1]));
              this.selectMenus.push(this.parseDetails(data, classMenu));
            }
          }
        });
      });
    }, 500);
  }

  ngOnChanges(): void {
    this.selectMenus = [];

    setTimeout(() => {
      this.menuItem.nativeElement.querySelectorAll('.child-item').forEach((item) => {
        item.classList.remove('choice');
        if (this.currentMenus && this.currentMenus.length > 0) {
          const menu = item.getAttribute('data-item').split('_');
          const isChoice = this.currentMenus.find(x => (Number(x.menu_id) === Number(menu[1]) && Number(x.category_cd) === Number(menu[2])));
          if (isChoice) {
            item.classList.add('choice');
            const classMenu = this.menuItems.find((x) => Number(x.id) === Number(menu[0]));
            if (classMenu) {
              const data = classMenu.details.find((x) => Number(x.id) === Number(menu[1]));
              this.selectMenus.push(this.parseDetails(data, classMenu));
            }
          }
        }
      });
    });
  }

  /**
   * Parse menu data
   */
  parseDetails(detailMenu, classMenu): any {
    return {...detailMenu, ...{class_id: classMenu.id, menu_id: detailMenu.id}};
  }

  /**
   * Get the item in menus
   */
  getItem(id: number): any {
    const menu = this.menuItems.find((x) => x.id === id);
    return menu.details.sort((a, b) => Number(a.sort) - Number(b.sort));
  }

  /**
   * Reset menu
   */
  reset(): void {
    this.selectMenus = [];
    this.menuItem.nativeElement.querySelectorAll('.child-item').forEach((item) => {
      if (item.classList.contains('choice')) {
        item.classList.remove('choice');
      }
    });
  }

  /**
   * Close Menu
   */
  close(flag = false): void {
    if (flag == true) {
      this.select.emit({status: 'close', isOpen: false, menus: this.selectMenus});
    } else {
      this.select.emit({status: 'close', isOpen: false});
    }
  }
}
