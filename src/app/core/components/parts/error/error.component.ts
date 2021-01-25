import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  /**
   * Message content
   */
  @Input() msg: any;

  /**
   * Show error
   */
  @Input() isError = false;

  /**
   * Button text
   */
  @Input() btnText = '';

  /**
   * Config width | height | ...
   */
  @Input() optStyle = {};

  /**
   * Event click キャンセルする
   */
  @Output() confirm: EventEmitter<boolean> = new EventEmitter(false);

  constructor() {
  }

  /**
   * Check type
   */
  isString(val): boolean {
    return typeof val === 'string';
  }

  /**
   * Get message
   */
  getMsg(): (string | string[]) {
    if (typeof this.msg === 'string') {
      return this.msg;
    }
    if (typeof Array.isArray(this.msg)) {
      return this.msg;
    }
  }
}
