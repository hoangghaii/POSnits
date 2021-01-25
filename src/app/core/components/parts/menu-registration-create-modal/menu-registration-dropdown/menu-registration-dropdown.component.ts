import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-registration-dropdown',
  templateUrl: './menu-registration-dropdown.component.html',
  styleUrls: ['./menu-registration-dropdown.component.scss'],
})

/**
 * MenuRegistrationDropdownComponent
 * メニュー登録ドロップダウンコンポーネント
 */
export class MenuRegistrationDropdownComponent implements OnInit, OnChanges {
  public isDropDownShow: boolean = false;
  public listDetails = [];
  @Input() item: any;
  @Input() open: boolean;

  /**
   * コンストラクタ
   */
  constructor() {}

  /**
   * ポップアップの変更
   */
  ngOnChanges(): void {
    if (this.open) {
      this.listDetails = this.item.details;
    }
  }

  /**
   * 初期表示
   */
  ngOnInit(): void {}

  /**
   * ドロップダウンを切り替えます
   */
  toogleDropDown(): void {
    this.isDropDownShow = !this.isDropDownShow;
  }
  
  /**
   * Toggle list
   */
  toggleAccordian(event: any, index): any {
    event.classList.toggle('active');
    const panel = event.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      panel.style.maxHeight = null;
    }
  }
}
