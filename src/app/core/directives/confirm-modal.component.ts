import { Component, EventEmitter, Output } from '@angular/core';
import { fadeAnimation } from 'src/app/constants/animation';

@Component({
  selector: 'app-confirm-modal',
  template: `<app-confirm-popup
    *ngIf="showPop"
    [useBtnCancel]="useBtnCancel"
    [showPop]="showPop"
    [message]="message"
    [type]="type"
    [optStyle]="optStyle"
    (confirmCancel)="cancel($event)"
    (confirmOk)="ok($event)"
  >
  </app-confirm-popup>`,
  animations: [fadeAnimation],
})
export class ConfirmModalComponent {
  /**
   * Hiden button ok
   */
  useBtnCancel = false;

  /**
   * Show popup
   */
  showPop = false;

  /**
   * 表示するメッセージ
   */
  message: string;

  /**
   * Type of message
   */
  type = 'info';

  /**
   * Set more style
   */
  optStyle: object;

  /**
   * Name action
   */
  actionName: string;

  /**
   * 確認を押した時のイベント
   */
  @Output() confirm: EventEmitter<any> = new EventEmitter();
  @Output() confirmCancel: EventEmitter<any> = new EventEmitter();
  constructor() {}

  /**
   * ポップアップを開く
   * @param message 表示する確認メッセージ
   */
  prompt(
    message: string,
    type: string = 'info',
    useBtnCancel = false,
    actionName: string = null,
    optStyle?
  ) {
    this.message = message;
    this.useBtnCancel = useBtnCancel;
    this.type = type;
    this.actionName = actionName;
    this.optStyle = optStyle;
    this.showPop = true;
  }

  /**
   * 確認ボタンを押す時の処理
   */
  ok(event) {
    this.showPop = event.showPop;
    this.confirm.emit({ name: this.actionName });
  }

  /**
   * cancel
   */
  cancel(event) {
    this.showPop = event.showPop;
    this.confirmCancel.emit();
  }
}
