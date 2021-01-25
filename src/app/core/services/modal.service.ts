import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: any[] = [];

  constructor() {
  }

  /**
   * Add modal to array of active modals
   */
  add(modal: any): void {
    this.modals.push(modal);
  }

  /**
   * Remove modal from array of active modals
   */
  remove(): void {
    this.modals = this.modals.splice(1, 1);
  }

  /**
   * Open modal
   * @param msg message
   */
  open(msg?: any, opt?: any): void {
    const modal: any = this.modals[0];
    if (msg) {
      modal.msg = msg;
    }

    if (opt) {
      let optStyle = {};
      if (opt && opt.hasOwnProperty('width') && opt.width !== '') {
        optStyle = { ...optStyle, ...{ width: opt.width } };
      }

      if (opt && opt.hasOwnProperty('height') && opt.height !== '') {
        optStyle = { ...optStyle, ...{ height: opt.height } };
      }

      if (optStyle) {
        modal.optStyle = optStyle;
      }
    }
    modal.open();
  }

  /**
   * Close modal
   */
  close(): void {
    const modal: any = this.modals[0];
    modal.close();
  }
}
