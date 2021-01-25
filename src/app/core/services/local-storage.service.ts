import { Injectable, Inject } from '@angular/core';

const APP_PREFIX = 'POS-';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {
  }

  /**
   * Set item into local storage
   *
   * @param {string} key
   * @param {any} value
   *
   * @return void
   */
  setItem(key: string, value: any) {
        localStorage.setItem(`${APP_PREFIX}${key}`, JSON.stringify(value));
  }

  /**
   * Get item in storage
   *
   * @param {string} key
   *
   * @return Object|String|Number|any
   */
  getItem(key: string) {
    const value = localStorage.getItem(`${APP_PREFIX}${key}`);
    if (value && value !== 'undefined') {
      return JSON.parse(value);
    } else {
      return null;
    }
  }

  /**
   * Remove item in local storage
   *
   * @param {string} key
   *
   * @return void
   */
  remove(key: string) {
    localStorage.removeItem(`${APP_PREFIX}${key}`);
  }

  /**
   * Clear local storage
   */
  clearAll() {
    localStorage.clear();
  }
}
