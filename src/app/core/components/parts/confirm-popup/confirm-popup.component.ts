import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss']
})
export class ConfirmPopupComponent {
  /**
   * Hiden button ok
   */
  @Input() useBtnCancel = false;

  /**
   * Show popup
   */
  @Input() showPop = false;

  /**
   * 表示するメッセージ
   */
  @Input() message: string;

  /**
   * Type of message
   */
  @Input()type = 'info';

  /**
   * Set more style
   */
  @Input() optStyle: object;

  /**
   * 確認を押した時のイベント
   */
  @Output() confirmOk: EventEmitter<any> = new EventEmitter();
  @Output() confirmCancel: EventEmitter<any> = new EventEmitter();
  constructor() { }

  /**
   * 確認ボタンを押す時の処理
   */
  ok() {
    this.confirmOk.emit({showPop: false});
  }

  /**
   * cancel
   */
  cancel() {
    this.confirmCancel.emit({showPop: false});
  }
}
