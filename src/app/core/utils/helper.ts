import { Constants } from 'src/app/constants/constants';

export class Helper {
  static listSex = Constants.sex;

  constructor() {
  }

  /**
   * convert Sex from number to string
   */
  static getSex(data) {
    let sex = '';
    for (const item of this.listSex) {
      if (item.key === data) {
        sex = item.value;
      }
    }
    return sex;
  }

  /**
   * 数値を通貨にフォーマットする
   * @param number
   */
  static formatCurrency(number: number) {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(number);
  }

  /**
   * 文字列を時間にフォーマットします
   * @param time
   */
  static formatTime(time: string): string {
    return time.substr(0, 5);
  }

  /**
   * Generate Time
   * @param number
   */
  static generateTime(number: number): any {
    const range: any[] = [];
    for (let i: number = 0; i <= number; i++) {
      let hour: string = i.toString();
      if (i < 10) {
        hour = '0' + i;
      }
      for (let j: number = 0; j < 6; j++) {
        let minute: string = (j * 10).toString();
        if (minute == '0') {
          minute = '0' + minute;
        }
        if ((i == number && j == 0) || i < number) {
          range.push({
            value: hour + ':' + minute,
            text: hour + ':' + minute,
          });
        }
      }
    }
    return range;
  }

  /**
   * フォーマットゼロ
   *
   * @param {Number} number
   *
   * @return {String}
   */
  static formatZero(num: number): string {
    if (num && num < 10) {
      return '0' + num;
    } else {
      return num.toString();
    }
  }

  /**
   * Generate Time
   * @param number
   */
  static generateTimeForShop(number: number): any {
    const range: any[] = [];
    for (let i: number = 0; i <= number; i++) {
      let hour: string = i.toString();
      if (i < 10) {
        hour = '0' + i;
      }
      for (let j: number = 0; j < 4; j += 3) {
        let minute: string = (j * 10).toString();
        if (minute == '0') {
          minute = '0' + minute;
        }
        if ((i == number && j == 0) || i < number) {
          range.push({
            value: hour + ':' + minute,
            text: hour + ':' + minute,
          });
        }
      }
    }
    return range;
  }

  /**
   * Check type image
   * @param file File
   */
  static checkTypeFile(file: File): boolean {
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    return validImageTypes.includes(file.type);
  }
}
