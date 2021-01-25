import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
} from '@angular/core';
import { MenuReserveService } from 'src/app/core/services/apis/menu-reserve.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-menu-registration-create-modal',
  templateUrl: './menu-registration-create-modal.component.html',
  styleUrls: ['./menu-registration-create-modal.component.scss'],
})

/**
 * MenuRegistrationCreateModalComponent
 * メニュー登録モーダルコンポーネントの作成
 */
export class MenuRegistrationCreateModalComponent implements OnInit, OnChanges {
  public submitted: boolean = false;
  public listMenu: any[];
  public userLogin: any;
  public isFocusItem: boolean = false;

  @Input() open: boolean;
  @Input() submit: boolean;
  @Input() selectCurrent: any;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);

  /**
   * コンストラクタ
   * @param menuServiece
   * @param authService
   */
  constructor(
    private menuServiece: MenuReserveService,
    private authService: AuthService
  ) {}

  /**
   * ポップアップの変更
   */
  async ngOnChanges(): Promise<void> {
    if (this.open == true) {
      this.userLogin = await this.authService.getCurrentUser().toPromise();
      this.listMenu = await this.getListMenu();
    }
  }

  /**
   * リストメニューを取得
   */
  async getListMenu(): Promise<any[]> {
    return await this.menuServiece
      .getListReserveMenu(this.userLogin.shop_id)
      .toPromise();
  }

  /**
   * 初期表示
   */
  ngOnInit(): void {
    this.listMenu = [];
  }

  /**
   * モーダルを閉じる
   */
  closeModal(): void {
    this.submitted = false;
    this.confirm.emit({ open: false, submit: false });
  }

  /**
   * リストの詳細をリセット
   */
  resetListDetails(): void {
    this.submitted = false;
    this.confirm.emit({ open: false, submit: false });
    this.menuServiece.listMenu.length = 0;
  }

  /**
   * Toggle list
   */
  toggleAccordian(event: any, index?: any): any {
    event.classList.toggle('active');
    const panel = event.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      panel.style.maxHeight = null;
    }
  }
}
